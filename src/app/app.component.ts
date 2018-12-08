import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { UtilService } from './_services/util.service';
import { ApiService } from './_services/api.service';
import { FakeApiService } from './_services/fake-api.service';

import { Parameters } from './_models/parameters.model';
import { Quiz } from './_models/quiz.model';
import { Solver } from './_models/solver.class';
import { Commands } from './_models/commands.enum';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    loadingQuestions = false;
    loadingAnswers = false;

    actions: any;

    params = new Parameters();
    solver = new Solver();
    quiz = new Quiz();

    constructor(
        private utilService: UtilService,
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
        this.onLoadParams();
    }

    onMessage(command: number): void {
        this.actions[command].apply(this);
    }

    onSaveParams() {
        this.utilService.saveParams(this.params);
    }

    onLoadParams() {
        this.params = this.utilService.loadParams();
        console.log(this.params);
    }

    private send() {
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
                        this.send();
                    }, 1000);
                }
            });
    }

    private begin() {
        this.onSaveParams();
        this.solver.init(this.quiz);
        this.solver.stop = false;
        this.send();
    }

    private stop() {
        this.solver.stop = true;
    }

    private getQuestions() {
        this.quiz.reset();

        this.loadingQuestions = true;
        this.apiService.getQuestions(this.params.quizId, this.params.xApiKey)
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
