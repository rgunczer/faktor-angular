import { Injectable } from '@angular/core';
import { ISettings } from './isettings';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    private readonly key = 'fAkToRpArAmS';

    constructor() {}

    loadSettings(): ISettings {
        const str = window.localStorage.getItem(this.key);
        return JSON.parse(str);
    }

    seveSettings(params: ISettings): void {
        window.localStorage.setItem(this.key, JSON.stringify(params));
    }
}
