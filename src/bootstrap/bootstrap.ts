import { CUSTOM_ELEMENTS_SCHEMA, enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NgModule, Component, ViewContainerRef } from '@angular/core';
import { AppModule } from '../app/app.module';

@Component({
    selector: 'application-wrapper',
    template: `
        <app></app>
    `
})
export class ApplicationWrapperContainer {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}

@NgModule({
    imports: [AppModule],
    declarations: [ApplicationWrapperContainer],
    bootstrap: [ApplicationWrapperContainer],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProdModule {
}

enableProdMode();
platformBrowserDynamic()
    .bootstrapModule(ProdModule)
    .then(() => console.info('bootstrapped the app'))
    .catch(error => console.error('could not bootstrap', error));
