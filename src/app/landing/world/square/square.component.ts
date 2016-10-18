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

	@Output() valueChange = new EventEmitter();

	constructor(

	) {}

	ngOnInit() {

	}

	onClick(row: number, column: number) {
		this.value++;
		this.valueChange.emit({
			value: this.value,
		})
	}
}
