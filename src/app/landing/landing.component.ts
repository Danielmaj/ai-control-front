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

// var helpers = require('../../../config/helpers');
// console.log('helpers', helpers.root('src'));

// var path = require('path');
// console.log(path);
// console.log(__dirname);
// var ROOT_FOLDER = path.resolve(__dirname, '..');
// console.log(ROOT_FOLDER);

// import '../../../public/js/tsne.js';

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
	editWorld = false;
	tsne: any;
	dataObservable: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
	points: number[][];
	pointLabels: string[];
	data: any = [];
	dists: number[][] = [];
	values: number[] = [];

	fakeData: any[] = [];

	side = 4;

	color = '#000';
	timer: Observable<any>;
	speed = 10; // milliseconds per step
	runner: Subscription;

	tsneOptions = {
		epsilon: 10, // epsilon is learning rate (10 = default)
		perplexity: 30, // roughly how many neighbors each point influences (30 = default)
		dim: 2, // dimensionality of the embedding (2 = default)
	};

	happinessTimer = Observable.timer(0,100);
	happinessData: number[] = [];
	happinessRunner: Subscription;

	networkSocket: any;

	illustrationWorld: World;
	showIllustrationWorld: boolean = false;

	gamePaused = false;
	math: any;

	constructor(
		private _networkService: NetworkService
	) {
		this.networkSocket = this._networkService.connect();
		this.math = Math;
	}

	ngOnInit() {
		this.generateData();
		this.values = values;
		this.timer = Observable.timer(0,this.speed);
		this.dataObservable.subscribe((value) => {
			// console.log('observed', value);
			this.points = value;
		});

		this.tsne = new tsnejs.tSNE(this.tsneOptions); // create a tSNE instance
		// console.log(this.tsne);
		this.getWorld();
	}

	log(data: any) {
		console.log(data);
	}

	sendWebsocket() {
		// this.networkSocket.next({
  //           playerA: [[0, 1]],
  //           playerB: [[10, 10]],
  //           boxes: [[5, 5], [4, 4], [2, 2]],
  //           delyvery: [[9, 10], [8, 10]],
  //       });
		this._networkService.getNetwork().then((network) => {
			// console.log(network);
			this.networkSocket.next(network.getEntities());
		});
	}

	getWorld() {
		this.networkSocket.subscribe((response: any) => {
			// console.log('socket');
			// console.log(response);
			let responseObj = JSON.parse(response.data);
			this.network = new Network(responseObj);
		});
		this._networkService.getNetwork().then((network) => {
			// console.log(network);
			this.network = network;
		});
	}

	// sleep(ms: number): Promise<any> {
	//   return new Promise(resolve => setTimeout(resolve, ms));
	// }

	continueHappiness(): void {
		if (!this.happinessRunner || this.happinessRunner.closed) {
			this.happinessRunner = this.happinessTimer.subscribe(() => this.happinessStep());
		}
	}

	happinessStep(): void {
		// let length = 30;
		// console.log(Math.random());
		this.happinessData.push(Math.random());
		// if (this.happinessData.length > length) {
			this.happinessData = this.happinessData.slice(-30);
		// }
	}

	stopHappiness(): void {
		if (this.happinessRunner) {
			this.happinessRunner.unsubscribe();
		}
	}

	generateData(): void {
		// var data: any[][] = [];
		// var labels: string[] = [];
		// // i%this.side + ', ' + Math.floor(i/this.side)
		// for (var i = 0; i < this.side; ++i) {
		// 	for (var j = 0; j < this.side; ++j) {
		// 		for (var k = 0; k < this.side; ++k) {
		// 			for (var l = 0; l < this.side; ++l) {
		// 				data.push([i, j, k, l]);
		// 				labels.push("Coords: " + [i,j,k,l].join(", "));
		// 			}
		// 		}
		// 	}
		// 	// data[i] = [i%this.side, Math.floor(i/this.side)]
		// }
		// this.fakeData = data;
		// this.pointLabels = labels;
		// var size = data.length;
		// var dists: number[][] = [];
		// for(var i = 0; i < size; i++) {
		// 	dists.push([]);
		// 	for(var j = 0; j < size; j++) {
		// 		dists[i].push(0);
		// 	}
		// }
		// // compute pairwise distances
		// for(var i = 0; i < size; i++) {
		// 	for(var j = i + 1; j < size; j++) {
		// 		dists[i][j] = 0
		// 		for (var k = data[i].length - 1; k >= 0; k--) {
		// 			dists[i][j] += Math.pow(data[i][k] - data[j][k], 2)
		// 		}
		// 		dists[i][j] = Math.sqrt(dists[i][j]) / 50;
		// 		dists[j][i] = dists[i][j];
		// 	}
		// }
		// this.dists = dists;
		// this.data = networks;
		// this.dists = require('./result.json');
	}

	tsneTest() {
		if (this.runner) {
			this.runner.unsubscribe();
		}
		// initialize data. Here we have 3 points and some example pairwise dissimilarities
		// var dists = [
		// 	[1.0, 0.1, 0.2], [0.1, 1.0, 0.3], [0.2, 0.1, 1.0],
		// ];
		// var size = 100;		

		this.tsne = new tsnejs.tSNE(this.tsneOptions); // create a tSNE instance
		// console.log('data', networks);
		this.tsne.initDataRaw(networks);

		// this.data = this.tsne.getSolution(); // Y is an array of 2-D points that you can plot
		// for(var k = 0; k < 5; k++) {
		// 	// this.sleep(1000).then(() => this.tsneSteps(100));
		// 	this.tsneSteps(500);
		// }
		this.runner = this.timer.subscribe(() => this.tsneSteps(1));

		this.dataObservable.next(this.tsne.getSolution()); // Y is an array of 2-D points that you can plot
	}

	continueTsne(): void {
		if (!this.runner || this.runner.closed) {
			this.runner = this.timer.subscribe(() => this.tsneSteps(1));
		}
	}

	stopTsne(): void {
		if (this.runner) {
			this.runner.unsubscribe();
		}
	}

	tsneSteps(steps: number): void {
		// console.log(this.tsne);
		for(var k = 0; k < steps; k++) {
			this.tsne.step(); // every time you call this, solution gets better
		}
		this.dataObservable.next(this.tsne.getSolution());
	}

	toggleBox() {
		let entitites = this.network.getEntities();
		// console.log(entitites);
		// console.log(entitites.playerA[0].carryBox);
		entitites.playerA[0].carryBox = !entitites.playerA[0].carryBox;
		this.networkSocket.next(entitites);
	}

	saveWorld() {
		// this._networkService.sendWorld(this.network.world).then((result) => {
		// 	this.editWorld = false;
		// });
		// console.log(this.network.getEntities());
		this.editWorld = false;
	}

	startGame() {
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
		this.networkSocket.next({
			status: 'RESUME',
		});
	}

	deleteWorld() {
		this.network = {
			world: {}
		}
	}

	showState(index: number): void {
		console.log('showing', index, worlds[index]);
		this.illustrationWorld = new Network(worlds[index]).world;
		this.showIllustrationWorld = true;
		console.log(this.showIllustrationWorld);
	}

	componentToHex(c: number): string {
	    let hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	rgbToHex(r: number, g: number, b: number): string {
	    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
	}
}
