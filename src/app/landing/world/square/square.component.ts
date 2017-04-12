import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Square } from '../../../models';
import {ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SquareComponent { 

	@Input() row: number = 0;
	@Input() column: number = 0;
	@Input() value: Square[] = [];

	@Output() valueChange = new EventEmitter<Square[]>();

	constructor(

	) {}

	ngOnInit() {

	}

	ngOnChanges() {
		// console.log('changes', this.row, this.column, this.value);
	}

	logValue() {
		// console.log(this.value[0].getContent());
	}
}
