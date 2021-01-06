import {Component, Input, OnInit} from '@angular/core';
import {MyChar} from '../../shared/interfaces';

@Component({
  selector: 'app-stack-typecash',
  templateUrl: './stack-typecash.component.html',
  styleUrls: ['./stack-typecash.component.css']
})
export class StackTypecashComponent {

  @Input() stackTypeCash: MyChar

  constructor() { }

}
