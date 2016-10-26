import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css'],
})
export class SquareComponent { 

	@Input() row: number;
	@Input() column: number;
	@Input() value: number;

	constructor(

	) {}

	ngOnInit() {

	}
}
