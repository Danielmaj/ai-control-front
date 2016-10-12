import { Component, Input } from '@angular/core';

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
})
export class WorldComponent { 

	// @Input() world: Object;
	_world: number[][] = [];

	constructor(

	) {
		console.log("construct");
	}

	@Input()
	set world(world: Object) {
		var totalWorld: number[][] = null;
		for (var key in world) {
			if (!world.hasOwnProperty(key)) {
				continue;
			}
			console.log(key);
			totalWorld = this.overLapWorlds(world[key], totalWorld);
		}
		console.log("setting");
		this._world = totalWorld;
	}

	ngOnInit() {
		console.log("init");
	}

	ngOnChanges() {
		console.log("changes");
	}

	overLapWorlds(a: number[][], b: number[][] = null): number[][] {
		if (!b) {
			return a;
		}
		var ret: number[][] = [];
		var length = a.length;

		for (var i = a.length - 1; i >= 0; i--) {
			ret[i] = [];
			for (var j = a[i].length - 1; j >= 0; j--) {
				ret[i][j] = a[i][j] + b[i][j];
			}
		}
		console.log(ret);

		return ret;
	}
}
