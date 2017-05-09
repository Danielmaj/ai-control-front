import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Square } from '../../../models';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
  // encapsulation: ViewEncapsulation.None
})
export class SquareComponent { 

	@Input() row: number = 0;
	@Input() column: number = 0;
	@Input() value: Square[] = [];
	@Input() paused: boolean = true;
	@Input() size: string = 'regular';
	@Input() editable: boolean = false;

	@Output() valueChange = new EventEmitter<Square[]>();
}
