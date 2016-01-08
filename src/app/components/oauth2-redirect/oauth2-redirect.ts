import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';
import { Authentication } from "../../services/authentication/authentication";
import { Location } from "../../services/location/location";

@Component({
    selector: 'oauth2-redirect',
    template: 'You will be redirect to the about page&hellip;',
    providers: [],
    directives: [],
    pipes: []
})
export class Oauth2RedirectComponent implements OnInit
{
    authentication: Authentication;
    router: Router;

    constructor(authentication: Authentication, router: Router)
    {
        this.authentication = authentication;
        this.router = router;
    }

    ngOnInit ()
    {
        const token = Location.getSearchParam('access_token');

        console.info('token is', token);

        if (token) {
            this.authentication.setToken(token);
            this.authentication
                .getUser()
                .then(user => this.router.navigate(['About']))
                .catch(() => {
                    this.router.navigate(['Login']);
                });
        }
        else {
            // invalid token
            this.router.navigate(['Login']);
        }

    }
}
