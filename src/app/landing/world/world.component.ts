import { Component, EventEmitter, Input, Output } from '@angular/core';

import { World, Square } from '../../models';

import { DragulaService } from 'ng2-dragula/ng2-dragula';
// console.log(DragulaService);

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
})
export class WorldComponent { 

	@Input() world: World;
	@Output() worldChange = new EventEmitter<World>();

  	public fillers: Square[][] = [
  		[new Square({
  			boxes: 1, 
  			delivery: 0,
  			playerA: 0,
  			playerB: 0,
  		})],
  		[new Square({
  			boxes: 0, 
  			delivery: 1,
  			playerA: 0,
  			playerB: 0,
  		})],
  		[new Square({
  			boxes: 0, 
  			delivery: 0,
  			playerA: 1,
  			playerB: 0,
  		})],
  		[new Square({
  			boxes: 0, 
  			delivery: 0,
  			playerA: 0,
  			playerB: 1,
  		})],
  	];

  	public swapper = {
  		aX: 0,
  		aY: 0,
  		bX: 0,
  		bY: 0,
  	}

	constructor(private dragulaService: DragulaService) {
		dragulaService.setOptions('the-bag', {
			accepts: (el: any, target: any, source: any, sibling: any) => { 
				return !(this.hasClass(source, 'filler-bag') && this.hasClass(target, 'filler-bag'));
			}
		});
		// dragulaService.setOptions('filler-bag', {
		// 	copy: true,
		// });
		dragulaService.drag.subscribe((value: any) => {
			this.onDrag(value.slice(1));
		});
		dragulaService.drop.subscribe((value: any) => {
			console.log('drop', value);
			this.onDrop(value.slice(1));
		});
		dragulaService.over.subscribe((value: any) => {
			this.onOver(value.slice(1));
		});
		dragulaService.out.subscribe((value: any) => {
			this.onOut(value.slice(1));
		});
		dragulaService.cancel.subscribe((value: any) => {
			this.onCancel(value.slice(1));
		});
		dragulaService.dropModel.subscribe((value: any) => {
			this.onDropModel(value.slice(1));
		});
		dragulaService.removeModel.subscribe((value: any) => {
			this.onRemoveModel(value.slice(1));
		});
		console.log("construct");
	}

	ngOnInit() {
		console.log("init");
	}

	ngOnChanges() {
		console.log("changes");
	}

	logWorld() {
		console.log(this.world);
	}

	swapSquares() {
		this.swapCoords(this.swapper.aX, this.swapper.aY, this.swapper.bX, this.swapper.bY);
	}

	swapCoords(aX: number, aY: number, bX: number, bY: number) {
		console.log('swapping', aX, aY, bX, bY);
		if (aX && aY && bX && bY) {
			var newA = this.world.grid[bX][bY];
			var newB = this.world.grid[aX][aY];
			console.log('a', newA, 'b', newB);
			this.world.grid[aX][aY] = newA;
			this.world.grid[bX][bY] = newB;
			console.log('a', this.world.grid[aX][aY], 'b', this.world.grid[bX][bY]);
		}
	}

	private onDropModel(args: any) {
		let [el, target, source] = args;
		console.log('dropModel', args);
		// console.log(el);
	 //    console.log(target);
	 //    console.log(source);
	 	console.log(target.attributes);
	 	// console.log(target.attributes.getNamedItem('ng-reflect-row').value);
	 	// console.log(JSON.stringify(target.attributes.getNamedItem('ng-reflect-dragula-model').value));
	 	// console.log(target.getAttribute('ng-reflect-row'));
	 	// console.log(JSON.stringify(target.getAttribute('ng-reflect-dragula-model')));
		// do something else
		if (target && source) {
			// var tX = target.getAttribute('ng-reflect-row');
			// var tY = target.getAttribute('ng-reflect-column');
			// var sX = source.getAttribute('ng-reflect-row');
			// var sY = source.getAttribute('ng-reflect-column');
			// if (this.world.grid[sX][sY].length) {
			// 	this.world.grid[tX][tY].push(this.world.grid[sX][sY].pop()); 
			// } else {
			// 	this.world.grid[sX][sY].push(this.world.grid[tX][tY].pop()); 
			// }
			// // this.swapCoords(tX, tY, sX, sY);
			// this.world.grid[tX] = this.world.grid[tX].slice();
			// this.world.grid[sX] = this.world.grid[sX].slice();
			// console.log(this.world.grid[tX][tY]);
			// console.log(this.world.grid[sX][sY]);
			// console.log(tX, tY, sX, sY);
		} else {
			console.log('missing target or source', target, source);
		}
	}

