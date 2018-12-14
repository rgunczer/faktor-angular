import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { ApiService } from './_services/api.service';
import { FakeApiService } from './_services/fake-api.service';

import { Quiz } from './_models/quiz.model';
import { Solver } from './_models/solver.class';
import { Commands } from './_models/commands.enum';

import { ParametersComponent } from './parameters/parameters.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild(ParametersComponent) paramsComponent;

    loadingQuestions = false;
    loadingAnswers = false;

    actions: any;

    solver = new Solver();
    quiz = new Quiz();

    constructor(
        private apiService: ApiService
        // private apiService: FakeApiService
    ) {
        const actions = {};
        actions[Commands.GetQuestions] = this.getQuestions;
        actions[Commands.Begin] = this.begin;
        actions[Commands.Send] = this.send;
        actions[Commands.Stop] = this.stop;

        this.actions = actions;
    }

    ngOnInit() {
        this.apiService.init();
    }

    onMessage(command: number): void {
        this.actions[command].call(this);
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
                this.solver.init(this.quiz);
            });
    }
}
