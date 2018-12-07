import { Quiz } from './quiz';

export class Solver {

    questionIndex = 0;
    generations: any[] = [];
    stop = true;
    quiz: Quiz = null;

    assessment = {
        score: 0,
        result: ''
    };

    reset() {
        console.log('reset...');
        this.questionIndex = 0;
        this.generations.length = 0;
        this.stop = true;
        this.quiz = null;
        this.assessment.score = 0;
        this.assessment.result = '';
    }

    init(quiz: Quiz) {
        console.log('begin to solve:', quiz);
        this.reset();

        this.quiz = quiz;
    }

    getCurrentAnswerForQuestion(q) {
        for (let i = 0; i < q.answers.length; ++i) {
            if (q.answers[i].selected) {
                return [ q.answers[i].id ];
            }
        }
    }

    getQuestionsWithAnswers(questions) {
        const qa = [];
        questions.forEach(q => {
            qa.push({
                question_id: q.id,
                answer_ids: this.getCurrentAnswerForQuestion(q)
            });
        });
        return qa;
    }

    updateCurrentGenerationWithAssessmentResults() {
        const g = this.getCurrentGeneration();
        g.score = this.assessment.score;
        g.result = this.assessment.result;
    }

    insertNewGeneration() {
        this.generations.push({
            score: -1,
            result: '...',
            questionIndex: this.questionIndex,
            answerIndex: this.getSelectedAnswerIndex(this.getCurrentQuestion())
        });
    }

    getObjToSend(params) {
        return {
            progress_id: params.progressId,
            content_id: params.quizId,
            sections: [
                {
                    section_id: params.sectionId,
                    questions: this.getQuestionsWithAnswers(this.quiz.questions)
                }
            ]
        };
    }

    getSelectedAnswerIndex(q) {
        for (let i = 0; i < q.answers.length; ++i) {
            if (q.answers[i].selected) {
                return i;
            }
        }
    }

    getCurrentQuestion() {
        const q = this.quiz.questions[this.questionIndex];
        return q;
    }

    getCurrentGeneration() {
        const g = this.generations[this.generations.length - 1];
        return g;
    }

    getLastQuestion() {
        const q = this.quiz.questions[this.quiz.questions.length - 1];
        return q;
    }

    getLastGeneration() {
        const g = this.generations[this.generations.length - 2];
        return g;
    }

    update(userScore, result) {
        this.assessment.score = userScore;
        this.assessment.result = result;
        this.updateCurrentGenerationWithAssessmentResults();
    }

    calcNext() {
        const self = this;

        function selectNextAnswer(q) {
            let index = self.getSelectedAnswerIndex(q);
            const length = q.answers.length;

            if (index < length - 1) {
                q.answers[index].selected = false;
                q.answers[++index].selected = true;
                return true;
            }
            return false;
        }

        function moveToNextQuestion() {
            const question = self.getCurrentQuestion();
            const lastQuestion = self.getLastQuestion();

            if (question.id !== lastQuestion.id) {
                ++self.questionIndex;
            }
        }

        function checkToStop() { // FIXME: rewrite
            const question = self.getCurrentQuestion();
            const lastQuestion = self.getLastQuestion();

            if (question.id === lastQuestion.id) {
                const answerIndex = self.getSelectedAnswerIndex(question);
                if (answerIndex === question.answers.length - 1) {
                    this.stop = true;
                }
            }
        }

        function markCorrectAnswerInGeneration(g) {
            g.info = 'Correct!';
        }

        function compareGenerationsAndSelectNextQuestionOrAnswer() {
            const question = self.getCurrentQuestion();
            const answerIndex = self.getSelectedAnswerIndex(question);
            const lastGeneration = self.getLastGeneration();
            const currentGeneration = self.getCurrentGeneration();

            if (currentGeneration.score > lastGeneration.score) {
                markCorrectAnswerInGeneration(currentGeneration);
                moveToNextQuestion();
            } else if (currentGeneration.score < lastGeneration.score) {
                question.answers[answerIndex].selected = false;
                question.answers[answerIndex - 1].selected = true;
                currentGeneration.score = lastGeneration.score; // adjust score!
                markCorrectAnswerInGeneration(lastGeneration);
                moveToNextQuestion();
            } else if (currentGeneration.score === lastGeneration.score) {
                selectNextAnswer(question);
            }
        }

        if (this.generations.length >= 2) {
            compareGenerationsAndSelectNextQuestionOrAnswer();
        } else {
            const question = self.getCurrentQuestion();
            selectNextAnswer(question);
        }
        checkToStop(); // FIXME: rewrite this function
    }

    canContinue(): boolean {
        const can = this.assessment.result === 'FAIL' && !this.stop;
        return can;
    }

}
