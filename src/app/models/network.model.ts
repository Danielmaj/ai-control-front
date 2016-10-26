export class Network {
    world: World;
    happiness: number;

    constructor(data = {world: {}, happiness: 0}) {
    	if (data.world) {
    		this.world = new World(10, 10, data.world);
    	}
    	this.happiness = data.happiness;
    }
}

export class World {
	public grid: Square[][] = [];
	constructor(length: number, width: number, layers = {}) {
		for (var i = 0; i < length; ++i) {
			var row: Square[] = [];
			for (var j = 0; j < width; ++j) {
				var square = new Square();
				for (var key in layers) {
					square.setContent(key, layers[key][i][j]);
				}
				row.push(square);
			}
			this.grid.push(row);
		}
	}
}

export class Square {
	private static layerPriority = ['boxes', 'delivery', 'playerA', 'playerB'];

	constructor(public content = {}) {}

	setContent(layer: string, value: number) {
		this.content[layer] = value;
	}

	getContent() {
		for (var i = Square.layerPriority.length - 1; i >= 0; i--) {
			if (this.content[Square.layerPriority[i]]) {
				return Square.layerPriority[i];
			}
		}
		return '';
	}
}