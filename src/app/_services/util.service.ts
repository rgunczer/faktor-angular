import { Injectable } from '@angular/core';
import { Parameters } from '../_models/parameters.model';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    private readonly key = 'fAkToRpArAmS';

    loadParams(): Parameters {
        const str = window.localStorage.getItem(this.key);
        return JSON.parse(str) || new Parameters();
    }

    saveParams(params: Parameters): void {
        window.localStorage.setItem(this.key, JSON.stringify(params));
    }

}
