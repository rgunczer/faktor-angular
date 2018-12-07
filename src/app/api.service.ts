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

    logHttpError(response: any) {
        this.lastHttpError = response.data;
        console.error(JSON.stringify(this.lastHttpError));
    }

    getUrlObject() {
        return this.url;
    }

    getLastHttpError() {
        return this.lastHttpError;
    }

    handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    errHandler(error: HttpErrorResponse) {
        return throwError('HTTP ERROR: ' + error.message);
    }

    init() {
        this.http.get<IUrlData>('assets/api.json')
            .pipe(
                map((data: IUrlData) => {
                    data.a += ' ddd';
                    return data;
                }),
                // catchError(this.handleError('api.json', []))
                catchError(this.errHandler)
            )
            .subscribe( (data: IUrlData) => {
                this.url = data;
                console.log('init received: ' + JSON.stringify(this.url));
            } );

        /*
        this.http.get<IUrlData>('assets/api.json')
            .subscribe(
                (data: IUrlData) => {
                    this.url = data;
                    console.log('init received: ' + JSON.stringify(this.url));
                },
                error => {
                    this.lastHttpError = error;
                    console.log('error' + JSON.stringify(error));
                },
                () => {
                    console.log('finished...');
                }
            );
            // .catch((response) => {
            //     logHttpError(response);
            // });
            */
    }

    getQuestions(quizId: number, xApiKey: string): Observable<any> {
        console.log(`getQuestions quizId=${quizId}`);
        return this.http.get(
            this.url.q + quizId,
            {
                headers: {
                    'X-Api-Key': xApiKey
                }
            }
        );
    }
/*
            this.postAnswers = function(obj, xApiKey) {
                return $http({
                    method: 'POST',
                    url: url.a,
                    headers: {
                        'X-Api-Key': xApiKey
                    },
                    data: { data: JSON.stringify(obj) }
                })
                    .then(function(response) {
                        return response.data;
                    })
                    .catch(function(response) {
                        logHttpError(response);
                    });
            };
        });
*/

}
