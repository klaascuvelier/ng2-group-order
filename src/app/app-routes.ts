import { AboutComponent } from './components/about/about';
import { LoginComponent } from './components/login/login';
import { CreateGroupComponent } from './components/create-group/create-group';
import { Oauth2RedirectComponent } from './components/oauth2-redirect/oauth2-redirect';
import { GroupOrderComponent } from './components/group-order/group-order';

export const appRoutes = [
    {path: '', redirectTo: '/about', pathMatch: 'full'},
    {path: 'about', component: AboutComponent},
    {path: 'login', component: LoginComponent},
    {path: 'create', component: CreateGroupComponent},
    {path: 'oauth2-redirect', component: Oauth2RedirectComponent},
    {path: 'group-order/:id', component: GroupOrderComponent}
];
