import { Prim, Thread } from 'sphere-runtime'

const CELL_SIZE = 8;
const LINES_COL = Color.Blue.fadeTo(0.5);
const EMPTY_COL = Color.Black;
const ALIVE_COL = Color.White;
const DEAD_COL = new Color(0.3,0.3,0.3); // because Color.DarkGray isn't very dark
const font = Font.Default;
const kb = Keyboard.Default;
const mouse = Mouse.Default;
const screen = Surface.Screen;
const CELLS_X = screen.width / CELL_SIZE;
const CELLS_Y = screen.height / CELL_SIZE;
enum CellState {
	Empty, Alive, Dead
};

type NeighborList = {
	nw?:CellState, n?:CellState, ne?:CellState,
	w?:CellState,  e?:CellState,
	sw?:CellState, s?:CellState, se?:CellState
};

let timing = 20;
let cells:Array<Uint8Array>;
let showGrid = true;
let gridTex:Surface;
let gridShape:Shape;

// Drawing optimizations
let cellPx = new Uint8Array(CELLS_X * CELLS_Y * 4); // Cells are stored as 1x1 pixels and drawn scaled to CELL_SIZE
let cellTransform = new Transform();
let cellShape = new Shape(ShapeType.TriStrip, null, new VertexList([
	{ x: 0,  y: 0,  u: 0, v: 1 },
	{ x: CELL_SIZE, y: 0,  u: 1, v: 1 },
	{ x: 0, y: CELL_SIZE, u: 0, v: 0 },
	{ x: CELL_SIZE, y: CELL_SIZE, u: 1, v: 0 }
]));

let running = true;
let numSteps = 1;

export default class Main extends Thread {
	constructor() {
		super();
		Sphere.frameRate = 120;
		cellPx.fill(255);
		cellShape.texture = new Texture(CELLS_X, CELLS_Y, cellPx);
		cellTransform.identity().scale(screen.width/CELL_SIZE, screen.height/CELL_SIZE);

		if(showGrid) {
			// create grid texture/shape to be drawn onto the board if showGrid == true
			gridTex = new Surface(screen.width, screen.height, Color.Transparent);
			for(let y = 0; y < screen.height; y += CELL_SIZE) {
				Prim.drawLine(gridTex, 0, y, screen.width, y, 1, LINES_COL);
			}
			for(let x = 0; x < screen.width; x += CELL_SIZE) {
				Prim.drawLine(gridTex, x, 0, x, screen.height, 1, LINES_COL);
			}
			gridShape = new Shape(ShapeType.TriStrip, gridTex, new VertexList([
				{ x: 0, y: 0, u: 0, v: 1 },
				{ x: screen.width, y: 0, u: 1, v: 1 },
				{ x: 0, y: screen.height, u: 0, v: 0 },
				{ x: screen.width, y: screen.height, u: 1, v: 0}
			]));
		}

		// Create 2-dimensional array and fill it with empty cells
		cells = new Array(CELLS_X);
		for(let x = 0; x < CELLS_X; x++) {
			cells[x] = new Uint8Array(CELLS_Y);
			for(let y = 0; y < CELLS_Y; y++) {
				cells[x][y] = CellState.Empty;
			}
		}
	}

	forEach(cb:(x:number, y:number)=>any) {
		// iterate through each cell on the board and call the given function with the cell coordinates
		for(let y = 0; y < CELLS_Y; y++) {
			for(let x = 0; x < CELLS_X; x++) {
				cb(x, y);
			}
		}
	}

	clearBoard() {
		// set all cell states on the board to empty
		this.forEach((x, y) => cells[x][y] = CellState.Empty);
		numSteps = 0;
	}

	mouseToCellPos():number[] {
		// get the position of the cell that the mouse pointer is in
		return [Math.trunc(mouse.x/CELL_SIZE), Math.trunc(mouse.y/CELL_SIZE)];
	}

	livingCells():number {
		// return the number of living cells on the whole board
		let numLiving = 0;
		for(let cX of cells) {
			for(let cell of cX) {
				if(cell === CellState.Alive) numLiving++;
			}
		}
		return numLiving;
	}

	randomizeBoard() {
		// used for (roughly) benchmarking rendering speed
		this.forEach((x:number, y:number) => {
			cells[x][y] = (Math.random() < 0.2)?CellState.Alive:CellState.Empty;
		});
	}

	getNeighbors(x:number, y:number):NeighborList {
		// return object containing CellStates of the given cell's neighbors
		return {
			nw: (x > 0 && y > 0)?cells[x-1][y-1]:undefined,
			n: (y > 0)?cells[x][y-1]:undefined,
			ne: (x < CELLS_X-1 && y > 0)?cells[x+1][y-1]:undefined,
			w: (x > 0)?cells[x-1][y]:undefined,
			e: (x < CELLS_X-1)?cells[x+1][y]:undefined,
			sw: (x > 0 && y < CELLS_Y-1)?cells[x-1][y+1]:undefined,
			s: (y < CELLS_Y-1)?cells[x][y+1]:undefined,
			se: (x < CELLS_X-1 && y < CELLS_Y-1)?cells[x+1][y+1]:undefined
		};
	}

