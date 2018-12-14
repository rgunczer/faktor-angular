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

console.log(`Angular: ${VERSION.full}, jQuery: ${$.fn.jquery}`);

@NgModule({
    declarations: [
        AppComponent,
        GenerationComponent,
        QuestionComponent,
        ParametersComponent,
        StatComponent
    ],
    imports: [BrowserModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
