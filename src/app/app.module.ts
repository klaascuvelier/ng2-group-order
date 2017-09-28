import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { RouterModule } from '@angular/router';

import { appRoutes } from './app-routes';
import { AboutComponent } from './components/about/about';
import { CreateGroupComponent } from './components/create-group/create-group';
import { GroupOrderComponent } from './components/group-order/group-order';
import { LoginComponent } from './components/login/login';
import { Oauth2RedirectComponent } from './components/oauth2-redirect/oauth2-redirect';
import { Authentication } from './services/authentication/authentication';
import { DataStore } from './services/datastore/datastore';
import { LocationHelper } from './services/location/location';
import { StorageHelper } from './services/storage/storage';
import { UuidGenerator } from './services/uuid/uuid-generator';
import { App } from './app';
import { HttpModule } from '@angular/http';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyAnnXlZKHvj2cI31Y16fbw8nOcyEWDippQ',
    authDomain: 'crackling-heat-7982.firebaseapp.com',
    databaseURL: 'https://crackling-heat-7982.firebaseio.com',
    projectId: 'crackling-heat-7982',
    storageBucket: 'crackling-heat-7982.appspot.com',
    messagingSenderId: '750521535943'
};

@NgModule({
    imports: [
        BrowserModule, ReactiveFormsModule, FormsModule, HttpModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireDatabaseModule, AngularFireAuthModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        App,
        AboutComponent, CreateGroupComponent, GroupOrderComponent, LoginComponent, Oauth2RedirectComponent
    ],
    providers: [
        Authentication, DataStore, LocationHelper, StorageHelper, UuidGenerator
    ],
    exports: [App]
})
export class AppModule {
}
