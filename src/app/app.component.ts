import { Component, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { ApiService } from './_services/api.service';
import { FakeApiService } from './_services/fake-api.service';

import { Quiz } from './_models/quiz.model';
import { Solver } from './_models/solver.class';
import { Commands } from './_models/commands.enum';

import { ParametersComponent } from './parameters/parameters.component';

import { cloneDeep } from 'lodash';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild(ParametersComponent, { static: true }) paramsComponent;

    loadingQuestions = false;
    loadingAnswers = false;

    actions: any;

    sequence = 0;
    notFoundTreshold = 0;
    notFoundCount = 0;
    stopGettingMoreQuestions = true;

    solver = new Solver();
    quiz = new Quiz();
    progresses: any[] = [];
    questionList: any[] = [];
    frozenList: any[] = [];
    questionPool: any[] = [];

    frozenListCheckResult: any[] = [];

    constructor(
        private apiService: ApiService
        // private apiService: FakeApiService
    ) {
        const actions = {};
        // actions[Commands.GetQuestions] = this.getQuestions;
        actions[Commands.Begin] = this.begin;
        actions[Commands.Send] = this.send;
        actions[Commands.Stop] = this.stop;
        actions[Commands.GetProgresses] = this.getProgresses;

        this.actions = actions;
    }

    ngOnInit() {
        this.apiService.init();
    }

    onMessage(command: number): void {
        this.actions[command].call(this);
    }

    onActivateProgress(progressObj: any): void {
        console.log(`onActivateProgress: ${JSON.stringify(progressObj)}`);
        this.paramsComponent.params.progressId = progressObj.id;
    }

    onFrozeAnswerForQuestion(questionObj: any): void {
        this.frozenList.push(cloneDeep(questionObj));
    }

    onSelectQuestionList(boo: any) {
        this.quiz.questions.length = 0;
        boo.data.assessment.sections[0].questions.forEach(q => {
            q.answers[0].selected = true;
            this.quiz.questions.push(q);
        });
        this.solver.init(this.quiz);

        this.checkAgainstFrozenList();
        this.applyFrozenAnswers();
    }

    onPersist(type: 'save' | 'load'): void {
        console.log(`onPersist: ${type}...`);

        if (type === 'save') {
            localStorage.setItem('frozen', JSON.stringify(this.frozenList));
        } else if (type === 'load') {
            this.frozenList = JSON.parse(localStorage.getItem('frozen'));
        }
    }

    onGetOneQuestion(): void {
        this.stopGettingMoreQuestions = true;
        this.getQuestions();
    }

    onBeginGettingQuestions(): void {
        this.stopGettingMoreQuestions = false;
        this.getQuestions();
    }

    onStopGettingQuestions(): void {
        this.stopGettingMoreQuestions = true;
    }

    onSendAnswers(): void {
        this.send();
    }

    applyFrozenAnswers() {
        console.log('apply frozen answers...');

        this.frozenList.forEach(fa => {
            const frozenAnswerId = this.getSelectedAnswerIdFromQuestion(fa);
            const question = this.quiz.questions.find(x => x.id === fa.id);

            if (question) {
                question.frozen = false;
                question.answers.forEach(a => {
                    if (a.id === frozenAnswerId) {
                        a.selected = true;
                        question.frozen = true;
                    } else {
                        a.selected = false;
                    }
                });

            }
        });

    }

    private getSelectedAnswerIdFromQuestion(q: any): number {
        for (let i = 0; i < q.answers.length; ++i) {
            const answer = q.answers[i];
            if (answer.selected) {
                return answer.id;
            }
        }
        return -1;
    }


    private send() {
        const params = this.paramsComponent.params;
        this.loadingAnswers = true;
        const obj = this.solver.getObjToSend(params);
        this.solver.insertNewGeneration();
        this.apiService.postAnswers(obj, params.xApiKey)
            .pipe(
                finalize(() => this.loadingAnswers = false)
            )
            .subscribe((data: any) => {
                this.solver.update(data.assessment.user_score, data.assessment.result);

                if (this.solver.canContinue()) {
                    this.solver.calcNext();
                    setTimeout(() => {
                        this.send();
                    }, 1000);
                }
            });
    }

    private begin() {
        this.paramsComponent.onSaveParams();
        this.solver.init(this.quiz);
        this.solver.stop = false;
        this.send();
    }

    private stop() {
        this.solver.stop = true;
    }

    private getQuestions() {
        const params = this.paramsComponent.params;
        this.quiz.reset();

        this.loadingQuestions = true;
        this.apiService.getQuestions(params.quizId, params.xApiKey)
            .pipe(
                finalize(() => this.loadingQuestions = false)
            )
            .subscribe((data: any) => {
                console.log('received questions: ', data);
                this.quiz.questions.length = 0;
                this.quiz.passingMark = data.assessment.passing_marks;
                this.quiz.sectionId = data.assessment.sections[0].id;
                data.assessment.sections[0].questions.forEach(q => {
                    q.answers[0].selected = true;
                    this.quiz.questions.push(q);
                });
                // this.solver.init(this.quiz);

                this.questionList.unshift({
                    id: this.sequence++,
                    time: new Date(),
                    data
                });

                this.calcPool(data.assessment.sections[0].questions);
                this.checkAgainstFrozenList();
                this.applyFrozenAnswers();

                if (!this.stopGettingMoreQuestions) {

                    if (this.notFoundCount) {
                        setTimeout(() => {
                            this.getQuestions();
                        }, 500);
                    }
                }
            });
    }

    private calcPool(questions: any[]): void {

        questions.forEach(q => {

            if (!this.questionPool.find(p => p.id === q.id)) {
                this.questionPool.push(cloneDeep(q));
            }

        });

    }

    private getProgresses() {
        const params = this.paramsComponent.params;

        this.apiService.getProgresses(params.xApiKey)
            .subscribe(data => {
                console.log(data);
                this.progresses = data.progresses;
            });
    }

    checkAgainstFrozenList(): void {
        const result = this.innerCheckFrozenList();
        this.frozenListCheckResult = result;

        this.notFoundCount = result.reduce((acc, item) => {
            return item.found === false ? acc + 1 : acc;
        }, 0);
    }

    private innerCheckFrozenList() {
        const result = [];

        this.quiz.questions.forEach(q => {
            const found = this.frozenList.some(f => f.id === q.id);
            result.push({
                id: q.id,
                found
            });
        });

        return result;
    }

}
