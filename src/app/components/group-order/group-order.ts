import { Authentication } from '../../services/authentication/authentication';
import { DataStore } from '../../services/datastore/datastore';
import { GroupOrder, GroupOrderInterface } from '../../classes/group-order';
import { User, UserInterface } from '../../classes/user';
import { Order, OrderStatus } from '../../classes/order';
import { UuidGenerator } from '../../services/uuid/uuid-generator';
import { GroupOrderStatus } from '../../classes/group-order';
import { STORAGE_KEY_VISITED, StorageHelper } from '../../services/storage/storage';
import { Visit } from '../../classes/visit';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

const VALUE_NOT_FOUND = -1;

@Component({
    selector: 'group-order',
    template: `
        <div class="content">
            <p *ngIf="(isLoading$|async)">
                Loading the order group &hellip;
            </p>

            <div *ngIf="!(isLoading$|async)">
                <div *ngIf="(groupOrder$|async) === null">
                    <p>Could not find the specified group order.<br/>It might have been removed, it might have never existed&hellip;</p>
                </div>

                <div *ngIf="(groupOrder$|async) !== null; let groupOrder">
                    <h2>{{ groupOrder.name }}</h2>
                    <p>{{ groupOrder.description }}</p>

                    <p>Choose your food from <a [href]="(groupOrder$|async)?.orderUrl" target="_blank">{{ (groupOrder$|async)?.orderUrl }} </a>
                        and add it to the list below.</p>

                    <h3>Orders</h3>

                    <p *ngIf="!(isLoggedIn$|async)">You need to <a [routerLink]="['/login']">log in</a> to place an order</p>

                    <table width="100%" class="order-list" *ngIf="(isLoggedIn$|async)">
                        <thead>
                        <tr>
                            <th>Person</th>
                            <th>Order</th>
                            <th>Cost</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>

                        <tbody>
                        <tr *ngFor="let order of (orders$|async)">
                            <td>{{ order.creatorName }}</td>
                            <td>{{ order.description }}</td>
                            <td class="cost">{{ order.price }}</td>
                            <td class="center payment {{ order.payed ? 'paid' : 'unpaid' }}">
                                <div *ngIf="!(isAdmin$|async)">
                                    <span [hidden]="!order.payed">paid</span>
                                    <span [hidden]="order.payed">unpaid</span>
                                </div>

                                <div *ngIf="(isAdmin$|async)">
                                    <label>
                                        <input type="checkbox" name="order{{ order.id }}paymentstatus"
                                               [checked]="order.payed"
                                               (change)="togglePayment(order.id)"
                                        />
                                        paid
                                    </label>
                                </div>
                            </td>
                            <td class="center">
                                <span [hidden]="order.status !== 0">created</span>
                                <span [hidden]="order.status !== 1">ordered</span>
                                <span [hidden]="order.status !== 2">finished</span>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    *ngIf="(isAdmin$|async) || (userId$|async) === order.creatorId"
                                    (click)="removeOrder(order.id)"
                                >Remove
                                </button>

                                <button
                                    type="button"
                                    *ngIf="!(hasAlreadyOrdered$)"
                                    (click)="orderDescription.value = order.description; orderPrice.value = order.price;"
                                >Copy this order
                                </button>


                                <div *ngIf="(isAdmin$|async)">
                                    <button type="button" [hidden]="order.status === 1" (click)="setOrderStatus(order.id, 1)">Set Ordered
                                    </button>
                                    <button type="button" [hidden]="order.status !== 1" (click)="setOrderStatus(order.id, 0)">Set Created
                                    </button>
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>


                    <div *ngIf="(isLoggedIn$|async)">
                        <h4>Add your order</h4>
                        <p *ngIf="(hasAlreadyOrdered$|async)">You already placed an order</p>
                        <p [hidden]="groupOrder.status !== 1">Orders are closed</p>
    
                        <form class="orders"
                              *ngIf="(isLoggedIn$|async) && (groupOrder.status !== 0)"
                              (submit)="addOrder(orderDescription.value, orderPrice.value)"
                        >
                            <fieldset>
                                <label>Name</label>
                                <input type="text" value="{{ (user$|async)?.name }}" disabled>
                            </fieldset>
    
                            <fieldset>
                                <label>Description</label>
                                <input type="text" placeholder="some pizza" #orderDescription>
                            </fieldset>
    
                            <fieldset>
                                <label>Price in euro</label>
                                <input type="text" placeholder="15" #orderPrice>
                            </fieldset>
    
                            <fieldset class="submit">
                                <button type="submit">Add Order</button>
                            </fieldset>
                        </form>

                        <div *ngIf="!(isAdmin$|async)" class="admin-box">
                            <h4>Your order summary</h4>
                            <ul class="summary">
                                <li *ngFor="let order of usersOrdersSummary$|async">
                                    {{ order.count }} times {{ order.hash }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div *ngIf="(isAdmin$|async)">
                        <h3>Admin Option</h3>

                        <div class="wrap">
                            <div class="admin-box half">
                                <h4>Groups status</h4>
                                <label>
                                    <input type="radio" name="groupStatus" (click)="openOrders()" [checked]="groupOrder.status === 0">
                                    Orders are open
                                </label><br/>

                                <label>
                                    <input type="radio" name="groupStatus" (click)="closeOrders()" [checked]="groupOrder.status === 1">
                                    Orders are closed
                                </label><br/>
                            </div>

                            <div class="admin-box half">
                                <h4>All orders status</h4>
                                <label>
                                    <input type="radio" name="orderStatus" (click)="setOrdersStatus(0)" [checked]="allOrdersStatus === 0">
                                    Created
                                </label><br/>
                                <label>
                                    <input type="radio" name="orderStatus" (click)="setOrdersStatus(1)" [checked]="allOrdersStatus === 1">
                                    Ordered
                                </label><br/>
                                <label>
                                    <input type="radio" name="orderStatus" (click)="setOrdersStatus(2)" [checked]="allOrdersStatus === 2">
                                    Finished
                                </label><br/>
                            </div>
                        </div>

                        <div class="admin-box">
                            <h4>Order Summary</h4>
                            <ul class="summary">
                                <li *ngFor="let order of ordersSummary$|async">
                                    {{ order.count }} times {{ order.hash }}
                                </li>
                            </ul>
                        </div>

                        <div class="admin-box">
                            <h4>Payment Summary</h4>
                            <ul class="summary">
                                <li>
                                    <label>Orders</label> {{ ordersCount$|async }}
                                </li>

                                <li>
                                    <label>Paid</label> {{ paidOrdersCount$|async }}
                                </li>

                                <li>
                                    <label>Unpaid</label> {{ unpaidOrdersCount$|async }}
                                </li>

                                <li>
                                    <label>Ordered</label> {{ orderedCount$|async }}
                                </li>

                                <li>
                                    <label>Not yet ordered</label> {{ notOrderedCount$|async }}
                                </li>

                                <li>
                                    <label>Total cost</label> {{ totalCost$|async }}
                                </li>
                            </ul>
                        </div>


                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .summary label {
            display: inline-block;
        }
    `],
})
export class GroupOrderComponent implements OnInit, OnDestroy {
    routeParams$ = this.route.params;
    groupOrderId$ = this.routeParams$.map(params => params['id']);

