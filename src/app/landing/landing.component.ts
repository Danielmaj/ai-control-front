import { Component } from '@angular/core';

import {
	NetworkService,
	networks,
	values,
	worlds,
} from '../services';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Network, World } from '../models';

declare var tsnejs: any;

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
	tsne: any;
	dataObservable: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
	points: number[][];
	pointLabels: string[];
	data: any = [];
	values: number[] = [];

	color = '#000';
	timer: Observable<any>;
	speed = 10; // milliseconds per step
	tsneRunner: Subscription;

	tsneOptions = {
		epsilon: 10, // epsilon is learning rate (10 = default)
		perplexity: 30, // roughly how many neighbors each point influences (30 = default)
		dim: 2, // dimensionality of the embedding (2 = default)
	};


	networkSocket: any;

	illustrationWorld: World;
	showIllustrationWorld: boolean = false;

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
		this.values = values;
		this.timer = Observable.timer(0,this.speed);
		this.dataObservable.subscribe((value) => {
			this.points = value;
		});

		this.tsne = new tsnejs.tSNE(this.tsneOptions); // create a tSNE instance
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
				this.network = new Network(responseObj);
				this.happinessStep(this.network.happiness);
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

	startTsne() {
		if (this.tsneRunner) {
			this.tsneRunner.unsubscribe();
		}

		this.tsne = new tsnejs.tSNE(this.tsneOptions); // create a tSNE instance
		this.tsne.initDataRaw(networks);
		this.tsneRunner = this.timer.subscribe(() => this.tsneSteps(1));

		this.dataObservable.next(this.tsne.getSolution()); // Y is an array of 2-D points that you can plot
	}

	continueTsne(): void {
		if (!this.tsneRunner || this.tsneRunner.closed) {
			this.tsneRunner = this.timer.subscribe(() => this.tsneSteps(1));
		}
	}

	stopTsne(): void {
		if (this.tsneRunner) {
			this.tsneRunner.unsubscribe();
		}
	}

	tsneSteps(steps: number): void {
		// console.log(this.tsne);
		for(var k = 0; k < steps; k++) {
			this.tsne.step(); // every time you call this, solution gets better
		}
		this.dataObservable.next(this.tsne.getSolution());
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

	showState(index: number): void {
		this.illustrationWorld = new Network(worlds[index]).world;
		this.showIllustrationWorld = true;
	}

	componentToHex(c: number): string {
	    let hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	rgbToHex(r: number, g: number, b: number): string {
	    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	}
}
