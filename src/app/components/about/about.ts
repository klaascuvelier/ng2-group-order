import { STORAGE_KEY_VISITED, StorageHelper } from '../../services/storage/storage';
import { Component } from '@angular/core';

@Component({
    selector: 'about',
    template: `
        <div class="content">

            <h2>Ordering food in group</h2>

            <p>Ordering food from an online food service in group can be a hassle.</p>

            <p>This service should make that a little more convenient. <a [routerLink]="['Create']">Create a new group</a>
                and share the group link with your friends. Everyone with the link to a group can add his/her order.<br/>
                The group admin takes care of actual online ordering, and can easily manage the payment status the individual
                orders</p>

            <p>Use your Meeting account to <a [routerLink]="['/login']">log in</a> and add your order to your group's page
                <a [routerLink]="['/create']">create a new group</a>.
            </p>

            <div *ngIf="(visits$|async) && (visits$|async).length > 0">
                <p>You recently visited these groups:</p>
                <ul>
                    <li *ngFor="let visit of visits$|async">
                        <a [routerLink]="['/group-order', visit.id]">{{ visit.name }}</a>
                    </li>
                </ul>
            </div>

        </div>
    `
})
export class AboutComponent {
    visits$ = this.storage.getItem(STORAGE_KEY_VISITED);

    constructor(private storage: StorageHelper) {
    }
}

