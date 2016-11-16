import { Component } from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent { 

	constructor(
	) {}

	ngOnInit() {
		console.log('init');
	}

	log(data: any) {
		console.log(data);
	}

}
