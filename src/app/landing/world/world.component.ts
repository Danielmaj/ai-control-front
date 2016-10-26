import { Component, Input } from '@angular/core';

import { World } from '../../models';

import { DragulaService } from 'ng2-dragula/ng2-dragula';
// console.log(DragulaService);

@Component({
  selector: 'world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.css'],
})
export class WorldComponent { 

	_world: World;

	public many: Array<string> = ['The', 'possibilities', 'are', 'endless!'];
  	public many2: Array<string> = ['Explore', 'them'];

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
		dragulaService.drag.subscribe((value: any) => {
			this.onDrag(value.slice(1));
		});
		dragulaService.drop.subscribe((value: any) => {
			this.onDrop(value.slice(1));
		});
		dragulaService.over.subscribe((value: any) => {
			this.onOver(value.slice(1));
		});
		dragulaService.out.subscribe((value: any) => {
			this.onOut(value.slice(1));
		});
		dragulaService.dropModel.subscribe((value: any) => {
			this.onDropModel(value.slice(1));
		});
		dragulaService.removeModel.subscribe((value: any) => {
			this.onRemoveModel(value.slice(1));
		});
		console.log("construct");
	}

	@Input()
	set world(world: World) {
		this._world = world;
	}

	ngOnInit() {
		console.log("init");
	}

	ngOnChanges() {
		console.log("changes");
	}

	private onDropModel(args: any) {
		let [el, target, source] = args;
		// do something else
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

	private onDrag(args: any) {
		let [e, el] = args;
		this.removeClass(e, 'ex-moved');
	}

	private onDrop(args: any) {
		let [e, el] = args;
		this.addClass(e, 'ex-moved');
	}

	private onOver(args: any) {
		let [e, el, container] = args;
		this.addClass(el, 'ex-over');
	}

	private onOut(args: any) {
		let [e, el, container] = args;
		this.removeClass(el, 'ex-over');
	}
}
