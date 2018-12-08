import { Component, OnInit, Input } from '@angular/core';
import { Quiz } from '../_models/quiz.model';
import { Solver } from '../_models/solver.class';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.css']
})
export class StatComponent implements OnInit {

    @Input() quiz: Quiz;
    @Input() solver: Solver;

    constructor() { }

    ngOnInit() {
    }

}
