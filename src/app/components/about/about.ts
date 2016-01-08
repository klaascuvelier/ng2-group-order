import { Component } from 'angular2/core';
import { ROUTER_DIRECTIVES } from 'angular2/router';
import { Storage, STORAGE_KEY_VISITED } from '../../services/storage/storage';
import { Visit } from "../../classes/visit";

@Component({
    selector: 'about',
    template: require('./about.html'),
    styleUrls: [require('./about.css')],
    providers: [],
    directives: [...ROUTER_DIRECTIVES],
    pipes: []
})
export class AboutComponent
{
    storage: Storage = null;
    visits: Array<Visit> = [];

    constructor (storage: Storage)
    {
        this.storage = storage;
        this.visits = [];

        if (storage.hasKey(STORAGE_KEY_VISITED)) {
            storage
                .getItem(STORAGE_KEY_VISITED)
                .then(visits => this.visits = visits);
        }
    }
}

