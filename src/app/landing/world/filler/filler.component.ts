import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Square } from '../../../models';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'filler',
  templateUrl: './filler.component.html',
  styleUrls: ['./filler.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FillerComponent { 

	@Input() row: number = 0;
	@Input() column: number = 0;
	@Input() value: Square[] = [];

	@Output() valueChange = new EventEmitter<Square[]>();
}