    user$ = this.authentication.getUser();
    isLoggedIn$ = this.user$.map(user => user !== null);
    userId$ = this.user$.filter(user => user !== null).map(user => user.id);
    groupOrder$: Observable<GroupOrder> = this.groupOrderId$.mergeMap(groupOrderId => this.dataStore.getGroupOrderById(groupOrderId));
    orders$: Observable<Array<Order>> = this.groupOrderId$.mergeMap(groupOrderId => this.dataStore.getOrdersForGroup(groupOrderId));

    ordersCount$ = this.orders$.map(orders => orders ? orders.length : 0);
    paidOrdersCount$ = this.orders$.map(orders => orders ? orders.filter(order => order.payed === true).length : 0);
    unpaidOrdersCount$ = this.orders$.map(orders => orders ? orders.filter(order => order.payed === false).length : 0);
    orderedCount$ = this.orders$.map(orders => orders ? orders.filter(order => order.status === OrderStatus.ORDERED).length : 0);
    notOrderedCount$ = this.orders$.map(orders => orders ? orders.filter(order => order.status !== OrderStatus.ORDERED).length : 0);
    totalCost$ = this.orders$.map(orders => orders.reduce((total, order) => total + order.price, 0));

    isAdmin$ = Observable
        .combineLatest(this.groupOrder$, this.userId$)
        .map(([groupOrder, userId]) => userId === groupOrder.creatorId)
        .startWith(false);

    hasAlreadyOrdered$ = Observable
        .combineLatest(this.orders$, this.userId$)
        .map(([orders, userId]) => orders.filter(order => order.creatorId === userId).length > 0)
        .startWith(false);

    isLoading$ = Observable
        .combineLatest(this.user$, this.groupOrder$, this.orders$)
        .map(() => false)
        .startWith(true);

    usersOrder$: Observable<Array<Order>> = Observable
        .combineLatest(this.orders$, this.userId$)
        .take(1)
        .map(([orders, userId]) => orders.filter(order => order.creatorId = userId));

    usersOrdersSummary$ = this.usersOrder$.map(usersOrders => this.generateSummary(usersOrders));
    ordersSummary$ = this.orders$.map(orders => this.generateSummary(orders));

    private subscriptions: Array<Subscription> = [];

    allOrdersStatus: OrderStatus = OrderStatus.CREATED;

