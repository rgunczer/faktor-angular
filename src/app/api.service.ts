import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

    init() {
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
    }
/*
            this.getQuestions = function(quizId, xApiKey) {
                $log.debug(`getQuestions quizId=${quizId}`);
                return $http({
                    method: 'GET',
                    url: url.q + quizId,
                    headers: {
                        'X-Api-Key': xApiKey
                    }
                })
                    .then(function(response) {
                        return response.data;
                    })
                    .catch(function(response) {
                        logHttpError(response);
                    });
            };

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
