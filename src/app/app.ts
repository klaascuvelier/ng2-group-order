import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router';
import { FORM_PROVIDERS } from 'angular2/common';

import '../style/app.scss';

import { AboutComponent } from './components/about/about';
import { LoginComponent } from './components/login/login';
import { CreateGroupComponent } from './components/create-group/create-group';
import { GroupOrderComponent } from './components/group-order/group-order';
import { Oauth2RedirectComponent } from './components/oauth2-redirect/oauth2-redirect';
import { Authentication } from "./services/authentication/authentication";
import { UserInterface } from "./classes/user";

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app', // <app></app>
    providers: [...FORM_PROVIDERS],
    directives: [...ROUTER_DIRECTIVES],
    styles: [require('./app.scss')],
    template: require('./app.html')
})
@RouteConfig([
    { path: '/', redirectTo: ['About'] },
    { path: '/about', component: AboutComponent, name: 'About' },
    { path: '/login', component: LoginComponent, name: 'Login' },
    { path: '/create', component: CreateGroupComponent, name: 'Create' },
    { path: '/oauth2-redirect', component: Oauth2RedirectComponent, name: 'Oauth2Redirect' },
    { path: '/group-order/:id', component: GroupOrderComponent, name: 'GroupOrder' },
])
export class App
{
    authentication: Authentication = null;
    user: UserInterface = null;

    constructor (authentication: Authentication)
    {
        this.authentication = authentication;

        this.authentication.getUser().then(user => {
            this.user = user;
            console.info('logged in', user);
        });

        console.info('bootstrapped the app');
    }
}
