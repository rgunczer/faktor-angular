import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-generation',
    templateUrl: './generation.component.html',
    styleUrls: ['./generation.component.css']
})
export class GenerationComponent implements OnInit {
    value = '-';

    @Input() g;
    @Input() index;

    constructor() {}

    ngOnInit() {}

    updateValue() {
        this.value = 'Updated...';
    }
}
