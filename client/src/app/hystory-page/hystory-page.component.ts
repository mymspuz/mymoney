import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Filter, Income} from '../shared/interfaces';
import {HystoryService} from '../shared/services/hystory.service';

@Component({
  selector: 'app-hystory-page',
  templateUrl: './hystory-page.component.html',
  styleUrls: ['./hystory-page.component.css']
})

export class HystoryPageComponent implements OnInit, OnDestroy {

  oSub: Subscription
  incomes: Income[] = []
  isLoading = false
  filter: Filter = {}

  offset = 0
  limit = 50


  constructor(private hystoryService: HystoryService) { }

  ngOnInit() {
    this.fetch()
    this.isLoading = true
  }

  ngOnDestroy(): void {
    this.oSub.unsubscribe()
  }

  private fetch() {

    const params = Object.assign({}, this.filter, {
        offset: this.offset,
        limit: this.limit
    })
    this.oSub = this.hystoryService.fetch(params).subscribe( incomes => {
      this.incomes = incomes
      this.isLoading = true
    })
  }

  applyFilter(filter: Filter) {
    this.incomes = []
    this.offset = 0
    this.filter = filter
    //this.isLoading = false
    this.fetch()
  }
}
