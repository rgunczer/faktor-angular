import { Component, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { UtilService } from './util.service';
import { Settings } from './settings.model';
import { ApiService } from './api.service';
import { GenerationComponent } from './generation/generation.component';
import { StatComponent } from './stat/stat.component';

import * as _ from 'lodash';
import { Observable, Observer } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    hideDiv = true;
    sampleText = '';

    myItemSet = true;

    myClassToSet = 'myRed';

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

    showHideDiv() {
        this.hideDiv = !this.hideDiv;
    }
}
