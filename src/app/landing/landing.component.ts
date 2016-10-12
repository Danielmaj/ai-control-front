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

	getWorld() {
		this._networkService.getNetwork().then((network) => {
			this.network = network;
		});
	}

	deleteWorld() {
		this.network = {}
	}
}
