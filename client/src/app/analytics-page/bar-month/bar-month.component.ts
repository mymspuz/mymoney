import {Component, Input} from '@angular/core';
import {MyChar} from '../../shared/interfaces';

@Component({
  selector: 'app-bar-month',
  templateUrl: './bar-month.component.html',
  styleUrls: ['./bar-month.component.scss']
})
export class BarMonthComponent {

  @Input() barMonths: MyChar

  constructor() { }

}
