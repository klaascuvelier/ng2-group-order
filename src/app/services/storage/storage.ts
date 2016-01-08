import {Injectable} from 'angular2/core';

export const STORAGE_KEY_VISITED = 'group-order-visited';
export const STORAGE_KEY_TOKEN = 'group-order-meetup-token';
export const STORAGE_KEY_USER = 'group-order-meetup-user';


@Injectable()
export class Storage
{
    hasKey (key: string): boolean
    {
        return localStorage.getItem(key) !== null;
    }

    /**
     * @param {string} key
     * @returns {Promise<any>}
     */
    getItem (key: string): Promise<any>
    {
        try {
            const data = localStorage.getItem(key);
            const value = JSON.parse(data);

            return Promise.resolve(value);
        }
        catch (exception) {
            return Promise.reject(`Could not get item ${key}: ${exception}`);
        }
    }

    /**
     * @param {string} key
     * @param {any} value
     * @returns {Promise}
     */
    setItem (key: string, value: any)
    {
        try {
            const data = JSON.stringify(value);
            localStorage.setItem(key, data);

            return Promise.resolve();
        }
        catch (exception) {
            return Promise.reject(`Could not set item ${key}: ${exception}`);
        }
    }

    /**
     * @param {string} key
     * @returns {Promise}
     */
    removeItem (key: string)
    {
        try {
            localStorage.removeItem(key);
            return Promise.resolve();
        }
        catch (exception) {
            return Promise.reject(`Could not remove item ${key}: ${exception}`);
        }
    }
}
