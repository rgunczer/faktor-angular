import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-generation',
    templateUrl: './generation.component.html',
    styleUrls: ['./generation.component.css']
})
export class GenerationComponent implements OnInit {
    value = '-';

    constructor() {}

    ngOnInit() {}

    updateValue() {
        this.value = 'Updated...';
    }
}
