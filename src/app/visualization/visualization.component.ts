import { Component } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Network, World } from '../models';

import {
	networks,
	values,
	worlds,
} from '../services';

declare var tsnejs: any;

@Component({
  selector: 'visualization',
  templateUrl: './visualization.component.html',
  styleUrls: ['./visualization.component.css'],
})
export class VisualizationComponent {

	color = '#000';
	math: any;
	illustrationWorld: World;
	legendValues: number[] = [];
	showIllustrationWorld: boolean = false;

	private dataObservable: BehaviorSubject<number[][]> = new BehaviorSubject<number[][]>([]);
	private points: number[][];
	private speed = 10; // milliseconds per step
	private timer: Observable<any>;
	private tsne: any;
	private tsneOptions = {
		epsilon: 10, // epsilon is learning rate (10 = default)
		perplexity: 30, // roughly how many neighbors each point influences (30 = default)
		dim: 2, // dimensionality of the embedding (2 = default)
	};
	private tsneRunner: Subscription;
	private values: number[] = [];

	constructor() {
		this.math = Math;
	}

	ngOnInit() {
		console.log('init');
		this.dataObservable.subscribe((value) => {
			this.points = value;
		});

		this.illustrationWorld = new World(10, 10);

		for (var i = 0; i < 100; i++) {
			this.legendValues.push(i);
		}

		this.values = values;
		this.timer = Observable.timer(0,this.speed);
		this.tsne = new tsnejs.tSNE(this.tsneOptions); // create a tSNE instance
	}

	componentToHex(c: number): string {
	    let hex = c.toString(16);
	    return hex.length == 1 ? "0" + hex : hex;
	}

	continueTsne(): void {
		if (!this.tsneRunner || this.tsneRunner.closed) {
			this.tsneRunner = this.timer.subscribe(() => this.tsneSteps(1));
		}
	}

	rgbToHex(r: number, g: number, b: number): string {
	    return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
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
	
	showState(index: number): void {
		this.illustrationWorld = new Network(worlds[index]).world;
		this.showIllustrationWorld = true;
	}

	stopTsne(): void {
		if (this.tsneRunner) {
			this.tsneRunner.unsubscribe();
		}
	}

	tsneSteps(steps: number): void {
		for(var k = 0; k < steps; k++) {
			this.tsne.step(); // every time you call this, solution gets better
		}
		this.dataObservable.next(this.tsne.getSolution());
	}

}
