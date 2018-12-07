import { BrowserModule } from '@angular/platform-browser';
import { NgModule, VERSION } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GenerationComponent } from './generation/generation.component';
import { StatComponent } from './stat/stat.component';
import { CapitalizePipe } from './capitalize.pipe';
import { StopwatchComponent } from './stopwatch/stopwatch.component';

import * as $ from 'jquery';

console.log(`jQuery version is: ${$.fn.jquery}`);
console.log(`Angular version is: ${VERSION.full}`);

@NgModule({
    declarations: [
        AppComponent,
        GenerationComponent,
        StatComponent,
        CapitalizePipe,
        StopwatchComponent
    ],
    imports: [BrowserModule, FormsModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