    constructor(
        private route: ActivatedRoute,
        private dataStore: DataStore,
        private authentication: Authentication,
        private storage: StorageHelper,
        private uuidGenerator: UuidGenerator
    ) {}

    ngOnInit() {
        // Navigate away if
        this.subscriptions.push(
            this.groupOrder$.subscribe(order => {
                if (order !== null) {
                    this.storeVisit(order);
                }
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    addOrder(description, price): void {
        Observable
            .combineLatest([this.user$, this.groupOrderId$])
            .take(1)
            .subscribe(([user, groupOrderId]) => {
                const order = Order.build({
                    id: this.uuidGenerator.generate(),
                    creatorName: user.name,
                    creatorId: user.id,
                    description,
                    price: parseFloat(price.replace(',', '.')),
                    status: OrderStatus.CREATED,
                    payed: false
                });

                this.dataStore.addOrderForGroup(groupOrderId, order);
            });
    }

    togglePayment(orderId): void {
        Observable
            .combineLatest([this.isAdmin$, this.orders$, this.groupOrderId$])
            .take(1)
            .subscribe(([isAdmin, orders, groupOrderId]) => {
                if (isAdmin) {
                    const updatedOrders = orders.map(order => {
                        if (order.id === orderId) {
                            order.payed = !order.payed;
                        }

                        return order;
                    });

                    this.dataStore.updateGroupOrders(groupOrderId, updatedOrders);
                }
            });
    }

    closeOrders(): void {
        Observable
            .combineLatest(this.isAdmin$, this.groupOrder$)
            .take(1)
            .subscribe(([isAdmin, groupOrder]) => {
                if (isAdmin) {
                    groupOrder.status = GroupOrderStatus.CLOSED;
                    return this.dataStore.updateGroupOrder(groupOrder);
                }
                return Observable.empty();
            });
    }

    openOrders(): void {
        Observable
            .combineLatest(this.isAdmin$, this.groupOrder$)
            .take(1)
            .subscribe(([isAdmin, groupOrder]) => {
                if (isAdmin) {
                    groupOrder.status = GroupOrderStatus.OPEN;
                    return this.dataStore.updateGroupOrder(groupOrder);
                }
                return Observable.empty();
            });
    }

    setOrdersStatus(status): void {
        Observable
            .combineLatest(this.isAdmin$, this.orders$, this.groupOrderId$)
            .take(1)
            .subscribe(([isAdmin, orders, groupOrderId]) => {
                if (isAdmin) {
                    const updatedOrders = orders.map(order => {
                        order.status = status;
                        return order;
                    });

                    this.allOrdersStatus = status;
                    this.dataStore.updateGroupOrders(groupOrderId, updatedOrders);
                }
            })
    }

    setOrderStatus(orderId, status): void {
        Observable
            .combineLatest(this.isAdmin$, this.orders$, this.groupOrderId$)
            .take(1)
            .subscribe(([isAdmin, orders, groupOrderId]) => {
                if (isAdmin) {
                    const updatedOrders = orders.map(order => {
                        if (order.id === orderId) {
                            order.status = status;
                        }
                        return order;
                    });

                    this.dataStore.updateGroupOrders(groupOrderId, updatedOrders);
                }
            });
    }

    removeOrder(orderId): void {
        Observable
            .combineLatest([this.isAdmin$, this.orders$, this.groupOrderId$, this.userId$])
            .take(1)
            .subscribe(([isAdmin, orders, groupOrderId, userId]) => {
                const order = orders.filter(order => order.id === orderId)[0] || null;
                const ownerId = order ? order.creatorId : null;

                if (isAdmin || ownerId === userId) {
                    const ordersLeft = orders.filter(order => order.id !== orderId);
                    return this.dataStore.updateGroupOrders(groupOrderId, ordersLeft);
                }
                return Observable.empty();
            });
    }

    storeVisit(groupOrder: GroupOrder) {
        const self = this;

        this.storage
            .getItem(STORAGE_KEY_VISITED)
            .subscribe(alreadyVisited => {
                const newVisit = {id: groupOrder.id, name: groupOrder.name};
                const visits = [newVisit]
                    .concat(alreadyVisited ? alreadyVisited.filter(visit => visit.id !== groupOrder.id) : [])
                    .slice(0, 5);

                self.storage.setItem(STORAGE_KEY_VISITED, visits);
            });
    }

    generateSummary(orders) {
        const array = [];

        orders
            .map(order => {
                order.hash = `${order.description} - ${order.price} euro`;
                return order;
            })
            .forEach(order => incrementOrder(order.hash));

        return array;

        function incrementOrder(hash) {
            const item = array.filter(item => item.hash === hash)[0] || null;

            if (item !== null) {
                item.count++;
            }
            else {
                array.push({
                    hash, count: 1
                });
            }
        }
    }
}
