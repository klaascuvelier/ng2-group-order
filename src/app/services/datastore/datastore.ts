import { observableFirebaseObject, observableFirebaseArray } from 'angular2-firebase';
import * as Firebase from 'firebase';

import { GroupOrder } from '../../classes/group-order';
import { Order } from '../../classes/order';
import { FIREBASE_ROOT } from '../../../config';

const FIREBASE_ORDER_GROUPS = `${FIREBASE_ROOT}/order-groups`;
const FIREBASE_ORDERS = `${FIREBASE_ROOT}/orders`;

export class DataStore
{
    rootRef: Firebase;
    orderGroupsRef: Firebase;
    ordersRef: Firebase;

    constructor ()
    {
        this.rootRef = new Firebase(FIREBASE_ROOT);
        this.orderGroupsRef = new Firebase(FIREBASE_ORDER_GROUPS);
        this.ordersRef = new Firebase(FIREBASE_ORDERS);
    }

    createGroupOrder (groupOrder: GroupOrder)
    {
        this.orderGroupsRef.child(groupOrder.id).set(groupOrder);
    }

    getGroupOrderById (orderGroupId)
    {
        return observableFirebaseObject(this.orderGroupsRef.child(orderGroupId));
    }

    addOrderForGroup (orderGroupId: string, order: Order)
    {
        this.ordersRef.child(orderGroupId).push(order);
    }

    getOrdersForGroup (orderGroupId: string)
    {
        return observableFirebaseArray(this.ordersRef.child(orderGroupId));
    }

    updateGroupOrders (orderGroupId: string, orders: Array<Order>)
    {
        this.ordersRef.child(orderGroupId).set(orders);
    }

    updateGroupOrder (groupOrder: GroupOrder)
    {
        this.orderGroupsRef.child(groupOrder.id).set(groupOrder);
    }
}
