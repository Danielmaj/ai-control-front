import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Square } from '../../../models';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
})
export class SquareComponent { 

	@Input() row: number;
	@Input() column: number;
	@Input() value: Square[];

	@Output() valueChange = new EventEmitter<Square[]>();

	constructor(

	) {}

	ngOnInit() {

	}

	logValue() {
		console.log(this.value);
	}
}
