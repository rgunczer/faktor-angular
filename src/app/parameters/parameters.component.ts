import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Parameters } from '../_models/parameters.model';
import { Commands } from '../_models/commands.enum';

@Component({
    selector: 'app-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.css']
})
export class ParametersComponent {

    @Output() message: EventEmitter<number> = new EventEmitter();

    @Input() params: Parameters;
    @Output() save = new EventEmitter();
    @Output() load = new EventEmitter();

    constructor() {}

    onSave() {
        this.save.emit();
    }

    onLoad() {
        this.load.emit();
    }

    onGetQuestions() {
        this.message.emit(Commands.GetQuestions);
    }

}
