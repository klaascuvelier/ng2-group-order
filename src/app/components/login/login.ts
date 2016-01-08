import { Component, OnInit } from 'angular2/core';
import { Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Authentication } from '../../services/authentication/authentication';
import { Storage, STORAGE_KEY_VISITED } from '../../services/storage/storage';
import { Visit } from "../../classes/visit";

@Component({
    selector: 'login',
    template: require('./login.html'),
    styleUrls: [require('./login.css')],
    providers: [Authentication],
    directives: [...ROUTER_DIRECTIVES],
    pipes: []
})
export class LoginComponent implements OnInit
{
    url: string = null;
    router: Router = null;
    authentication: Authentication = null;
    loggedIn: boolean = false;
    loading: boolean = true;
    visits: Array<Visit> = [];

    constructor (authentication: Authentication, router: Router, storage: Storage)
    {
        this.router = router;
        this.authentication = authentication;
        this.url = authentication.authenticationUrl;
        this.loggedIn = false;

        if (storage.hasKey(STORAGE_KEY_VISITED)) {
            storage
                .getItem(STORAGE_KEY_VISITED)
                .then(visits => this.visits = visits);
        }
    }

    ngOnInit ()
    {
        this.loading = true;
        this.authentication
            .getUser()
            .then(user => {
                this.loading = false;
                this.loggedIn = true;
            })
            .catch(() => {
                this.loading = false;
                this.loggedIn = false;
            });
    }

}
