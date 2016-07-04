export interface GroupOrderInterface
{
    id: string;
    name: string;
    orderUrl: string;
    description: string;
    creatorName: string;
    creatorId: string;
    status: GroupOrderStatus;
    admins: number[];
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
    admins: number[] = [];

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
        groupOrder.admins = data.admins;

        return groupOrder;
    }
}
