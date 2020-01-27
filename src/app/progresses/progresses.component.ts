import { Component, OnInit, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Commands } from '../_models/commands.enum';

@Component({
    selector: 'app-progresses',
    templateUrl: './progresses.component.html',
    styleUrls: ['./progresses.component.css']
})
export class ProgressesComponent implements OnInit, OnChanges {

    @Input() list: any[];
    @Output() message: EventEmitter<number> = new EventEmitter();
    @Output() activate: EventEmitter<any> = new EventEmitter();

    show = 'all';
    filteredList: any = [];
    selectedItem: any = null;

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['list']) {
            this.showChanged(this.show);
        }
    }

    showChanged(showValue: string) {
        console.log(`showChanged: ${showValue}`);
        if (this.show === 'all') {
            this.filteredList = this.list.map(x => x);
        } else {
            this.filteredList = this.list.filter(x => x.status === showValue);
        }
    }

    onGetProgresses() {
        this.message.emit(Commands.GetProgresses);
    }

    updateSelected(selectedItem: any) {
        console.log(`selectedItem: ${JSON.stringify(selectedItem)}`);
    }

    activateSelected() {
        this.activate.emit(this.selectedItem);
    }

}
