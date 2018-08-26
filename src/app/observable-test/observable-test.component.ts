import { Component, OnInit } from '@angular/core';
import { Observable, Observer, fromEvent, from, range, interval, merge, of } from 'rxjs';
import { take, filter, map, reduce, scan, flatMap, concatAll, catchError, retry, tap } from 'rxjs/operators';
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
        const src: Observable<number> = range(1, 5);
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

    private scan() {
        const average$ = interval(1000)
            .pipe(
                take(3),
                scan( (previous, current) => {
                    return {
                        sum: previous.sum + current,
                        count: previous.count + 1
                    };
                }, { sum: 0, count: 0} ),
                map( result => result.sum / result.count)
            );

        average$.subscribe(x => console.log('scan: ' + x));
    }

    private flatmap() {
        const values$ = from([
            of(1, 2, 3),
            of(4, 5, 6),
            of(7, 8, 9)
        ]);

        // values$ is and Observable that emits three Observables

        values$
            .pipe(
                flatMap(v => v)
            )
            .subscribe(v => console.log('flatMap: ' + v));
    }

    concatAll() {
        const values$ = from([
            of(1, 2, 3),
            of(4, 5, 6),
            of(7, 8, 9)
        ]);
        values$
            .pipe(
                concatAll()
            )
            .subscribe(x => console.log('concatAll: ' + x));
    }

    cancellation() {
        const counter$ = interval(1000);
        const subscription1 = counter$.subscribe(i => { console.log(`Subscription 1: ${i}`); });
        const subscription2 = counter$.subscribe(i => { console.log(`Subscription 2: ${i}`); });

        setTimeout( () => {
            console.log('cancelling subscription2');
            subscription2.unsubscribe();
        }, 2000);
    }

    wrapPromise() {
        const p = new Promise( (resolve, reject) => {
            window.setTimeout(resolve, 5000);
        });

        p.then( () => console.log('potential side effect!') );

        const subscription = from(p)
            .subscribe(msg => console.log('Observable resolved!'));

        subscription.unsubscribe();
    }

    errorHandlingSample() {
        function getJSON(arr) {
            return from(arr).pipe(map(x => JSON.parse(x)));
        }
        getJSON([
            '{"1": 1, "2": 2}',
            '{"success: true}',
            '{"enabled": true}'
        ])
        .subscribe(
            json => console.log('parsed json: ', json),
            err => console.log(err.message)
        );
    }

    errorHandlingSampleWithCatch() {  // cath the error and stop the stream default behavior
        function getJSON(arr) {
            return from(arr)
                .pipe(
                    map(x => JSON.parse(x)
                )
            );
        }
        const caught$ = getJSON([
            '{"1": 1, "2": 2}',
            '{"success: true}',
            '{"enabled": true}'
        ])
        .pipe(
            catchError(
                val => of( {error: `There was an error parsing JSON ${val}`})
            )
        );

        caught$.subscribe(
            json => console.log('parsed json: ', json),
            err => console.log('ERR: ' + err.message),
            () => console.log('complete')
        );
    }

    retry() {
        ajax('https://jsonplaceholder.typicode.com/todos/1')
            .pipe(
                retry(5)
            )
            .subscribe(
                xhr => console.log(xhr),
                err => console.log('ERROR: ' + err)
            );
    }

    tapTest() {
        const clicks$ = fromEvent(document, 'click');
        const pos$ = clicks$.pipe(
            tap(ev => console.log(ev)),
            map(ev => ev.clientX)
        );
        pos$.subscribe(x => console.log(x));
    }

    ngOnInit() {
        // this.createObservableFromMouseClicks();
        // this.createSimpleObservable();
        // this.ajaxObservable();
        // this.fromArray();
        // this.range();
        // this.interval();
        // this.merge();
        // this.map();
        // this.filter();
        // this.reduce();
        // this.scan();
        // this.flatmap();
        // this.concatAll();

        // whenever we subscribe to an Observable we get a Subscription
        // this.cancellation();
        // this.wrapPromise();

        // error handling
        // The default behavior is that whenever an error happens, the Observable stops emitting items, and complete is not called.
        // this.errorHandlingSample();
        // this.errorHandlingSampleWithCatch();
        // this.retry();
        this.tapTest();
    }
}
