import {Component, Input} from '@angular/core';
import {MyChar} from '../../shared/interfaces';

@Component({
  selector: 'app-bar-year',
  templateUrl: './bar-year.component.html',
  styleUrls: ['./bar-year.component.scss']
})
export class BarYearComponent {

  @Input() barYears: MyChar

  constructor() { }

}
