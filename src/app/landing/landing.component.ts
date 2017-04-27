import { Component } from '@angular/core';

import {
	NetworkService,
} from '../services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Network, World } from '../models';



@Component({
  selector: 'landing',
  providers: [ NetworkService ],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent { 

	network: any = {
		world: {}
	};
	isEditingWorld = false;
	networkSocket: any;
	gamePaused = true;
	math: any;

	happinessData: number[] = [];
	happinessRange: number = 10;

	private happinessLimits: any = {
		max: Number.MIN_VALUE,
		min: Number.MAX_VALUE,
	};
	private isRendering: boolean = false;
	private prevResponse: any;
	private savedNetwork: Network;

	constructor(
		private _networkService: NetworkService
	) {
		this.networkSocket = this._networkService.connect();
		this.math = Math;
	}

	// ngDoCheck() {
	// 	console.log('ngDoCheck');
	// }

	// ngAfterContentInit() {
	// 	console.log('ngAfterContentInit');
	// }

	// ngAfterContentChecked() {
	// 	console.log('ngAfterContentChecked');
	// }

	// ngAfterViewInit() {
	// 	console.log('ngAfterViewInit');
	// }

	// ngAfterViewChecked() {
	// 	console.log('ngAfterViewChecked');
	// }

	ngOnInit() {
		this.getWorld();
	}

	cancelEdit(): void {
		this.isEditingWorld = false;
		this.resumeGame();
	}

	editWorld(): void {
		this.pauseGame();
		this.isEditingWorld = true;
	}

	loadGame(): void {
		this.pauseGame();
		this.network = this.savedNetwork;
	}

	getWorld() {
		this.network = this._networkService.getDefaultNetwork();
		let prevResponse: any = {
			boxes: [],
			playerA: [],
			playerB: [],
		};
		this.networkSocket.subscribe((response: any) => {
		// this.networkSocket.throttleTime(300).subscribe((response: any) => {
		// this.networkSocket.filter(() => !this.isRendering).subscribe((response: any) => {
			// console.log('gotData');
			// console.log('socket');
			// console.log(response);
			// if (!this.isRendering) {
				// console.log('rendering');
				this.isRendering = true;
				let responseObj = JSON.parse(response.data);
				// console.log(responseObj);
				this.network = new Network(responseObj);
				this.happinessStep(this.network.happiness);
				// this.network.resetWorld(prevResponse.boxes);
				// this.updateWorld('boxes', responseObj.boxes);
				// this.happinessStep(responseObj.happiness);
				this.isRendering = false;
			// } else {
			// 	this.prevResponse = response;
			// }
		});
	}

	happinessStep(value: number): void {
		if (value < this.happinessLimits.min) {
			this.happinessLimits.min = value;
		}
		if (value > this.happinessLimits.max) {
			this.happinessLimits.max = value;
		}
		let range = this.happinessLimits.max - this.happinessLimits.min;
		if (range > 0) {
			this.happinessRange = range;
		}
		this.happinessData.push(value);
		this.happinessData = this.happinessData.slice(-30);
	}

	

	saveWorld() {
		// this._networkService.sendWorld(this.network.world).then((result) => {
		// 	this.isEditingWorld = false;
		// });
		// console.log(this.network.getEntities());
		this.isEditingWorld = false;
		this.savedNetwork = this.network;
		this.startGame();
	}

	resetGame(): void {
		this.network = this._networkService.getDefaultNetwork();
		this.startGame();
	}

	startGame() {
		this.gamePaused = false;
		let gameObject = this.network.getEntities();
		gameObject.status = 'NEW';
		this.networkSocket.next(gameObject);
	}

	pauseGame(): void {
		this.gamePaused = true;
		this.networkSocket.next({
			status: 'PAUSE',
		});
	}

	resumeGame(): void {
		this.gamePaused = false;
		let gameObject = this.network.getEntities();
		gameObject.status = 'RESUME';
		// this.networkSocket.next({
		// 	status: 'RESUME',
		// });
		this.networkSocket.next(gameObject);
	}

	deleteWorld() {
		this.network = {
			world: {}
		}
	}
}