	private onRemoveModel(args: any) {
		let [el, source] = args;
		console.log(args);
		// do something else
	}

	private hasClass(el: any, name: string) {
		return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
	}

	private addClass(el: any, name: string) {
		if (!this.hasClass(el, name)) {
			el.className = el.className ? [el.className, name].join(' ') : name;
		}
	}

	private removeClass(el: any, name: string) {
		if (this.hasClass(el, name)) {
			el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
		}
	}

	private onDrag(args: any) {
		let [e, el] = args;
		console.log('onDrag', args);
		this.removeClass(e, 'ex-moved');
		if (!this.hasClass(el, 'filler-bag')) {
			this.addClass(el, 'drag-start');
		}
	}

	private onDrop(args: any) {
		let [el, target, source, sibling] = args;
		console.log('onDrop', args);
		console.log(this.fillers);
		if (target && source) {
			if (this.hasClass(target, 'filler-bag')) {
				var x = source.getAttribute('ng-reflect-row');
				var y = source.getAttribute('ng-reflect-column');
				this.world.grid[x][y][0].content = {};
				this.world.grid[x] = this.world.grid[x].slice();
				el.remove();
				this.resetFillers();
			} else if (this.hasClass(source, 'filler-bag')) {
				var x = target.getAttribute('ng-reflect-row');
				var y = target.getAttribute('ng-reflect-column');
				var column = el.getAttribute('ng-reflect-column');
				console.log('delete', column, this.world.grid[x][y], this.fillers[column]);
				this.world.grid[x][y][0].content = this.fillers[column][0].content;
				this.world.grid[x] = this.world.grid[x].slice();
				this.resetFillers();
			} else {
				var tX = target.getAttribute('ng-reflect-row');
				var tY = target.getAttribute('ng-reflect-column');
				var sX = source.getAttribute('ng-reflect-row');
				var sY = source.getAttribute('ng-reflect-column');
				// if (this.world.grid[sX][sY].length) {
				// 	this.world.grid[tX][tY].push(this.world.grid[sX][sY].pop()); 
				// } else {
				// 	this.world.grid[sX][sY].push(this.world.grid[tX][tY].pop()); 
				// }
				this.swapCoords(tX, tY, sX, sY);
				this.world.grid[tX] = this.world.grid[tX].slice();
				this.world.grid[sX] = this.world.grid[sX].slice();
				console.log(this.world.grid[tX][tY]);
				console.log(this.world.grid[sX][sY]);
			}
		} else {
			console.log('missing target or source');
		}
		this.addClass(el, 'ex-moved');
		this.removeClass(el, 'drag-start');
	}

	private onOver(args: any) {
		let [e, target, source] = args;
		if (!(this.hasClass(source, 'filler-bag') && this.hasClass(target, 'filler-bag'))) {
			this.addClass(target, 'ex-over');
		}
	}

	private onOut(args: any) {
		let [e, el, container] = args;
		this.removeClass(el, 'ex-over');
	}

	private onCancel(args: any) {
		console.log('cancel', args);
		let [el, target, source] = args;
		// console.log(source.attributes.getNamedItem('ng-reflect-row').nodeValue);
		// console.log(source.attributes.getNamedItem('ng-reflect-column').nodeValue);
		// console.log(target.attributes.getNamedItem('ng-reflect-row').nodeValue);
		// console.log(target.attributes.getNamedItem('ng-reflect-column').nodeValue);
	}

	private resetFillers() {
		this.emptyFillers();
		this.setFillers();
		// var test = this.fillers.slice();
		// this.fillers = [];
		// console.log('fillers empty', this.fillers);
		// this.fillers = test;
		// // this.fillers.push([new Square()]);
		// // this.fillers[0] = this.fillers[0].slice();
		// console.log('fillers', this.fillers);
	}

	private emptyFillers() {
		this.fillers = [];
	}

	private setFillers() {
		this.fillers = [
	  		[new Square({
	  			boxes: 1, 
	  			delivery: 0,
	  			playerA: 0,
	  			playerB: 0,
	  		})],
	  		[new Square({
	  			boxes: 0, 
	  			delivery: 1,
	  			playerA: 0,
	  			playerB: 0,
	  		})],
	  		[new Square({
	  			boxes: 0, 
	  			delivery: 0,
	  			playerA: 1,
	  			playerB: 0,
	  		})],
	  		[new Square({
	  			boxes: 0, 
	  			delivery: 0,
	  			playerA: 0,
	  			playerB: 1,
	  		})],
	  	];
	}
}
