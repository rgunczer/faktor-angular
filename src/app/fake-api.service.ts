import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FakeApiService {

  quizId: number;
  index = 0;

  constructor(private http: HttpClient) { }

  init() {
    console.log('fakeApiService->init [do nothing]');
  }

  getQuestions(quizId: number, xApiKey: string): Observable<any> {
      this.quizId = quizId;
      return this.http.get('assets/quiz_details_' + quizId + '.json');
  }

  postAnswers(obj, xApiKey): Observable<any> {
      const obs$ = this.http.get('assets/post_result_' + this.quizId + '_' + this.index + '.json');
      this.index++;
      return obs$;
  }

}
