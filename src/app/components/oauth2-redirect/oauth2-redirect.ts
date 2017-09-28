import { Authentication } from "../../services/authentication/authentication";
import { LocationHelper } from '../../services/location/location';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'oauth2-redirect',
    template: 'You will be redirect to the about page&hellip;',
})
export class Oauth2RedirectComponent implements OnInit
{
    constructor(
        private authentication: Authentication,
        private router: Router,
        private locationHelper: LocationHelper
    )
    {}

    ngOnInit ()
    {
        const token = LocationHelper.getSearchParam('access_token');

        if (token) {

            this.authentication.getUser().take(1)
                .subscribe(user => {
                    const url = user !== null ? '/about' : '/login';
                    this.router.navigate([url]);
                });
        }
        else {
            // invalid token
            this.router.navigate(['/login']);
        }

    }
}
