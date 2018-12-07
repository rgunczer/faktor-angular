import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UtilService } from './util.service';
import { Settings } from './settings.model';
import { ApiService } from './api.service';
import { GenerationComponent } from './generation/generation.component';
import { StatComponent } from './stat/stat.component';

import * as _ from 'lodash';
import { Observable, Observer } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Solver } from './solver';
import { Quiz } from './quiz';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    loadingQuestions = false;

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
        private apiService: ApiService
    ) {
    }

    updateChildComponent() {
        this.generationComponent.updateValue();
    }

    ngOnInit() {
        console.log('ngOnInit...');
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
        console.log('onSend...');
    }

    onBegin() {
        console.log('onBegin...');
    }

    showStats() {
        console.log('showStats...');
    }

    onGetQuestions() {
        this.solver.reset();
        this.quiz.reset();

        this.loadingQuestions = true;
        this.apiService.getQuestions(this.params.quizId, this.params.xApiKey)
            .pipe(
                finalize(() => this.loadingQuestions = false)
            )
            .subscribe((data: any) => {
                console.log(data);
                this.quiz.questions.length = 0;
                this.quiz.passingMark = data.assessment.passing_marks;
                data.assessment.sections[0].questions.forEach(q => {
                    q.answers[0].selected = true;
                    this.quiz.questions.push(q);
                });
            });
    }
}