	drawInfoBlock(x:number, y:number, text:string, margin = 4) {
		let textArr = text.split("\n");
		let textWidth = 0;
		let textHeight = 0;
		for(const line of textArr) {
			let lineWidth = font.getTextSize(line).width;
			if(lineWidth > textWidth) textWidth = lineWidth;
			textHeight += font.height;
		}
		Prim.drawSolidRectangle(screen, x, y, textWidth + margin*2, textHeight + margin*2, Color.Gray.fadeTo(0.7));
		Prim.drawRectangle(screen, x, y, textWidth + margin*2, textHeight + margin*2, 2, Color.Black);
		let tY = y + margin;
		for(const line of textArr) {
			font.drawText(screen, x + margin, tY, line);
			tY += font.height;
		}
	}

	updateMouse() {
		if(mouse.isPressed(MouseKey.Left)) {
			let cX = Math.trunc(mouse.x/CELL_SIZE);
			let cY = Math.trunc(mouse.y/CELL_SIZE);
			if(cX > -1 && cY > -1 && cX < CELLS_X && cY < CELLS_Y) cells[cX][cY] = CellState.Alive;
		} else if(mouse.isPressed(MouseKey.Right)) {
			let cX = Math.trunc(mouse.x/CELL_SIZE);
			let cY = Math.trunc(mouse.y/CELL_SIZE);
			if(cX > -1 && cY > -1 && cX < CELLS_X && cY < CELLS_Y) cells[cX][cY] = CellState.Empty;
		}
	}

	numLivingNeighbors(x:number, y:number):number {
		let neighbors = this.getNeighbors(x, y);
		let livingNeighbors = 0;

		if(neighbors.nw === CellState.Alive) livingNeighbors++;
		if(neighbors.n === CellState.Alive) livingNeighbors++;
		if(neighbors.ne === CellState.Alive) livingNeighbors++;
		if(neighbors.w === CellState.Alive) livingNeighbors++;
		if(neighbors.e === CellState.Alive) livingNeighbors++;
		if(neighbors.sw === CellState.Alive) livingNeighbors++;
		if(neighbors.s === CellState.Alive) livingNeighbors++;
		if(neighbors.se === CellState.Alive) livingNeighbors++;
		return livingNeighbors;
	}

	updateBoard() {
		this.forEach((x:number, y:number) => {
			let livingNeighbors = this.numLivingNeighbors(x, y);

			switch(cells[x][y]) {
				case CellState.Alive:
					if(livingNeighbors < 2 || livingNeighbors > 3) cells[x][y] = CellState.Dead;
					break;
				case CellState.Dead:
				case CellState.Empty:
					if(livingNeighbors == 3) cells[x][y] = CellState.Alive;
					break;
			}
		});
		numSteps++;
	}

	drawBoard(offsetX = 0, offsetY = 0, cellW = CELL_SIZE, cellH = CELL_SIZE) {
		for(let i = 0; i < CELLS_X * CELLS_Y; i++) {
			let offset = i * 4;
			let x = (i % CELLS_X) | 0;
			let y = ((i - x) / CELLS_Y) | 0;
			let v = EMPTY_COL;

			switch (cells[x][y]) {
				case CellState.Empty:
					v = EMPTY_COL;
					break;
				case CellState.Alive:
					v = ALIVE_COL;
					break;
				case CellState.Dead:
					v = DEAD_COL;
					break;
				default: // this shouldn't happen
					Sphere.abort(`Invalid cell state at (${x},${y})`);
					cells[x][y] = CellState.Empty;
					break;
			}
			cellPx[offset] = v.r * 255;
			cellPx[offset + 1] = v.g * 255;
			cellPx[offset + 2] = v.b * 255;
		}

		if(cellShape.texture != null)
			cellShape.texture.upload(cellPx);
		cellShape.draw(Surface.Screen, cellTransform);

		if(showGrid)
			gridShape.draw(Surface.Screen);
	}

	on_update() {
		switch(kb.getKey()) {
			case Key.Escape:
				Sphere.shutDown();
				break;
			case Key.Left:
				timing += 4;
				break;
			case Key.Right:
				timing -= 4;
				break;
			case Key.Space:
				running = !running;
				break;
			case Key.C:
				this.clearBoard();
				break;
			case Key.G:
				showGrid = !showGrid;
				break;
			case Key.R:
				this.randomizeBoard();
				break;
			case Key.S:
				running = false;
				this.updateBoard();
				break;
		}
		if(timing < 1) timing = 1;
		this.updateMouse();
		if(running && Sphere.now() % timing == 0) this.updateBoard();
	}

	on_render() {
		this.drawBoard();
		this.drawInfoBlock(0, 0,
			"Living cells: " + this.livingCells() +
			"\nRunning: " + running +
			"\n# steps: " + numSteps
		);
		if(mouse.isPressed(MouseKey.Middle)) {
			let [cX, cY] = this.mouseToCellPos();
			this.drawInfoBlock(mouse.x, mouse.y,
				`Cell: (${cX},${cY})` +
				"\nLiving neighbors: " + this.numLivingNeighbors(cX, cY)
			);
		}
	}
}