import { Component } from '@angular/core';

import { NetworkService } from '../services';

// var helpers = require('../../../config/helpers');
// console.log('helpers', helpers.root('src'));

// var path = require('path');
// console.log(path);
// console.log(__dirname);
// var ROOT_FOLDER = path.resolve(__dirname, '..');
// console.log(ROOT_FOLDER);

@Component({
  selector: 'landing',
  providers: [ NetworkService ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent { 

	network = {
		world: {}
	};
	editWorld = false;

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

	saveWorld() {
		this._networkService.sendWorld(this.network.world).then((result) => {
			this.editWorld = false;
		})
	}

	deleteWorld() {
		this.network = {
			world: {}
		}
	}
}
