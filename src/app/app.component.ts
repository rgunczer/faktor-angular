import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { UtilService } from './util.service';
import { ISettings } from './isettings';
import { IPersist } from './ipersist';
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
    asyncData = new Observable<string>( (observer: Observer<string>) => {
        // setInterval( () => {
        //     observer.next(new Date().toString());
        // }, 2000);
        setTimeout(() => {
            observer.next('Async Data');
        }, 3000);
    } );

    hideDiv = true;
    sampleText = '';

    myItemSet = true;

    myClassToSet = 'myRed';

    @ViewChild(GenerationComponent) private generationComponent: GenerationComponent;

    @ViewChildren(StatComponent) allStats: QueryList<StatComponent>;

    params: ISettings =  {
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
        this.onPersist({way: 'load'});
        this.apiService.init();


        console.log('tuple typescript');
        const pair: [string, number] = ['hello', 10];
        console.log(`pair[0] = ${pair[0]}`);
        console.log(`pair[1] = ${pair[1]}`);


        const anotherPair: [string, string, number] = ['a', 'b', 12];
        for (let i = 0; i < anotherPair.length; ++i) {
            console.log(anotherPair[i]);
        }

        console.log('lodash test: ' + _.capitalize('APPLE') );
    }

    onPersist(persist: IPersist) {
        if (persist.way === 'save') {
            this.utilService.seveSettings(this.params);
        } else if (persist.way === 'load') {
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
        // alert(this.allStats.length);
        // this.allStats.first.value = 'Test';
        this.allStats.forEach((item: StatComponent) => {
            if (item.id === 'b') {
                // item.value = 'Test';
                item.updateValue();
            }
        });
    }

    showHideDiv() {
        this.hideDiv = !this.hideDiv;
    }
}
