import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { GroupOrder } from '../../classes/group-order';
import { Order } from '../../classes/order';

const FIREBASE_ORDER_GROUPS = `/order-groups`;
const FIREBASE_ORDERS = `/orders`;

@Injectable()
export class DataStore {

    constructor(private db: AngularFireDatabase) {
    }

    createGroupOrder(groupOrder: GroupOrder): void {
        this.getGroupOrderById(groupOrder.id).set(groupOrder);
    }


    updateGroupOrder(groupOrder: GroupOrder): void {
        this.getGroupOrderById(groupOrder.id).set(groupOrder);
    }

    addOrderForGroup(orderGroupId: string, order: Order): void {
        this.getOrdersForGroup(orderGroupId).push(order);
    }

    updateGroupOrders(orderGroupId: string, orders: Array<Order>) {
        this.db.object(`${FIREBASE_ORDERS}/${orderGroupId}`).set(orders);
    }

    getGroupOrderById(orderGroupId): FirebaseObjectObservable<GroupOrder> {
        return this.db.object(`${FIREBASE_ORDER_GROUPS}/${orderGroupId}`);
    }


    getOrdersForGroup(orderGroupId: string): FirebaseListObservable<Array<Order>> {
        return this.db.list(`${FIREBASE_ORDERS}/${orderGroupId}`);
    }
}
