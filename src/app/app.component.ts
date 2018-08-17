import { Component, OnInit } from '@angular/core';
import { UtilService } from './util.service';
import { ISettings } from './isettings';
import { IPersist } from './ipersist';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    params: ISettings =  {
        xApiKey: '',
        quizId: 0,
        progressId: 0,
        sectionId: 0
    };

    constructor(private utilService: UtilService) {}

    ngOnInit() {
        console.log('ngOnInit...');

        // this.utilService.seveSettings(
        //     {
        //         xApiKey: '-',
        //         quizId: 0,
        //         sectionId: 0,
        //         progressId: 0
        //     }
        // );
        this.onPersist({way: 'load'});
    }

    onPersist(persist: IPersist) {
        if (persist.way === 'save') {
            this.utilService.seveSettings(this.params);
        } else if (persist.way === 'load') {
            this.params = this.utilService.loadSettings();
        }
    }
}
