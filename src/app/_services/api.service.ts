import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { CustomHttpUrlEncodingCodec } from '../class/CustomHttpUrlEncodingCodec';

interface IUrlData {
    q: string;
    a: string;
    p: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private url: IUrlData = {
        q: '',
        a: '',
        p: ''
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

    // postAnswers(obj, xApiKey): Observable<any> {
    //     // console.log(`postAnswer: ${JSON.stringify(obj)}`);
    //     return this.http.post(
    //         this.url.a,
    //         {
    //             data: JSON.stringify(obj)
    //             // data: obj
    //         },
    //         {
    //             headers: {
    //                 'X-Api-Key': xApiKey
    //             }
    //         }
    //     );
    // }

    postAnswers(obj, xApiKey): Observable<any> {
        let payload = new HttpParams({ encoder: new CustomHttpUrlEncodingCodec() });
        payload = payload.set('data', JSON.stringify(obj));

        return this.http.post(
            this.url.a,
            payload,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-Api-Key': xApiKey
                }
            }
        );
    }

    getProgresses(xApiKey: string): Observable<any> {
        return this.http.get(this.url.p, {
            headers: {
                'X-Api-Key': xApiKey
            }
        });
    }

}
