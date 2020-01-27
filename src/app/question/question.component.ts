import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-question',
    templateUrl: './question.component.html',
    styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

    @Input() showFrozeButton = true;
    @Input() q;
    @Input() index;
    @Output() froze: EventEmitter<any> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    frozeAnswer() {
        this.froze.emit(this.q);
    }

}
