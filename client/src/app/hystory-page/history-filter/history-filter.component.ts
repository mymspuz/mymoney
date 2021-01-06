import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {OrganizationsService} from '../../shared/services/organizations.service';
import {Filter, Organization} from '../../shared/interfaces';
import {Observable} from 'rxjs';
import {validate} from 'codelyzer/walkerFactory/walkerFn';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements OnInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('sdate') sdate: ElementRef
  @ViewChild('edate') edate: ElementRef

  organizationId: number
  organizations$: Observable<Organization[]>
  isValid = true
  isFiltered = false

  constructor(private organizationService: OrganizationsService) { }

  ngOnInit() {
    this.organizations$ = this.organizationService.fetch()
  }

  validate(dates, datef) {
    if (dates === '' || datef === '') {
      this.isValid = true
      return
    }

    this.isValid = datef > dates
  }

  applyFilter() {
    const filter: Filter = {}

    if (this.organizationId && this.organizationId > -1) {
      filter.organization_id = this.organizationId
    }

    if (this.sdate.nativeElement.value !== '') {
      filter.sdate = this.sdate.nativeElement.value
    }

    if (this.edate.nativeElement.value !== '') {
      filter.edate = this.edate.nativeElement.value
    }

    if (filter.sdate && filter.edate) {
      this.validate(filter.sdate, filter.edate)
    }

    if (!this.isValid) {
      console.log('false date')
      return
    }

    this.isFiltered = Object.keys(filter).length !== 0

    this.onFilter.emit(filter)
  }

}
