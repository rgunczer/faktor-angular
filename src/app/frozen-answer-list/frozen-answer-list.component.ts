import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-frozen-answer-list',
    templateUrl: './frozen-answer-list.component.html',
    styleUrls: ['./frozen-answer-list.component.css']
})
export class FrozenAnswerListComponent implements OnInit {

    @Input() list: any[] = [];
    @Output() persist: EventEmitter<string> = new EventEmitter();

    constructor() { }

    ngOnInit() {
    }

    onSave() {
        this.persist.emit('save');
    }

    onLoad() {
        this.persist.emit('load');
    }

}
