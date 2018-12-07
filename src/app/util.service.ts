import { Injectable } from '@angular/core';
import { Settings } from './settings.model';

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    private readonly key = 'fAkToRpArAmS';

    constructor() {}

    loadSettings(): Settings {
        const str = window.localStorage.getItem(this.key);
        return JSON.parse(str) || new Settings();
    }

    seveSettings(params: Settings): void {
        window.localStorage.setItem(this.key, JSON.stringify(params));
    }
}
