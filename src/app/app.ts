import { Authentication } from './services/authentication/authentication';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import '../rxjs-import';

/*
 * App Component
 * Top Level Component
 */
@Component({
    selector: 'app', // <app></app>
    encapsulation: ViewEncapsulation.None,
    styles: [
            `

            body {
                background: #f9f9f9;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                font-size: 16px;
                line-height: 20px;
                color: #222233;
            }

            a {
                color: #03A9F4;
            }

            form {
                background: #fff;
                margin: 10px 0;
                padding: 30px 10px;
                border: 1px solid #ddd;
                border-radius: 2px;
            }

            fieldset {
                border: none;
                background: transparent;
            }
            fieldset.submit {
                margin-top: 10px;
                text-align: right;
            }

            label {
                float: left;
                display: block;
                width: 40%;
            }

            textarea,
            input[type="text"],
            input[type="password"],
            input[type="email"],
            input[type="url"],
            input[type="number"] {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                font-size: 16px;
                line-height: 20px;
                border: 1px solid #ddd;
                border-radius: 2px;
                padding: 5px 5px;
                display: block;
                box-sizing: border-box;
                width: 60%;
            }

            input[type="submit"],
            button[type="submit"],
            button[type="button"] {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                font-size: 16px;
                line-height: 20px;
                border: none;
                box-shadow: none;
                border-radius: 2px;
                padding: 5px 10px;
                cursor: pointer;
                background: #03A9F4;
                color: #fff;
            }

            table {
                border-collapse: collapse;
            }

            th {
                background: #eee;
                text-align: left;
            }

            td, th {
                padding: 4px 8px;
            }

            tr:nth-child(2n + 1) td {
                background: #f8f8f8;
            }

            tr:nth-child(2n) td {
                background: #f1f1f1;
            }

            tr td, tr th {
                border: 1px solid #ddd;
            }

            tr td.cost {
                text-align: right;
            }
            tr td.center {
                text-align: center;
            }
            tr td.payment label {
                display: inline-block;
                width: auto;
            }
            tr td.paid {
                padding: 2px 5px;
                background: limegreen;
                color: #fff;
            }
            tr td.unpaid {
                padding: 2px 5px;
                background: red;
                color: #fff;
            }

            .content {
                max-width: 1000px;
                margin: 0 auto;
            }

            .wrap:after {
                content: "";
                display: table;
                clear: both;
            }

            .admin-box {
                box-sizing: border-box;
                background: #fff;
                margin: 10px 0;
                padding: 30px 10px;
                border: 1px solid #ddd;
                border-radius: 2px;
                min-height: 180px;
            }
            .admin-box.half {
                width: calc(50% - 10px);
                float: left;
            }
            .admin-box.half:first-child {
                margin-right: 10px;
            }
            .admin-box.half:last-child {
                margin-left: 10px;
            }
            .admin-box h4 {
                margin-top: 0;
            }
            

            header {
                background-color: #fff;
                padding: 16px;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.5);
            }

            header h1 {
                display: inline-block;
                margin: 0;
                font-size: 18px;
                margin-right: 15px;
            }

            header nav {
                display: inline-block;
            }

            header nav a {
                margin-right: 10px;
            }

            header .user-info {
                float: right;
                margin-right: 20px;
            }
            
            main {
                padding: 1em;
                margin-top: 50px;
            }

            footer {
                margin-top: 50px;
                text-align: center;
                font-size: 0.8em;
            }
        `
    ],
    template: `
        <header>
            <h1 class="title">Meetup Group Order</h1>

            <nav>
                <a [routerLink]="['/about']">About</a>
                <a [hidden]="(user$|async) !== null" [routerLink]="['/login']">Login</a>
                <a [routerLink]="['/create']">Create</a>
            </nav>

            <div class="user-info">
                {{ (user$ | async)?.name }}
                <small>({{ (user$ | async)?.id }})</small>
            </div>
        </header>
        <main>
            <router-outlet></router-outlet>
        </main>
    `
})
export class App implements OnInit {
    user$ = this.authentication.getUser();

    constructor(private authentication: Authentication) {
    }

    ngOnInit() {
        this.user$.subscribe(user => console.info('logged in', user));
    }
}
