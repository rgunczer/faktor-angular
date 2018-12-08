import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Parameters } from '../_models/parameters.model';

@Component({
    selector: 'app-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.css']
})
export class ParametersComponent {

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

}
