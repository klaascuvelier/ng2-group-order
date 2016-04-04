import { Component, OnInit } from 'angular2/core';
import { RouteParams, Router, ROUTER_DIRECTIVES } from 'angular2/router';
import { Authentication } from "../../services/authentication/authentication";
import { DataStore } from "../../services/datastore/datastore";
import { GroupOrder, GroupOrderInterface } from "../../classes/group-order";
import { User, UserInterface } from "../../classes/user";
import { Order, OrderStatus } from "../../classes/order";
import { UuidGenerator } from "../../services/uuid/uuid-generator";
import { GroupOrderStatus } from "../../classes/group-order";
import { Storage, STORAGE_KEY_VISITED} from '../../services/storage/storage';
import { Visit } from '../../classes/visit';
import { ArraySortPipe } from '../../pipes/array-sort';

const VALUE_NOT_FOUND = -1;

@Component({
    selector: 'group-order',
    template: require('./group-order.html'),
    styles: [require('./group-order.scss')],
    providers: [],
    directives: [...ROUTER_DIRECTIVES],
    pipes: [ArraySortPipe]
})
export class GroupOrderComponent implements OnInit
{
    router: Router = null;
    dataStore: DataStore = null;
    authentication: Authentication = null;
    storage: Storage = null;

    groupOrderId: string = null;
    groupOrder: GroupOrderInterface = new GroupOrder();
    user: UserInterface = new User();
    orders: Array<Order> = [];
    orderSummary: Array<{}> = null;
    userOrderSummary: Array<{}> = null;

    loading: boolean = true;
    loggedIn: boolean = true;
    alreadyOrdered: boolean = false;
    isAdmin: boolean = false;

    totalCost: number = 0;
    paidOrdersCount: number = 0;
    orderedCount: number = 0;
    allOrdersStatus: OrderStatus = OrderStatus.CREATED;

    constructor (routeParams: RouteParams, dataStore: DataStore, authentication: Authentication, router: Router, storage: Storage)
    {
        this.router = router;
        this.dataStore = dataStore;
        this.storage = storage;
        this.authentication = authentication;
        this.groupOrderId = routeParams.params['id'];
        this.loading = true;
        this.loggedIn = false;
        this.alreadyOrdered = false;
        this.isAdmin = false;
        this.totalCost = 0;
        this.paidOrdersCount = 0;
        this.orderedCount = 0;
    }

    ngOnInit ()
    {
        this.authentication
            .getUser()
            .then(user => {
                this.user = user;
                this.loggedIn = true;

                this.isAdmin = this.groupOrder.creatorId === this.user.id;
                this.alreadyOrdered = this.orders.filter(order => order.creatorId === this.user.id).length > 0;
            })
            .catch(() => {
                this.user = new User();
                this.loggedIn = false;
            });

        this.dataStore
            .getGroupOrderById(this.groupOrderId)
            .subscribe(
                info => {
                    this.loading = false;
                    if (info === null) {
                        this.router.navigate(['About']);
                    }
                    else {
                        this.groupOrder = GroupOrder.build(info);
                        this.isAdmin = this.groupOrder.creatorId === this.user.id;

                        this.storeVisit();
                    }
                },
                error => {
                    console.warn('order group issue', error);
                    this.router.navigate(['About']);
                }
            );

        this.dataStore
            .getOrdersForGroup(this.groupOrderId)
            .subscribe(
                info => {
                    this.orders = info.map(data => Order.build(data));
                    this.alreadyOrdered = this.orders.filter(order => order.creatorId === this.user.id).length > 0;

                    this.totalCost = this.orders.map(order => order.price).reduce((total, cost) => total + cost, 0);
                    this.paidOrdersCount = this.orders.filter(order => order.payed).length;
                    this.orderedCount = this.orders.filter(order => order.status === OrderStatus.ORDERED).length;

                    this.orderSummary = this.generateSummary(this.orders);
                    this.userOrderSummary = this.generateSummary(this.orders.filter(order => order.creatorId === this.user.id));
                },
                error => {
                    alert('fout');
                    console.warn('orders issue', error);
                    this.router.navigate(['About']);
                }
            );
    }

    addOrder (description, price)
    {
        const order = Order.build({
            id: UuidGenerator.generate(),
            creatorName: this.user.name,
            creatorId: this.user.id,
            description,
            price: parseFloat(price.replace(',', '.')),
            status: OrderStatus.CREATED,
            payed: false
        });

        this.dataStore.addOrderForGroup(this.groupOrderId, order);
    }

    togglePayment (orderId)
    {
        if (this.isAdmin) {
            const orders = this.orders.map(order => {
                if (order.id === orderId) {
                    order.payed = !order.payed;
                }

                return order;
            });

            this.dataStore.updateGroupOrders(this.groupOrderId, orders);
        }
    }

    closeOrders ()
    {
        if (this.isAdmin) {
            this.groupOrder.status = GroupOrderStatus.CLOSED;
            this.dataStore.updateGroupOrder(this.groupOrder);
        }
    }

    openOrders ()
    {
        if (this.isAdmin) {
            this.groupOrder.status = GroupOrderStatus.OPEN;
            this.dataStore.updateGroupOrder(this.groupOrder);
        }
    }

    setOrdersStatus (status)
    {
        if (this.isAdmin) {
            const orders = this.orders.map(order => {
                order.status = status;
                return order;
            });
            this.dataStore.updateGroupOrders(this.groupOrderId, orders);

            this.allOrdersStatus = status;
        }
    }

    setOrderStatus (orderId, status)
    {
        if (this.isAdmin) {
            const orders = this.orders.map(order => {
                if (order.id === orderId) {
                    order.status = status;
                }
                return order;
            });
            this.dataStore.updateGroupOrders(this.groupOrderId, orders);
        }
    }

    removeOrder (orderId)
    {
        const order = this.orders.filter(order => order.id === orderId)[0];

        if (order && (order.creatorId === this.user.id || this.isAdmin))
        {
            const ordersLeft = this.orders.filter(order => order.id !== orderId);
            this.dataStore.updateGroupOrders(this.groupOrderId, ordersLeft);
        }
    }

    storeVisit ()
    {
        const self = this;

        if (this.groupOrder.id && this.groupOrder.name) {
            // Store visited group
            if (this.storage.hasKey(STORAGE_KEY_VISITED)) {
                this.storage
                    .getItem(STORAGE_KEY_VISITED)
                    .then(visited => {
                        if (visited
                                .map((visit: Visit) => visit.id)
                                .indexOf(this.groupOrderId) === VALUE_NOT_FOUND
                        ) {
                            addVisit(visited);
                        }
                    });
            }
            else {
                addVisit([]);
            }
        }

        function addVisit (visited: Array<Visit>)
        {
            visited.push(Visit.build({
                id: self.groupOrderId,
                name: self.groupOrder.name
            }));

            if (visited.length > 5) {
                visited = visited.slice(visited.length - 5);
            }

            self.storage.setItem(STORAGE_KEY_VISITED, visited);
        }
    }

    generateSummary (orders)
    {
        const array = [];

        orders
            .map(order => {
                order.hash = `${order.description} - ${order.price} euro`;
                return order;
            })
            .forEach(order => incrementOrder(order.hash));

        return array;

        function incrementOrder(hash)
        {
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
