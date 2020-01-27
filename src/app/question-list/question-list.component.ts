import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-question-list',
    templateUrl: './question-list.component.html',
    styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent implements OnInit {

    @Input() questionList: any[] = [];
    @Output() select: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    selectAssessment(q: any) {
        this.select.emit(q);
    }

}
