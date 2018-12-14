import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Parameters } from '../_models/parameters.model';
import { Commands } from '../_models/commands.enum';
import { UtilService } from '../_services/util.service';

@Component({
    selector: 'app-parameters',
    templateUrl: './parameters.component.html',
    styleUrls: ['./parameters.component.css']
})
export class ParametersComponent implements OnInit {

    @Output() message: EventEmitter<number> = new EventEmitter();
    @Input() loadingQuestions;
    @Input() loadingAnswers;
    @Input() quiz;

    @Output() save = new EventEmitter();
    @Output() load = new EventEmitter();

    params = new Parameters();

    constructor(private utilService: UtilService) { }

    ngOnInit() {
        this.onLoadParams();
    }

    onGetQuestions() {
        this.message.emit(Commands.GetQuestions);
    }

    onSend() {
        this.message.emit(Commands.Send);
    }

    onBegin() {
        this.message.emit(Commands.Begin);
    }

    onStop() {
        this.message.emit(Commands.Stop);
    }

    onSaveParams() {
        this.utilService.saveParams(this.params);
    }

    onLoadParams() {
        this.params = this.utilService.loadParams();
        console.log(this.params);
    }

}
