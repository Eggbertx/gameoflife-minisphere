import { tsc } from "$/cell/ts-tool";

Object.assign(Sphere.Game, {
	version: 2,
	apiLevel: 1,

	name: "miniSphere Conway's Game of Life",
	author: "Eggbertx",
	summary: "A simple implementation of Conway's Game of Life",
	resolution: '640x640',

	main: '@/scripts/main.js',
});

install('@/',	files('icon.png'));
tsc('@/',		'$/tsconfig.json')
