import { BrowserModule } from '@angular/platform-browser';
import { NgModule, VERSION } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GenerationComponent } from './generation/generation.component';
import { StatComponent } from './stat/stat.component';

import * as $ from 'jquery';
import { QuestionComponent } from './question/question.component';

console.log(`jQuery version is: ${$.fn.jquery}`);
console.log(`Angular version is: ${VERSION.full}`);

@NgModule({
    declarations: [
        AppComponent,
        GenerationComponent,
        StatComponent,
        QuestionComponent
    ],
    imports: [BrowserModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
