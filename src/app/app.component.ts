import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { UtilService } from './util.service';
import { ApiService } from './api.service';
import { FakeApiService } from './fake-api.service';

import { Settings } from './settings.model';
import { Solver } from './solver';
import { Quiz } from './quiz';

import { GenerationComponent } from './generation/generation.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    loadingQuestions = false;
    loadingAnswers = false;

    solver = new Solver();
    quiz = new Quiz();

    @ViewChild(GenerationComponent) private generationComponent: GenerationComponent;

    params: Settings =  {
        xApiKey: '',
        quizId: 0,
        progressId: 0,
        sectionId: 0
    };

    constructor(
        private utilService: UtilService,
        // private apiService: ApiService
        private apiService: FakeApiService
    ) {
    }

    updateChildComponent() {
        this.generationComponent.updateValue();
    }

    ngOnInit() {
        this.onPersist('load');
        this.apiService.init();
    }

    onPersist(way: 'save' | 'load') {
        if (way === 'save') {
            this.utilService.seveSettings(this.params);
        } else if (way === 'load') {
            this.params = this.utilService.loadSettings();
        }
    }

    onSend() {
        // console.log('onSend...');

        this.loadingAnswers = true;

        const obj = this.solver.getObjToSend(this.params);

        this.solver.insertNewGeneration();

        this.apiService.postAnswers(obj, this.params.xApiKey)
            .pipe(
                finalize(() => this.loadingAnswers = false)
            )
            .subscribe((data: any) => {
                this.solver.update(data.assessment.user_score, data.assessment.result);

                if (this.solver.canContinue()) {
                    this.solver.calcNext();
                    setTimeout(() => {
                        this.onSend();
                    }, 1000);
                }
            });
    }

    onBegin() {
        // console.log('onBegin...');

        this.onPersist('save');
        this.solver.init(this.quiz);
        this.solver.stop = false;
        this.onSend();
    }

    onStop() {
        console.log('onStop...');
        this.solver.stop = true;
    }

    showStats() {
        console.log('showStats...');
    }

    onGetQuestions() {
        this.quiz.reset();

        this.loadingQuestions = true;
        this.apiService.getQuestions(this.params.quizId, this.params.xApiKey)
            .pipe(
                finalize(() => this.loadingQuestions = false)
            )
            .subscribe((data: any) => {
                console.log('data: ', data);
                this.quiz.questions.length = 0;
                this.quiz.passingMark = data.assessment.passing_marks;
                data.assessment.sections[0].questions.forEach(q => {
                    q.answers[0].selected = true;
                    this.quiz.questions.push(q);
                });
                this.solver.init(this.quiz);
            });
    }
}
