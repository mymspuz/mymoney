import {Component, Input} from '@angular/core';
import {MyChar} from '../../shared/interfaces';

@Component({
  selector: 'app-pie-all',
  templateUrl: './pie-all.component.html',
  styleUrls: ['./pie-all.component.scss']
})
export class PieAllComponent {

  @Input() pieAlls: MyChar

  constructor() { }
}
