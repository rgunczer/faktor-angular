import { Component, OnInit } from '@angular/core';
import { Observable, Observer, Subscription } from 'rxjs';

@Component({
    selector: 'app-stopwatch',
    templateUrl: './stopwatch.component.html',
    styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit {

    stopwatchValue: number;
    stopwatchValue$: Observable<number>;

    private subs: Subscription = null;

    constructor() {
        const min = 1;
        const max = 3;
        this.stopwatchValue$ = Observable.create( (observer: Observer<number>) => {
            setInterval(() => {
                observer.next( Math.floor(Math.random() * (max - min + 1) + min) );
            } , 1000);
        });
    }

    ngOnInit() {
        this.startSubs();
    }

    stopSubs() {
        this.subs.unsubscribe();
        this.subs = null;
    }

    startSubs() {
        if (this.subs === null) {
            this.subs = this.stopwatchValue$
                .subscribe( num => {
                    this.stopwatchValue = num;
                });
        } else {
            alert('alrady subscribed');
        }
    }
}
