import { Component } from '@angular/core';

import { NetworkService } from '../services';


@Component({
  selector: 'landing',
  providers: [ NetworkService ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent { 

	network = {};

	constructor(
		private _networkService: NetworkService
	) {}

	ngOnInit() {
		this.getWorld();
	}

	log(data: any) {
		console.log(data);
	}

	getWorld() {
		this._networkService.getNetwork().then((network) => {
			console.log(network);
			this.network = network;
		});
	}

	deleteWorld() {
		this.network = {}
	}
}
