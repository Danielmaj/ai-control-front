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
	isEditingWorld: boolean = false;
	networkSocket: any;
	gamePaused: boolean = true;
	gameRunning: boolean = false;
	happinessColor: string = '#000';
	happinessHeight: number = 200;
	math: any;

	happinessData: number[] = [];
	happinessRange: number = 10;

	private happinessLimits: any = {
		max: Number.MIN_VALUE,
		min: Number.MAX_VALUE,
	};
	private prevResponse: any;
	private savedNetwork: Network;

	constructor(
		private _networkService: NetworkService
	) {
		this.math = Math;
	}

	ngOnInit() {
		this.networkSocket = this._networkService.connect();
		this.populateWorld();
	}

	cancelEdit(): void {
		this.isEditingWorld = false;
		this.resumeGame();
	}

	deleteWorld() {
		this.network = {
			world: {}
		}
	}

	editWorld(): void {
		this.pauseGame();
		this.isEditingWorld = true;
	}

	loadGame(): void {
		this.stopGame();
		this.network = this.savedNetwork;
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

	pauseGame(): void {
		this.gamePaused = true;
		this._networkService.sendRequest({
			status: 'PAUSE',
		});
	}

	populateWorld(): void {
		this.network = this._networkService.getDefaultNetwork();
		let prevResponse: any = {
			boxes: [],
			playerA: [],
			playerB: [],
		};
		let sub = this.networkSocket.subscribe(
			(response: any) => {
				if (this.gameRunning) {
					let responseObj = JSON.parse(response.data);
					this.network = new Network(responseObj);
					this.happinessStep(this.network.happiness);
				}
			},
		);
	}

	resetGame(): void {
		this.stopGame();
		this.network = this._networkService.getDefaultNetwork();
	}

	resetHappiness(): void {
		this.happinessLimits = {
			max: Number.MIN_VALUE,
			min: Number.MAX_VALUE,
		};
		this.happinessRange = 10;
		this.happinessData = [];
	}

	resumeGame(): void {
		if (this.gameRunning) {
			this.gamePaused = false;
			this._networkService.sendRequest({
				status: 'RESUME',
			});
		}
	}

	saveWorld(): void {
		this.isEditingWorld = false;
		this.savedNetwork = this.network;
		this.startGame();
	}

	startGame(): void {
		this.gamePaused = false;
		this.gameRunning = true;
		let gameObject = this.network.getEntities();
		gameObject.status = 'NEW';
		this._networkService.sendRequest(gameObject);
	}

	stopGame(): void {
		this.gameRunning = false;
		this.pauseGame();
		this.resetHappiness();
	}
}
