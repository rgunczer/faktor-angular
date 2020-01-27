import { BrowserModule } from '@angular/platform-browser';
import { NgModule, VERSION } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GenerationComponent } from './generation/generation.component';
import { QuestionComponent } from './question/question.component';

import * as $ from 'jquery';
import { ParametersComponent } from './parameters/parameters.component';
import { StatComponent } from './stat/stat.component';
import { ProgressesComponent } from './progresses/progresses.component';
import { QuestionListComponent } from './question-list/question-list.component';
import { FrozenAnswerListComponent } from './frozen-answer-list/frozen-answer-list.component';
import { QuestionPoolComponent } from './question-pool/question-pool.component';

console.log(`Angular: ${VERSION.full}, jQuery: ${$.fn.jquery}`);

@NgModule({
    declarations: [
        AppComponent,
        GenerationComponent,
        QuestionComponent,
        ParametersComponent,
        StatComponent,
        ProgressesComponent,
        QuestionListComponent,
        FrozenAnswerListComponent,
        QuestionPoolComponent
    ],
    imports: [BrowserModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
