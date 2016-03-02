export interface GroupOrderInterface
{
    id: string;
    name: string;
    orderUrl: string;
    description: string;
    creatorName: string;
    creatorId: string;
    status: GroupOrderStatus;
}

export enum GroupOrderStatus {
    OPEN,
    CLOSED
}

export class GroupOrder implements GroupOrderInterface
{
    id: string = '';
    name: string = '';
    orderUrl: string = '';
    description: string = '';
    creatorName: string = '';
    creatorId: string = '';
    status: GroupOrderStatus = GroupOrderStatus.OPEN;

    static build (data) : GroupOrder
    {
        const groupOrder = new GroupOrder();

        groupOrder.id = data.id;
        groupOrder.name = data.name;
        groupOrder.orderUrl = data.orderUrl;
        groupOrder.description = data.description;
        groupOrder.creatorName = data.creatorName;
        groupOrder.creatorId = data.creatorId;
        groupOrder.status = data.status;

        return groupOrder;
    }
}
