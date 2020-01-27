import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-question-pool',
    templateUrl: './question-pool.component.html',
    styleUrls: ['./question-pool.component.css']
})
export class QuestionPoolComponent implements OnInit {

    @Input() list: any[] = [];
    @Output() froze: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    onFrozeAnswerForQuestion(questionObj: any): void {
        this.froze.emit(questionObj);
    }

}
