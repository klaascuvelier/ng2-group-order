export interface VisitInterface
{
    id: string;
    name: string;
}

export class Visit implements VisitInterface
{
    id: string = '';
    name: string = '';

    static build (data)
    {
        const visit = new Visit();

        visit.id = data.id;
        visit.name = data.name;

        return visit;
    }
}
