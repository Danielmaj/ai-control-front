import { Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';

import { World, Square } from '../../models';

import { DragulaService } from 'ng2-dragula/ng2-dragula';

@Component({
  selector: 'world, [worldComponent]',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
})
export class WorldComponent { 

	@Input() editable: boolean = false;
	@Input() paused: boolean = true;
	@Input() world: World;
	@Input() readOnly: boolean = false;
	@Input() size: string = 'regular';
	@Output() worldChange = new EventEmitter<World>();

  	public fillers: Square[][] = [];

  	public swapper = {
  		aX: 0,
  		aY: 0,
  		bX: 0,
  		bY: 0,
  	}

	constructor(private dragulaService: DragulaService) {
	}

	ngOnInit() {
		if (!this.readOnly) {
			this.dragulaService.setOptions('the-bag', {
				accepts: (el: any, target: any, source: any, sibling: any) => { 
					return !(this.hasClass(source, 'filler-bag') && this.hasClass(target, 'trash-bag')) && 
					!this.hasClass(target, 'filler-bag');
				}
			});
			this.dragulaService.shadow.subscribe((value: any) => {
				this.onShadow(value.slice(1));
			});
			this.dragulaService.drag.subscribe((value: any) => {
				this.onDrag(value.slice(1));
			});
			this.dragulaService.drop.subscribe((value: any) => {
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
	}

	ngOnDestroy() {
        if (this.dragulaService.find('the-bag')) {
        	this.dragulaService.destroy('the-bag');
        }
    }

	ngOnChanges() {
	}

	logWorld() {
	}

	swapSquares() {
		this.swapCoords(this.swapper.aX, this.swapper.aY, this.swapper.bX, this.swapper.bY);
	}

	swapCoords(aX: number, aY: number, bX: number, bY: number) {
		if (aX && aY && bX && bY) {
			var newA = this.world.grid[bX][bY];
			var newB = this.world.grid[aX][aY];
			this.world.grid[aX][aY] = newA;
			this.world.grid[bX][bY] = newB;
		}
	}

	private onDropModel(args: any) {
		let [el, target, source] = args;
	}

	private onRemoveModel(args: any) {
		let [el, source] = args;
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
		// this.removeClass(e, 'ex-moved');
		if (!this.hasClass(el, 'filler-bag')) {
			this.addClass(el, 'drag-start');
			// this.addClass(e, 'test');
			var x = el.getAttribute('data-row');
			var y = el.getAttribute('data-column');
			this.world.grid[x][y][0].hasPlaceholder = true;
		}
	}

	private onDrop(args: any) {
		let [el, target, source, sibling] = args;
		if (target && source) {
			var sX = source.getAttribute('data-row');
			var sY = source.getAttribute('data-column');
			var tX = target.getAttribute('data-row');
			var tY = target.getAttribute('data-column');
			if (this.hasClass(source, 'filler-bag')) {
				// var column = el.getAttribute('data-column');
				// this.world.grid[tX][tY][0].content = this.fillers[column][0].content;
				this.world.grid[tX][tY][0].content = this.fillers[sY][0].content;
				this.world.grid[tX] = this.world.grid[tX].slice();
				this.resetFillers();
			} else {
				this.world.grid[sX][sY][0].hasPlaceholder = false;
				// if (this.hasClass(target, 'filler-bag')) {
				if (this.hasClass(target, 'trash-bag')) {
					this.world.grid[sX][sY][0].content = {};
					this.world.grid[sX] = this.world.grid[sX].slice();
					el.remove();
					// this.resetFillers();
				} else {
					this.swapCoords(tX, tY, sX, sY);
					this.world.grid[tX] = this.world.grid[tX].slice();
					this.world.grid[sX] = this.world.grid[sX].slice();
				}
			}
		} else {
		}
		// this.addClass(el, 'ex-moved');
		this.removeClass(el, 'drag-start');
	}

	private onOver(args: any) {
		let [e, target, source] = args;
		if (!(this.hasClass(source, 'trash-bag'))) {
			if (this.hasClass(target, 'trash-bag')) {
				this.addClass(target, 'ex-over');
				this.addClass(e, 'no-mirror');
			} else {
				this.removeClass(e, 'no-mirror');
			}
		}
	}

	private onOut(args: any) {
		let [e, el, container] = args;
		this.removeClass(el, 'ex-over');
	}

	private onCancel(args: any) {
		let [el, target, source] = args;
		this.removeClass(source, 'drag-start');
		var x = source.getAttribute('data-row');
		var y = source.getAttribute('data-column');
		this.world.grid[x][y][0].hasPlaceholder = false;
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
