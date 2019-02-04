import {Component, Input} from '@angular/core';
import {MyChar} from '../../shared/interfaces';

@Component({
  selector: 'app-line-curr',
  templateUrl: './line-curr.component.html',
  styleUrls: ['./line-curr.component.scss']
})
export class LineCurrComponent {

  @Input() lineCurrs: MyChar

  constructor() { }

}
