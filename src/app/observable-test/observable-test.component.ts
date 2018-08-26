import { Component, OnInit } from '@angular/core';
import { Observable, Observer, fromEvent, from, range, interval, merge } from 'rxjs';
import { take, filter, map, reduce } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

@Component({
    selector: 'app-observable-test',
    templateUrl: './observable-test.component.html',
    styleUrls: ['./observable-test.component.css']
})
export class ObservableTestComponent implements OnInit {
    constructor() {}

    private createObservableFromMouseClicks() {
        fromEvent(document, 'click')
            .pipe(
                filter((e: MouseEvent) => e.clientX < window.innerWidth / 2),
                take(3)
            )
            .subscribe((e: MouseEvent) =>
                console.log(`x: ${e.clientX}, y:${e.clientY}`)
            );
    }

    private createSimpleObservable() {
        const observable = Observable.create( (observer: Observer<string>) => {
            observer.next('Simon');
            observer.next('Jen');
            observer.next('Sergi');
            observer.complete();
        });

        // 1st subscriber
        observable
            .subscribe(
                (x: string) => console.log(x),
                error => console.log(error),
                () => console.log('completed')
        );

        // 2nd subscriber
        observable
            .subscribe(
                (x: string) => console.log(x),
                error => console.log(error),
                () => console.log('completed')
        );
    }

    private ajaxObservable() {
        ajax('https://jsonplaceholder.typicode.com/todos/1')
            .subscribe(
                data => console.log(data.response),
                err => console.log(err)
            );
    }

    private fromArray() {
        const obs: Observable<string> = from(['Adria', 'Julian', 'Jen', 'Sergi']);

        obs.subscribe(
                x => console.log(x),
                err => console.log(`error: ${err}`),
                () => console.log('from [Array] completed')
            );

        obs.pipe(
            filter(x => x[0] === 'J')
        )
        .subscribe(
            x => console.log(x)
        );
    }

    private range() {
        const arr: number[] = [];
        range(1, 10)
            .subscribe(x => {
                console.log(x);
                arr.push(x);
            });

        console.log('arr:', arr);
    }

    private interval() {
        interval(1000)
            .pipe(
                take(3)
            )
            .subscribe(x => console.log(x));
    }

    private merge() {
        const a$ = interval(200).pipe(map(x => `A${x}`), take(2));
        const b$ = interval(100).pipe(map(x => `B${x}`), take(5));

        merge(a$, b$)
            .subscribe(x => console.log(x));
    }

    private map() {
        const src: Observable<number> = range(1, 5)
        const upper = src
            .pipe(
                map(x => x * 2)
            );

        upper.subscribe(x => console.log(x));
    }

    private filter() {
        const isEven = val => val % 2 === 0;
        const src: Observable<number> = range(1, 5);
        const even = src.pipe(filter(isEven));
        even.subscribe(x => console.log(x));
    }

    private reduce() {
        const src = range(1, 5);
        const sum = src.pipe( reduce( (acc, x) => acc + x ));
        sum.subscribe(x => console.log(`reduce sum is: ${x}`));
    }

    ngOnInit() {
        this.createObservableFromMouseClicks();
        this.createSimpleObservable();
        this.ajaxObservable();
        this.fromArray();
        this.range();
        this.interval();
        this.merge();
        this.map();
        this.filter();
        this.reduce();
    }
}
