import {Component, OnInit} from '@angular/core';
import {OrganizationsService} from '../shared/services/organizations.service';
import {Organization} from '../shared/interfaces';
import {Observable} from 'rxjs';

@Component({
    selector: 'app-organizations-page',
    templateUrl: './organizations-page.component.html',
    styleUrls: ['./organizations-page.component.css']
})
export class OrganizationsPageComponent implements OnInit {

    organizations$: Observable<Organization[]>;

    constructor(private organizationService: OrganizationsService) {
    }

    ngOnInit() {
        this.organizations$ = this.organizationService.fetch()
    }

}
