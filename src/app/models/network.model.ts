export class Network {
	happiness: number;
	intelligence: number;
	reward: number;
	world: World;

	constructor(data: any) {
		if (data.world) {
			this.world = new World(10, 10, data.world);
		} else {
			this.world = new World(10, 10);
		}
		this.happiness = data.happiness;
		this.intelligence = data.intelligence;
		this.reward = data.reward;
		for (let i = Square.layerPriority.length - 1; i >= 0; i--) {
			let label = Square.layerPriority[i];
			if (data[label]) {
				for (let j = data[label].length - 1; j >= 0; j--) {
					let position = data[label][j].position;
					if (data[label][j].carryBox) {
						this.world.grid[position[0]][position[1]][0].carryBox = true;
					}
					if (typeof data[label][j].isAlive !== 'undefined') {
						this.world.grid[position[0]][position[1]][0].isDead = !data[label][j].isAlive;
					}
					this.world.grid[position[0]][position[1]][0].setContentLayer(label, 1);
				}
			}
		}
	}

	getEntities() {
		let ret: any = {
			happiness: this.happiness,
			intelligence: this.intelligence,
			reward: this.reward,
			boxes: [],
			delivery: [],
			playerA: [],
			playerB: [],
		}
		let length = this.world.grid.length;
		for (let i = 0; i < length; ++i) {
			let width = this.world.grid[i].length;
			for (let j = 0; j < width; ++j) {
				let content = this.world.grid[i][j][0].getContent();
				if (content) {
					let contentObj: any = {
						position: [i, j],
					}
					if (this.world.grid[i][j][0].carryBox) {
						contentObj.carryBox = true;
					}
					contentObj.isAlive = !this.world.grid[i][j][0].isDead;
					ret[content].push(contentObj);
				}
			}
		}
		return ret;
	}
}

export class World {
	public grid: Square[][][] = [];
	constructor(length: number, width: number, layers = {}) {
		console.log('create world', length, width, layers);
		for (var i = 0; i < length; ++i) {
			var row: Square[][] = [];
			for (var j = 0; j < width; ++j) {
				var square = new Square();
				for (var key in layers) {
					square.setContentLayer(key, layers[key][i][j]);
				}
				row.push([square]);
			}
			this.grid.push(row);
		}
	}
}

export class Square {
	static layerPriority = ['boxes', 'delivery', 'playerA', 'playerB'];
	public carryBox = false;
	public isDead = false;

	constructor(public content = {}) {}

	setContentLayer(layer: string, value: number) {
		this.content[layer] = value;
	}

	getContent(): string {
		for (var i = Square.layerPriority.length - 1; i >= 0; i--) {
			if (this.content[Square.layerPriority[i]]) {
				return Square.layerPriority[i];
			}
		}
		return '';
	}
}