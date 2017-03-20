import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

import { World, Square } from '../../models';

import { DragulaService } from 'ng2-dragula/ng2-dragula';
// console.log(DragulaService);

@Component({
  selector: 'world, [worldComponent]',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
})
export class WorldComponent { 

	@Input() editable: boolean = false;
	@Input() world: World;
	@Input() readOnly: boolean = false;
	@Output() worldChange = new EventEmitter<World>();

  	public fillers: Square[][] = [];

  	public swapper = {
  		aX: 0,
  		aY: 0,
  		bX: 0,
  		bY: 0,
  	}

	constructor(private dragulaService: DragulaService) {
		console.log("construct");
	}

	ngOnInit() {
		if (!this.readOnly) {
			this.dragulaService.setOptions('the-bag', {
				accepts: (el: any, target: any, source: any, sibling: any) => { 
					return !(this.hasClass(source, 'filler-bag') && this.hasClass(target, 'filler-bag'));
				}
			});
			this.dragulaService.shadow.subscribe((value: any) => {
				this.onShadow(value.slice(1));
			});
			this.dragulaService.drag.subscribe((value: any) => {
				this.onDrag(value.slice(1));
			});
			this.dragulaService.drop.subscribe((value: any) => {
				console.log('drop', value);
				this.onDrop(value.slice(1));
			});
			this.dragulaService.over.subscribe((value: any) => {
				this.onOver(value.slice(1));
			});
			this.dragulaService.out.subscribe((value: any) => {
				this.onOut(value.slice(1));
			});
			this.dragulaService.cancel.subscribe((value: any) => {
				this.onCancel(value.slice(1));
			});
			this.dragulaService.dropModel.subscribe((value: any) => {
				this.onDropModel(value.slice(1));
			});
			this.dragulaService.removeModel.subscribe((value: any) => {
				this.onRemoveModel(value.slice(1));
			});
			this.setFillers();
		}
		console.log("init");
	}

	ngOnDestroy() {
        console.log('destroy');
        this.dragulaService.destroy('the-bag')
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

	private onShadow(args: any) {
		let [el, target, source] = args;
	}

	private onDrag(args: any) {
		let [e, el] = args;
		console.log('onDrag', args);
		// this.removeClass(e, 'ex-moved');
		if (!this.hasClass(el, 'filler-bag')) {
			this.addClass(el, 'drag-start');
		}
	}

	private onDrop(args: any) {
		let [el, target, source, sibling] = args;
		console.log('onDrop', args);
		if (target && source) {
			if (this.hasClass(target, 'filler-bag')) {
				var x = source.getAttribute('data-row');
				var y = source.getAttribute('data-column');
				this.world.grid[x][y][0].content = {};
				this.world.grid[x] = this.world.grid[x].slice();
				el.remove();
				this.resetFillers();
			} else if (this.hasClass(source, 'filler-bag')) {
				var x = target.getAttribute('data-row');
				var y = target.getAttribute('data-column');
				var column = el.getAttribute('data-column');
				console.log('delete', column, this.world.grid[x][y], this.fillers[column]);
				this.world.grid[x][y][0].content = this.fillers[column][0].content;
				this.world.grid[x] = this.world.grid[x].slice();
				this.resetFillers();
			} else {
				var tX = target.getAttribute('data-row');
				var tY = target.getAttribute('data-column');
				var sX = source.getAttribute('data-row');
				var sY = source.getAttribute('data-column');
				this.swapCoords(tX, tY, sX, sY);
				this.world.grid[tX] = this.world.grid[tX].slice();
				this.world.grid[sX] = this.world.grid[sX].slice();
				console.log(this.world.grid[tX][tY]);
				console.log(this.world.grid[sX][sY]);
			}
		} else {
			console.log('missing target or source');
		}
		// this.addClass(el, 'ex-moved');
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
		this.removeClass(source, 'drag-start');
	}

	private resetFillers() {
		this.emptyFillers();
		this.setFillers();
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
