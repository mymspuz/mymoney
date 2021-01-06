import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {LoginPageComponent} from './login-page/login-page.component';
import {AuthLayoutComponent} from './shared/layouts/auth-layout/auth-layout.component';
import {SiteLayoutComponent} from './shared/layouts/site-layout/site-layout.component';
import {SignupPageComponent} from './signup-page/signup-page.component';
import {AuthGuard} from './shared/classes/auth.guard';
import {OverviewPageComponent} from './overview-page/overview-page.component';
import {AnalyticsPageComponent} from './analytics-page/analytics-page.component';
import {OrganizationsPageComponent} from './organizations-page/organizations-page.component';
import {HystoryPageComponent} from './hystory-page/hystory-page.component';
import {OrganizationFormComponent} from './organizations-page/organization-form/organization-form.component';

const routes: Routes = [
    {
        path: '', component: AuthLayoutComponent, children: [
            {path: '', redirectTo: '/login', pathMatch: 'full'},
            {path: 'login', component: LoginPageComponent},
            {path: 'signup', component: SignupPageComponent}
        ]
    },
    {
        path: '', component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
            {path: 'overview', component: OverviewPageComponent},
            {path: 'analytics', component: AnalyticsPageComponent},
            {path: 'organizations', component: OrganizationsPageComponent},
            {path: 'hystory', component: HystoryPageComponent},
            {path: 'organization/new', component: OrganizationFormComponent},
            {path: 'organization/:id', component: OrganizationFormComponent}
        ]
    }
]

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
