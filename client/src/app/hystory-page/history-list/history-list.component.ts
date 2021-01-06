import {Component, Input, OnInit} from '@angular/core';
import {Income} from '../../shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements OnInit {

  @Input() incomes: Income[]

  constructor() { }

  ngOnInit() {
  }

}
