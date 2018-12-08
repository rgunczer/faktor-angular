import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';

interface IUrlData {
    q: string;
    a: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private url: IUrlData = {
        q: '',
        a: ''
    };
    private lastHttpError: any = null;

    constructor(private http: HttpClient) {}

    getUrlObject() {
        return this.url;
    }

    getLastHttpError() {
        return this.lastHttpError;
    }

    errHandler(error: HttpErrorResponse) {
        this.lastHttpError = error;
        return throwError('HTTP ERROR: ' + error.message);
    }

    init() {
        this.http.get<IUrlData>('assets/api.json')
            .pipe(
                catchError(this.errHandler)
            )
            .subscribe( (data: IUrlData) => {
                this.url = data;
            } );
    }

    getQuestions(quizId: number, xApiKey: string): Observable<any> {
        // console.log(`getQuestions quizId=${quizId}`);
        return this.http.get(
            this.url.q + quizId,
            {
                headers: {
                    'X-Api-Key': xApiKey
                }
            }
        );
    }

    postAnswers(obj, xApiKey): Observable<any> {
        // console.log(`postAnswer: ${JSON.stringify(obj)}`);
        return this.http.post(
            this.url.a,
            {
                data: JSON.stringify(obj)
            },
            {
                headers: {
                    'X-Api-Key': xApiKey
                }
            }
        );
    }

}
