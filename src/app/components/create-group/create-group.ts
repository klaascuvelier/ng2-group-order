import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { DataStore } from '../../services/datastore/datastore';
import { Authentication } from '../../services/authentication/authentication';
import { UuidGenerator } from '../../services/uuid/uuid-generator';

import { GroupOrder, GroupOrderStatus } from '../../classes/group-order';
import { User } from '../../classes/user';

@Component({
    selector: 'create-group',
    template: `
        <div class="content">
            <h2>Create a new group order</h2>

            <form (submit)="createGroupOrder(groupName.value, groupOrderUrl.value, groupDescription.value, groupAdmins.value)">
                <fieldset>
                    <label>Group Name</label>
                    <input type="text" placeholder="some group name" #groupName>
                </fieldset>

                <fieldset>
                    <label>Order description</label>
                    <textarea #groupDescription></textarea>
                </fieldset>

                <fieldset>
                    <label>Order url</label>
                    <input type="url" placeholder="http://www.pizza.be" #groupOrderUrl>
                </fieldset>

                <fieldset>
                    <label>Organizer</label>
                    <input type="text" disabled value="{{ (user$|async)?.name }}">
                </fieldset>

                <fieldset>
                    <label>Other admins (add user's id, comma separated)</label>
                    <input type="text" #groupAdmins placeholder="124895, 23498983" />
                </fieldset>

                <fieldset class="submit">
                    <button
                        [disabled]="!(user$|async)"
                        type="submit"
                    >Create group</button>
                </fieldset>
            </form>
        </div>
    `
})
export class CreateGroupComponent
{
    user$ = this.authentication.getUser();

    constructor (
        private dataStore: DataStore,
        private authentication: Authentication,
        private router: Router,
        private uuidGenerator: UuidGenerator
    ) {}

    createGroupOrder (name, orderUrl, description, admins)
    {
        this.user$
            .subscribe(user => {
                const id = this.uuidGenerator.generate();
                const adminIds = admins
                    .split(',')
                    .map(adminId => adminId.trim())
                    .filter(adminId => /^[0-9]+$/.test(adminId))
                    .map(adminId => Number(adminId))
                    .filter(adminId => adminId !== user.id);

                const order = GroupOrder.build({
                    id,
                    name,
                    orderUrl,
                    description,
                    creatorName: user.name,
                    creatorId: user.id,
                    status: GroupOrderStatus.OPEN,
                    admins: adminIds
                });

                // You'd think this might cause some race condition, but haven't experienced it yet
                this.dataStore.createGroupOrder(order);
                this.router.navigate(['/group-order', id]);
            });
    }
}
