import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export const STORAGE_KEY_VISITED = 'group-order-visited';
export const STORAGE_KEY_TOKEN = 'group-order-meetup-token';
export const STORAGE_KEY_USER = 'group-order-meetup-user';


@Injectable()
export class StorageHelper {
    hasKey(key: string): boolean {
        return localStorage.getItem(key) !== null;
    }

    getItem(key: string): Observable<any> {
        try {
            const data = localStorage.getItem(key);
            const value = JSON.parse(data);

            return Observable.of(value);
        }
        catch (exception) {
            return Observable.of(null);
        }
    }

    setItem(key: string, value: any): void {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(key, data);
        }
        catch (exception) {
            console.error('could not add data to local storage', exception);
        }
    }

    removeItem(key: string): void {
        try {
            localStorage.removeItem(key);
        }
        catch (exception) {
            console.error('could not remove data from local storage', exception);
        }
    }
}
