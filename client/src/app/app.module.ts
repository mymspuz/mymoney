import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {SignupPageComponent} from './signup-page/signup-page.component';
import {AuthService} from './shared/services/auth.service';
import {TokenInterceptor} from './shared/classes/token.interceptor';
import {OverviewPageComponent} from './overview-page/overview-page.component';
import {AnalyticsPageComponent} from './analytics-page/analytics-page.component';
import {HystoryPageComponent} from './hystory-page/hystory-page.component';
import {OrganizationsPageComponent} from './organizations-page/organizations-page.component';
import {OrganizationsService} from './shared/services/organizations.service';
import { OrganizationFormComponent } from './organizations-page/organization-form/organization-form.component';
import { IncomeFormComponent } from './organizations-page/organization-form/income-form/income-form.component';
import { HistoryListComponent } from './hystory-page/history-list/history-list.component';
import { HistoryFilterComponent } from './hystory-page/history-filter/history-filter.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
    declarations: [
        AppComponent,
        LoginPageComponent,
        AuthLayoutComponent,
        SiteLayoutComponent,
        SignupPageComponent,
        OverviewPageComponent,
        AnalyticsPageComponent,
        HystoryPageComponent,
        OrganizationsPageComponent,
        OrganizationFormComponent,
        IncomeFormComponent,
        HistoryListComponent,
        HistoryFilterComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientJsonpModule,
        MDBBootstrapModule.forRoot()
    ],
    providers: [AuthService, OrganizationsService, {provide: HTTP_INTERCEPTORS, multi: true, useClass: TokenInterceptor}],
    bootstrap: [AppComponent]
})
export class AppModule {
}
