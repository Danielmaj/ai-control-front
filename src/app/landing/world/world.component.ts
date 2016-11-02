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

	public many: Array<string> = ['The', 'possibilities', 'are', 'endless!'];
  	public many2: Array<string> = ['Explore', 'them'];

  	public filler: Square[][] = [
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

	public groups: Array<any> = [
		{
			name: 'Group A',
			items: [{name: 'Item A'},{name: 'Item B'},{name: 'Item C'},{name: 'Item D'}]
		},
		{
			name: 'Group B',
			items: [{name: 'Item 1'},{name: 'Item 2'},{name: 'Item 3'},{name: 'Item 4'}]
		}
	];

	constructor(private dragulaService: DragulaService) {
		// dragulaService.setOptions('the-bag', {
		// 	accepts: function() {
		// 		return false;
		// 	}
		// });
		dragulaService.setOptions('filler-bag', {
			copy: true,
		});
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

	private onDropModel(args: any) {
		let [el, target, source] = args;
		console.log(args);
		// console.log(el);
	 //    console.log(target);
	 //    console.log(source);
	 	console.log(target.attributes);
	 	// console.log(target.attributes.getNamedItem('ng-reflect-row').value);
	 	// console.log(JSON.stringify(target.attributes.getNamedItem('ng-reflect-dragula-model').value));
	 	// console.log(target.getAttribute('ng-reflect-row'));
	 	// console.log(JSON.stringify(target.getAttribute('ng-reflect-dragula-model')));
		// do something else
		var tX = target.getAttribute('ng-reflect-row');
		var tY = target.getAttribute('ng-reflect-column');
		var sX = source.getAttribute('ng-reflect-row');
		var sY = source.getAttribute('ng-reflect-column');
		if (this.world.grid[sX][sY].length) {
			this.world.grid[tX][tY].push(this.world.grid[sX][sY].pop()); 
		} else {
			this.world.grid[sX][sY].push(this.world.grid[tX][tY].pop()); 
		}
		console.log(this.world.grid[tX][tY]);
		console.log(this.world.grid[sX][sY]);
		console.log(tX, tY, sX, sY);
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
	}

	private onDrop(args: any) {
		let [el, target, source, sibling] = args;
		if (target && source) {
			var tX = target.getAttribute('ng-reflect-row');
			var tY = target.getAttribute('ng-reflect-column');
			var sX = source.getAttribute('ng-reflect-row');
			var sY = source.getAttribute('ng-reflect-column');
			// this.world.grid[sX][sY].push(this.world.grid[tX][tY].pop()); 
			console.log(this.world.grid[tX][tY]);
			console.log(this.world.grid[sX][sY]);
		}
		console.log('onDrop', args);
		this.addClass(el, 'ex-moved');
	}

	private onOver(args: any) {
		let [e, el, container] = args;
		this.addClass(el, 'ex-over');
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
}
