import { Component, OnDestroy, OnInit } from '@angular/core';

import { AUTH_PROVIDERS, Authentication } from '../../services/authentication/authentication';
import { STORAGE_KEY_VISITED, StorageHelper } from '../../services/storage/storage';
import { Visit } from "../../classes/visit";
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'login',
    template: `
        <div class="content">
            <h2>Login</h2>

            <p *ngIf="(loading$|async)">Checking your status&hellip;</p>

            <div *ngIf="!(loading$|async)">
                <button 
                    type="button"
                    *ngIf="!(loggedIn$|async)"
                    (click)="loginWithGithub($event)"
                >Log in with Github</button>

                <div *ngIf="(loggedIn$|async)">
                    <p>You are already logged in. 
                        Go back to your group's page to place your order, 
                        or <a [routerLink]="['/create']">create a new group</a>
                    </p>

                    <div *ngIf="(visits$|async) && (visits$|async).length > 0">
                        <p>You recently visited these groups:</p>
                        <ul>
                            <li *ngFor="let visit of visits$|async">
                                <a [routerLink]="['/groupOrder', { id: visit.id }]">{{ visit.name }}</a>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>

    `
})
export class LoginComponent implements OnInit, OnDestroy
{
    loading$ = new BehaviorSubject<boolean>(true);
    loggedIn$ = this.authentication.isAuthenticated();
    visits$ = this.storage.getItem(STORAGE_KEY_VISITED);

    private subscriptions: Array<Subscription> = [];

    constructor (
        private authentication: Authentication,
        private storage: StorageHelper
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.loggedIn$.subscribe((value) => {
                this.loading$.next(false);
                console.log(
                    'AIUTH', value
                );
            })
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    loginWithGithub(): void {
        this.authentication.login(AUTH_PROVIDERS.GITHUB);
    }
}
