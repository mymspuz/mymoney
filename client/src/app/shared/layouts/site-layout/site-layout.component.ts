import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-site-layout',
    templateUrl: './site-layout.component.html',
    styleUrls: ['./site-layout.component.css']
})
export class SiteLayoutComponent implements OnInit {

    links = [
        {url: '/overview', name: 'MyMoney', icons: 'fa-th-large', level: 1},
        {url: '/organizations', name: 'Organizations', icons: 'fa-users', level: 2},
        {url: '/hystory', name: 'Hystory', icons: 'fa-table', level: 2},
        {url: '/analytics', name: 'Analitycs', icons: 'fa-chart-pie', level: 2},
    ]

    sActive: boolean

    constructor(private auth: AuthService, private router: Router) {
    }

    ngOnInit() {
        this.sActive = false
    }

    logout(event: Event) {
        event.preventDefault()
        this.auth.logout()
        this.router.navigate(['/login'])
    }

    sidebarActive() {
        this.sActive = !this.sActive;
    }
}
