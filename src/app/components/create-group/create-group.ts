import { Component, OnInit } from 'angular2/core';
import { Router } from 'angular2/router';

import { DataStore } from '../../services/datastore/datastore';
import { Authentication } from '../../services/authentication/authentication';
import { UuidGenerator } from '../../services/uuid/uuid-generator';

import { GroupOrder, GroupOrderStatus } from '../../classes/group-order';
import { User } from '../../classes/user';

@Component({
    selector: 'create-group',
    template: require('./create-group.html'),
    styleUrls: [require('./create-group.css')],
    providers: [],
    directives: [],
    pipes: []
})
export class CreateGroupComponent implements OnInit
{
    dataStore: DataStore = null;
    authentication: Authentication = null;
    router: Router = null;
    user: User = new User();

    constructor (dataStore: DataStore, authentication: Authentication, router: Router)
    {
        this.dataStore = dataStore;
        this.authentication = authentication;
        this.router = router;
    }

    ngOnInit ()
    {
        // needs login
        this.authentication
            .getUser()
            .then(user => this.user = user)
            .catch(() => this.router.navigate(['Login']));
    }

    createGroupOrder (name, orderUrl, description, admins)
    {
        // Refetch user
        this.authentication.getUser()
            .then(user => {
                this.user = user;

                const id = UuidGenerator.generate();
                const adminIds = admins
                    .split(',')
                    .map(adminId => adminId.trim())
                    .filter(adminId => /^[0-9]+$/.test(adminId))
                    .map(adminId => Number(adminId));

                // Make sure the creators id is in the admins list
                if (adminIds.indexOf(user.id) === -1) {
                    adminIds.unshift(user.id);
                }

                const order = GroupOrder.build({
                    id,
                    name,
                    orderUrl,
                    description,
                    creatorName: user.name,
                    creatorId: user.id,
                    status: GroupOrderStatus.OPEN,
                    adminIds
                });

                // You'd think this might cause some race condition, but haven't experienced it yet
                this.dataStore.createGroupOrder(order);
                this.router.navigate(['GroupOrder', { id }]);
            })
            .catch(() => {
                alert('You are not authenticated');
            });
    }
}
