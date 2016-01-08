export interface OrderInterface
{
    id: string;
    creatorName: string;
    creatorId: string;
    description: string;
    price: number;
    status: OrderStatus;
    payed: boolean;
}

export enum OrderStatus
{
    CREATED,
    ORDERED,
    FINISHED
}

export class Order implements OrderInterface
{

    id: string = '';
    creatorName: string = '';
    creatorId: string = '';
    description: string = '';
    price: number = 0;
    status: OrderStatus = OrderStatus.CREATED;
    payed: boolean = false;

    static build (data) : Order
    {
        const order = new Order();

        order.id = data.id;
        order.creatorName = data.creatorName;
        order.creatorId = data.creatorId;
        order.description = data.description;
        order.price = data.price;
        order.status = data.status;
        order.payed = data.payed;

        return order;
    }
}
