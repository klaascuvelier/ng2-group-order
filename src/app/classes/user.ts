export interface UserInterface
{
    id: string;
    name: string;
    avatar: string;
}

export class User implements UserInterface
{
    id: string = '';
    name: string = '';
    avatar: string = '';
    email: string = '';

    static build (data) : User
    {
        const user = new User();

        user.id = data.id;
        user.name = data.name;
        user.avatar = data.avatar;

        return user;
    }
}
