import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { UtilService } from './util.service';
import { ISettings } from './isettings';
import { IPersist } from './ipersist';
import { ApiService } from './api.service';
import { GenerationComponent } from './generation/generation.component';
import { StatComponent } from './stat/stat.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

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
}
