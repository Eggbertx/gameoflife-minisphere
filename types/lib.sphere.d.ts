/**
 *  Cell, the Sphere packaging compiler
 *  Copyright (c) 2015-2019, Fat Cerberus
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 *  * Neither the name of miniSphere nor the names of its contributors may be
 *    used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
 *  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 *  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 *  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 *  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 *  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 *  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
**/

/** Provides indirect access to global variables as properties of an object. */
declare const global: typeof globalThis;

/** Provides facilities for controlling the Sphere engine. */
declare namespace Sphere
{
	/**
	 * The Sphere v2 API level supported by the engine. When new APIs are
	 * standardized, this value is increased.
	 */
	const APILevel: number;

	/** Name and version number of the build tool used to package the game. */
	const Compiler: string;

	/** Name and version number of the Sphere engine in use. */
	const Engine: string;

	/**
	 * Information about the current game.  All values are taken from the game's JSON manifest
	 * (`game.json`).
	 */
	const Game: {
		author: string;
		main: string;
		name: string;
		resolution: string;
		saveId: string;
		summary: string;
	};

	/** Sphere API version supported by the engine. */
	const Version: number;

	/** The current frame rate. The engine will try to maintain the FPS according to this value. */
	let frameRate: number;

	/** The maximum numer of consecutive frames the engine is allowed to skip. */
	let frameSkip: number;

	/**
	 * `true` if the engine is currently in fullscreen mode, otherwise `false`. You can freely
	 * change this value at any time.
	*/
	let fullScreen: boolean;

	/**
	 * If the main module exports a class, the engine automatically creates an instance of it on
	 * startup. Use this to access that object from anywhere.
	 */
	let main: any;

	/** Abort execution immediately with an error message. This error will not be catchable. */
	function abort(message: any): void;

	/** Get the number of frames elapsed since the engine started. */
	function now(): number;

	/** Restart the engine at the end of the current frame. */
	function restart(): void;

	/** Set the current backbuffer resolution. The contents of the backbuffer may be lost. */
	function setResolution(width: number, height: number): void;

	/** Shut down the engine at the end of the current frame. */
	function shutDown(): void;

	/**
	 * Get a promise that resolves after a given number of frames.  Use with `await`.
	 * @param numFrames The number of frames to wait before resolving the promise.
	 */
	function sleep(numFrames: number): Promise<void>;
}

/**
 * Provides functions that are useful for debugging. All functions in this namespace are no-ops
 * (i.e. they do nothing) when running in production, avoiding the need to remove them.
 */
declare namespace SSj
{
	/**
	 * If the expression or function passed for `check` evaluates to `false`, throws an error.
	 * @param check Either an expression that evaluates to `boolean`, or a function that returns the
	 *              same.
	 * @param description An optional human-readable description of the condition being checked.
	 */
	function assert(check: boolean | (() => boolean), description?: string): void;

	function flipScreen(): void;
	function log(message: string | object | Error | any): void;
	function trace(message: string): void;

	/**
	 * Get the amount of time that's passed since some arbitrary time, in seconds. Exact precision
	 * is not specified but will typically be sub-1µs.
	 */
	function now(): number;

	function profile(object: object, methodName: string, description?: string): void;
}

/**
 * Describes a file or subdirectory as yielded by a `DirectoryStream`.
 */
interface DirectoryEntry
{
	/** `true` if the entry names a subdirectory, otherwise `false`. */
	isDirectory: boolean;

	/** Path of the file or subdirectory, relative to the directory being enumerated. */
	fileName: string;

	/** Full SphereFS path to the file or subdirectory. */
	fullPath: string;
}

/**
 * Specifies options for creating a new `DirectoryStream`.
 */
interface DirectoryStreamOptions
{
	/**
	 * `true` to enable recursive enumeration. In this mode, the directory stream will list files
	 * from all subdirectories, at any depth. Only file entries will be yielded in this case.
	 * @default false
	 */
	recursive?: boolean;
}

/**
 * Specifies scheduling options for a recurring Dispatch job.
 */
interface JobOptions
{
	/**
	 * `true` if the job should be treated as a background process. If the only jobs in the event
	 * loop are background jobs at the end of a frame, the engine will shut down as if it were
	 * empty.
	 * @default false
	 */
	inBackground?: boolean;

	/**
	 * Job priority. Priority can be positive, negative, or even fractional. Higher priority jobs
	 * are updated earlier and rendered later, allowing the game to control the order in which
	 * things are scheduled within a frame.
	 * @default 0.0
	 */
	priority?: number;
}

declare interface MouseEvent
{
	key: MouseKey | null;
	x?: number;
	y?: number;
	delta?: number;
}

/**
 * Specifies options for creating a new `Shader`.
 */
declare interface ShaderOptions
{
	/** SphereFS path to a GLSL vertex shader file. */
	vertexFile: string;

	/** SphereFS path to a GLSL fragment shader file. */
	fragmentFile: string;
}

declare interface Size2D
{
	width: number;
	height: number;
}

/** Specifies options for playing back an audio sample. */
declare interface SoundOptions
{
	/**
	 * L/R stereo balance. 0.0 is centered, +/- 1.0 is full right/left respectively.
	 * @default 0.0
	 */
	pan?: number;

	/**
	 * Playback speed. 1.0 is normal speed.
	 * @default 1.0
	 */
	speed?: number;

	/**
	 * Volume, as a percentage of the mixer's master volume. Sometimes called "gain".
	 * @default 1.0
	 */
	volume?: number;
}

/**
 * Describes a vertex of a `Shape`.
 */
declare interface Vertex
{
	x: number;
	y: number;
	z?: number;
	u?: number;
	v?: number;
	color?: Color;
}

/** Specifies the mode to use when opening a file. */
declare enum FileOp
{
	/** File will be opened for reading only. */
	Read,

	/**
	 * Enables reading and writing. If the file already exists, the existing contents will be erased
	 * first. Otherwise a new file will be created.
	 */
	Write,

	/**
	 * Enables reading and writing. If the file already exists, the file pointer will be placed at
	 * the end of the file for convenience. Otherwise a new file will be created.
	 */
	Update,
}

/**
 * Identifies a specific key on the keyboard.
 */
declare enum Key
{
	Alt,
	AltGr,
	Apostrophe,
	Backslash,
	Backspace,
	CapsLock,
	CloseBrace,
	Comma,
	Delete,
	Down,
	End,
	Enter,
	Equals,
	Escape,
	F1,
	F2,
	F3,
	F4,
	F5,
	F6,
	F7,
	F8,
	F9,
	F10,
	F11,
	F12,
	Home,
	Hyphen,
	Insert,
	LCtrl,
	LShift,
	Left,
	NumLock,
	OpenBrace,
	PageDown,
	PageUp,
	Period,
	RCtrl,
	RShift,
	Right,
	ScrollLock,
	Semicolon,
	Slash,
	Space,
	Tab,
	Tilde,
	Up,
	A,
	B,
	C,
	D,
	E,
	F,
	G,
	H,
	I,
	J,
	K,
	L,
	M,
	N,
	O,
	P,
	Q,
	R,
	S,
	T,
	U,
	V,
	W,
	X,
	Y,
	Z,
	D1,
	D2,
	D3,
	D4,
	D5,
	D6,
	D7,
	D8,
	D9,
	D0,
	NumPad1,
	NumPad2,
	NumPad3,
	NumPad4,
	NumPad5,
	NumPad6,
	NumPad7,
	NumPad8,
	NumPad9,
	NumPad0,
	NumPadEnter,
	Add,
	Decimal,
	Divide,
	Multiply,
	Subtract,
}

/**
 * Identifies the type of input received from a mouse.
 */
declare enum MouseKey
{
	/** The left mouse button. */
	Left,

	/** The middle mouse button or the wheel button. */
	Middle,

	/** The right mouse button. */
	Right,

	/** Synthetic. Produced when the wheel is spun to scroll up. */
	WheelUp,

	/** Synthetic. Produced when the wheel is spun to scroll down. */
	WheelDown,

	/** The Back button. */
	Back,

	/** The Forward button. */
	Forward,
}

/**
 * Specifies how to interpret the vertices of a `Shape`.
 */
declare enum ShapeType
{
	/**
	 * Triangle fan: First 3 vertices form a triangle, then each additional vertex forms
	 * another triangle fanning out from the initial vertex (the center of the fan).
	 */
	Fan,

	/** Line list: Every 2 vertices form a line segment. */
	Lines,

	/**
	 * Line loop: First 2 vertices form a line segment; each additional vertex forms another
	 * segment connected to the last; an implied final segment connects the last one to the
	 * first, forming a loop.
	 */
	LineLoop,

	/**
	 * Line strip: First 2 vertices form a line segment; each additional vertex forms another
	 * segment connected to the last.
	 */
	LineStrip,

	/** Point list: Each vertex specifies a single point in space. */
	Points,

	/** Triangle list: Every 3 vertices form a triangle. */
	Triangles,

	/**
	 * Triangle strip: First 3 vertices form a triangle; each additional vertex forms another
	 * triangle connected to the previous one on two sides.
	 */
	TriStrip,
}

declare class BlendOp
{
	static readonly Default: BlendOp;
	static readonly Add: BlendOp;
	static readonly Average: BlendOp;
	static readonly Multiply: BlendOp;
	static readonly Replace: BlendOp;
	static readonly Subtract: BlendOp;
}

/**
 * Represents an RGBA color value for use in rendering operations.
 */
declare class Color
{
	static readonly AliceBlue: Color;
	static readonly AntiqueWhite: Color;
	static readonly Aqua: Color;
	static readonly Aquamarine: Color;
	static readonly Azure: Color;
	static readonly Beige: Color;
	static readonly Bisque: Color;
	static readonly Black: Color;
	static readonly BlanchedAlmond: Color;
	static readonly Blue: Color;
	static readonly BlueViolet: Color;
	static readonly Brown: Color;
	static readonly BurlyWood: Color;
	static readonly CadetBlue: Color;

	/** Chartreuse. The best color with the best name. */
	static readonly Chartreuse: Color;

	static readonly Chocolate: Color;
	static readonly Coral: Color;
	static readonly CornflowerBlue: Color;
	static readonly Cornsilk: Color;
	static readonly Crimson: Color;
	static readonly Cyan: Color;
	static readonly DarkBlue: Color;
	static readonly DarkCyan: Color;
	static readonly DarkGoldenrod: Color;
	static readonly DarkGray: Color;
	static readonly DarkGreen: Color;
	static readonly DarkKhaki: Color;
	static readonly DarkMagenta: Color;
	static readonly DarkOliveGreen: Color;
	static readonly DarkOrange: Color;
	static readonly DarkOrchid: Color;
	static readonly DarkRed: Color;
	static readonly DarkSalmon: Color;
	static readonly DarkSeaGreen: Color;
	static readonly DarkSlateBlue: Color;
	static readonly DarkSlateGray: Color;
	static readonly DarkTurquoise: Color;
	static readonly DarkViolet: Color;
	static readonly DeepPink: Color;
	static readonly DeepSkyBlue: Color;
	static readonly DimGray: Color;
	static readonly DodgerBlue: Color;
	static readonly FireBrick: Color;
	static readonly FloralWhite: Color;
	static readonly ForestGreen: Color;
	static readonly Fuchsia: Color;
	static readonly Gainsboro: Color;
	static readonly GhostWhite: Color;
	static readonly Gold: Color;
	static readonly Goldenrod: Color;
	static readonly Gray: Color;
	static readonly Green: Color;
	static readonly GreenYellow: Color;
	static readonly Honeydew: Color;
	static readonly HotPink: Color;
	static readonly IndianRed: Color;
	static readonly Indigo: Color;
	static readonly Ivory: Color;
	static readonly Khaki: Color;
	static readonly Lavender: Color;
	static readonly LavenderBlush: Color;
	static readonly LawnGreen: Color;
	static readonly LemonChiffon: Color;
	static readonly LightBlue: Color;
	static readonly LightCoral: Color;
	static readonly LightCyan: Color;
	static readonly LightGoldenrodYellow: Color;
	static readonly LightGray: Color;
	static readonly LightGreen: Color;
	static readonly LightPink: Color;
	static readonly LightSalmon: Color;
	static readonly LightSeaGreen: Color;
	static readonly LightSkyBlue: Color;
	static readonly LightSlateGray: Color;
	static readonly LightSteelBlue: Color;
	static readonly LightYellow: Color;
	static readonly Lime: Color;
	static readonly LimeGreen: Color;
	static readonly Linen: Color;
	static readonly Magenta: Color;
	static readonly Maroon: Color;
	static readonly MediumAquamarine: Color;
	static readonly MediumBlue: Color;
	static readonly MediumOrchid: Color;
	static readonly MediumPurple: Color;
	static readonly MediumSeaGreen: Color;
	static readonly MediumSlateBlue: Color;
	static readonly MediumSpringGreen: Color;
	static readonly MediumTurquoise: Color;
	static readonly MediumVioletRed: Color;
	static readonly MidnightBlue: Color;
	static readonly MintCream: Color;
	static readonly MistyRose: Color;
	static readonly Moccasin: Color;
	static readonly NavajoWhite: Color;
	static readonly Navy: Color;
	static readonly OldLace: Color;
	static readonly Olive: Color;
	static readonly OliveDrab: Color;
	static readonly Orange: Color;
	static readonly OrangeRed: Color;
	static readonly Orchid: Color;
	static readonly PaleGoldenrod: Color;
	static readonly PaleGreen: Color;
	static readonly PaleTurquoise: Color;
	static readonly PaleVioletRed: Color;
	static readonly PapayaWhip: Color;
	static readonly PeachPuff: Color;
	static readonly Peru: Color;

	/** Pink. The color of eaty pigs. **\*MUNCH\*** */
	static readonly Pink: Color;

	static readonly Plum: Color;
	static readonly PowderBlue: Color;
	static readonly Purple: Color;
	static readonly Red: Color;
	static readonly RosyBrown: Color;
	static readonly RoyalBlue: Color;
	static readonly SaddleBrown: Color;
	static readonly Salmon: Color;
	static readonly SandyBrown: Color;
	static readonly SeaGreen: Color;
	static readonly Seashell: Color;
	static readonly Sienna: Color;
	static readonly Silver: Color;
	static readonly SkyBlue: Color;
	static readonly SlateBlue: Color;
	static readonly SlateGray: Color;
	static readonly Snow: Color;
	static readonly SpringGreen: Color;
	static readonly SteelBlue: Color;
	static readonly Tan: Color;
	static readonly Teal: Color;
	static readonly Thistle: Color;
	static readonly Tomato: Color;
	static readonly Transparent: Color;
	static readonly Turquoise: Color;
	static readonly Violet: Color;
	static readonly Wheat: Color;
	static readonly White: Color;
	static readonly WhiteSmoke: Color;
	static readonly Yellow: Color;
	static readonly YellowGreen: Color;
	static readonly PurwaBlue: Color;
	static readonly RebeccaPurple: Color;

	/** Stanky Bean. The first color created and named by an AI. */
	static readonly StankyBean: Color;

	/** Check if two `Color` objects are equivalent without regard to their alpha values. */
	static is(color1: Color, color2: Color): boolean;

	/** Get a new `Color` which is a 50/50 blend of the two given ones. */
	static mix(color1: Color, color2: Color): Color;

	/**
	 * Get a new `Color` which is a weighted average of the two given ones, using the given
	 * weighting factors.
	 */
	static mix(color1: Color, color2: Color, w1: number, w2: number): Color;

	/**
	 * Gets a `Color` corresponding to the specified color name which can be either HTML notation
	 * (e.g. `#7FFF00`) or an X11 color name such as `chartreuse` (case insensitive). */
	static of(name: string): Color;

	/**
	 * Construct a new `Color` object from the given RGBA values. All values must be in the range
	 * [0.0,1.0].
	 * @param red    The amount of red in the color.
	 * @param green  The amount of green in the color.
	 * @param blue   The amount of blue in the color.
	 * @param alpha  Alpha (opacity).  Defaults to `1.0`.
	 */
	constructor(red: number, green: number, blue: number, alpha?: number);

	/** The X11 name of the color for known colors, or else its HTML representation, e.g. `#FF8080FF`. */
	name: string;

	/** The value of the color's red component. */
	r: number;

	/** The value of the color's green component. */
	g: number;

	/** The value of the color's blue component. */
	b: number;

	/**
	 * The value of the color's alpha component, representing its opacity. Use values less than 1.0
	 * for translucency.
	 */
	a: number;

	/** Gets a new `Color` object with the same values as this one. */
	clone(): Color;

	/**
	 * Gets a new `Color` with the same RGB as this one but with its alpha multiplied by the given
	 * factor. Useful for implementing transitions.
	 */
	fadeTo(alphaFactor: number): Color;
}

/**
 * Allows the contents of a directory (files and subdirectories) to be enumerated.
 */
declare class DirectoryStream implements Iterable<DirectoryEntry>
{
	/**
	 * Constructs a new `DirectoryStream` to enumerate the given directory.
	 * @param directoryName SphereFS path to the directory whose contents will be enumerated.
	 * @param options       Options for creating the new directory stream.
	 */
	constructor(directoryName: string, options?: DirectoryStreamOptions);

	/** Total number of file and subdirectory entries in the directory. */
	readonly fileCount: number;

	/** SphereFS path to the directory being enumerated. */
	readonly fileName: string;

	/** The current position within the stream of directory entries. Starts at 0. */
	position: number;

	[Symbol.iterator](): Iterator<DirectoryEntry>;

	/** Clean up any resources held by this `DirectoryStream` after using it. */
	dispose(): void;

	/** Get the next file or directory entry. */
	next(): IteratorResult<DirectoryEntry>;

	/** Rewind this stream so the directory contents can be enumerated again. */
	rewind(): void;
}

/**
 * The Dispatch API provides the means by which the game can manage the event loop.
 */
declare namespace Dispatch
{
	/**
	 * Cancel all currently scheduled one-time jobs, excluding those scheduled with `onExit`.
	 * Recurring jobs are not affected.
	 */
	function cancelAll(): void;

	/**
	 * Schedule a one-time job to be run during a future frame.
	 * @param numFrames How many frames to wait before firing.
	 * @param callback  A function to be called when the Dispatch job fires.
	 */
	function later(numFrames: number, callback: () => void): JobToken;

	/**
	 * Schedule a one-time job to run during the current frame.
	 * @param callback A function to be called when the Dispatch job fires.
	 */
	function now(callback: () => void): JobToken;

	/**
	 * Schedule a one-time job to run when the engine shuts down.
	 * @param callback A function to be called when the Dispatch job fires.
	 */
	function onExit(callback: () => void): JobToken;

	/**
	 * Schedule a recurring job to run during the Render phase of each frame, before the backbuffer
	 * is flipped to the screen.
	 * @param callback A non-`async` function to be called when the job fires.
	 * @param options  Scheduling options for this job.
	 */
	function onRender(callback: () => void, options?: JobOptions): JobToken;

	/**
	 * Schedule a recurring job to run during the Update phase of each frame. Use an `async`
	 * callback to spread an update over multiple frames.
	 * @param callback A function to be called when the job fires.
	 * @param options  Scheduling options for this job.
	 */
	function onUpdate(callback: () => void, options?: JobOptions): JobToken;
}

declare namespace FS
{
	/**
	 * Create a directory if it doesn't already exist. If it already exists, nothing happens.
	 * @param path SphereFS path of the directory to create.
	 */
	function createDirectory(path: string): void;

	/**
	 * Delete a file from the file system. The SphereFS prefix must be writable.
	 * @param path SphereFS path of the file to delete.
	 */
	function deleteFile(path: string): void;

	/**
	 * Get a Boolean value indicating whether a directory exists.
	 * @param path SphereFS path of the directory to check for existence.
	 */
	function directoryExists(path: string): boolean;

	/**
	 * Get the directory component of a path, stripping the filename if present.
	 * @param path SphereFS or relative path of a file or directory. It doesn't need to exist.
	 */
	function directoryOf(path: string): string;

	/**
	 * Evaluate a JavaScript script file (`.js`) as traditional code (not as a module).
	 * @param path SphereFS path of the script file to execute.
	 */
	function evaluateScript(path: string): void;

	/**
	 * Get the filename extension (everything after the last `.`) from a file path.
	 * @param path SphereFS or relative path of a file. The file need not exist.
	 * @returns The extension starting with the last `.`, or `null` if the path has no extension.
	 * @throws {TypeError} `path` must not name a known directory or end in a slash.
	 */
	function extensionOf(path: string): string | null;

	/**
	 * Get a Boolean value indicating whether a file exists.
	 * @param path SphereFS path of the file to check for existence.
	 */
	function fileExists(path: string): boolean;

	/**
	 * Get the filename component from a file path, stripping any directory information if present.
	 * @param path SphereFS or relative path of a file. The file need not exist.
	 * @returns The filename component of the path, or `undefined` if the path names a known
	 *          directory and/or ends in a slash.
	 */
	function fileNameOf(path: string): string | undefined;

	/**
	 * Get the full, canonical SphereFS path of a given path or filename.
	 * @param filename      The filename or path to be interpreted.
	 * @param baseDirectory SphereFS path of the base directory (used to resolve relative paths).
	 */
	function fullPath(filename: string, baseDirectory?: string): string;

	function readFile(path: string): string;

	/**
	 * Get an abbreviated version of a full SphereFS path by finding its path relative to a given
	 * base directory.
	 * @param path          A full SphereFS path to be abbreviated.
	 * @param baseDirectory SphereFS path of the base directory for the relative path.
	 */
	function relativePath(path: string, baseDirectory: string): string;

	/**
	 * Remove an empty directory from the file system. The SphereFS prefix must be writable.
	 * @param directoryPath SphereFS path of the directory to remove.
	 */
	function removeDirectory(directoryPath: string): void;

	/**
	 * Rename a file or directory or move it to a new location. The source and target prefixes must
	 * be writable.
	 * @param path    SphereFS path of the file to rename or move.
	 * @param newPath The new SphereFS path of the file.
	 */
	function rename(path: string, newPath: string): void;

	function writeFile(path: string, content: string | string[] | ArrayBuffer | ArrayBufferView): void;
}

/**
 * Provides stream-like access to the raw byte content of a file.
 */
declare class FileStream
{
	static open(fileName: string, fileOp: FileOp): Promise<FileStream>;

	constructor(fileName: string, fileOp: FileOp)

	/** Full, canonical SphereFS path of the open file. */
	readonly fileName: string;

	/** Current physical size of the open file, in bytes. */
	readonly fileSize: number;

	/** Position of the next byte in the file to be read or written, starting at 0. */
	position: number;

	asyncRead(numBytes: number): Promise<ArrayBuffer>;
	asyncWrite(data: ArrayBuffer | ArrayBufferView): Promise<void>;

	/** Clean up any resources held by this `FileStream` after using it. */
	dispose(): void;

	read(size: number): ArrayBuffer;
	write(data: ArrayBuffer | ArrayBufferView): void;
}

/**
 * Represents a font in the RFN font format. This is a raster font format, so all text metrics are
 * in pixels.
 */
declare class Font
{
	/** The default font provided by the engine. */
	static readonly Default: Font;

	/**
	 * Load a font in the background and construct a new `Font` for it once it's ready.
	 * @async
	 * @param fileName SphereFS path of an RFN format font file.
	 * @returns A promise for a newly constructed `Font` object.
	 */
	static fromFile(fileName: string): Promise<Font>;

	/** SphereFS path of the file from which this `Font` was constructed. */
	readonly fileName: string;

	/** Height of a line of text as rendered using this font, in pixels. */
	readonly height: number;

	/**
	 * Construct a new `Font` from a given font file. The font is usable immediately, but text will
	 * not be rendered until it loads completely.
	 * @param fileName SphereFS path of an RFN format font file.
	 */
	constructor(fileName: string);

	/**
	 * Render text to a surface using this font.
	 * @param surface   The surface on which to render.
	 * @param x         X coordinate where the text will be drawn.
	 * @param y         Y coordinate where the text will be drawn.
	 * @param text      Text string to render.
	 * @param color     Color of the text.
	 * @param wrapWidth If the text is wider than `wrapWidth` in pixels, it will be wrapped to
	 *                  multiple lines automatically.
	 */
	drawText(surface: Surface, x: number, y: number, text: string, color?: Color, wrapWidth?: number): void;

	/**
	 * Get the width and height of a text as drawn with this font when using word wrapping.
	 * @param text      The text to be measured.
	 * @param wrapWidth Maximum width at which to wrap the text, in pixels.
	 * @returns A `Size2D` object with the measured width and height of the text.
	 */
	getTextSize(text: string, wrapWidth?: number): Size2D;

	/**
	 * Get the height of a text as drawn with this font using a given `wrapWidth`.
	 * @param text      The text to be measured.
	 * @param wrapWidth The maximum width at which to wrap the text, in pixels.
	 */
	heightOf(text: string, wrapWidth?: number): number;

	/**
	 * Get the width of a single line of text as drawn with this font.
	 * @param text The text to be measured.
	 * @returns The width of the text when rendered, in pixels.
	 */
	widthOf(text: string): number;

	/**
	 * Split a text into multiple lines by applying word wrapping and newlines.
	 * @param text      The text string to process.
	 * @param wrapWidth The maximum width at which to wrap the text, in pixels.
	 * @returns An array of strings, with each string being a new line of text.
	 */
	wordWrap(text: string, wrapWidth: number): string[];
}

declare class IndexList
{
	constructor(indices: number[]);
}

/**
 * Provides proof of a scheduled Dispatch job and allows its scheduling to be manipulated.
 */
declare interface JobToken
{
	/**
	 * Cancels the job. For one-time jobs, if the job has already fired, calling this has no
	 * effect.
	 */
	cancel(): void;

	/** Pauses the job, preventing it from firing until `resume` is called. */
	pause(): void;

	/** Resumes a job whose scheduling was paused with `pause`. */
	resume(): void;
}

declare class Joystick
{
	static readonly Null: Joystick;
	static readonly P1: Joystick;
	static readonly P2: Joystick;
	static readonly P3: Joystick;
	static readonly P4: Joystick;

	static getDevices(): Joystick[];

	readonly name: string;
	readonly numAxes: number;
	readonly numButtons: number;

	getPosition(axisID: number): number;
	isPressed(buttonID: number): boolean;
}

declare class Keyboard
{
	static readonly Default: Keyboard;

	readonly capsLock: boolean;
	readonly numLock: boolean;
	readonly scrollLock: boolean;

	charOf(key: Key, shifted?: boolean): string;
	clearQueue(): void;
	getKey(): Key | null;
	isPressed(key: Key): boolean;
}

/**
 * Mixes audio from different sources and allows them all to be controlled as a unit.
 */
declare class Mixer
{
	/** The default CD-quality mixer provided by the engine. */
	static readonly Default: Mixer;

	/** The output volume of the mixer. 0.0 is silent, 1.0 is full volume. */
	volume: number;

	/**
	 * Construct a new mixer with the given parameters.
	 * @param sampleRate    The sample rate of the audio produced by the mixer, in Hz.
	 * @param bitsPerSample Number of bits per sample.
	 * @param numChannels   Number of independent sound channels in the mixer output.
	 */
	constructor(sampleRate: number, bitsPerSample: 8 | 16 | 24 | 32, numChannels?: number);
}

declare class Model
{
	constructor(shapes: Shape[], shader?: Shader);

	shader: Shader;
	transform: Transform;

	draw(surface?: Surface): void
}

declare class Mouse
{
	static readonly Default: Mouse;

	readonly position: [ number, number ];
	readonly x: number;
	readonly y: number;

	clearQueue(): void;
	getEvent(): MouseEvent;
	isPressed(key: MouseKey): boolean;
}

declare class RNG implements Iterable<number>
{
	static fromSeed(seed: number): RNG;
	static fromState(state: string): RNG;

	[Symbol.iterator](): Iterator<number>;
	constructor();

	state: string;

	next(): IteratorResult<number>;
}

/**
 * Represents an audio clip optimized for regular, repeated playback.
 */
declare class Sample
{
	/**
	 * Load an audio file in the background and construct a new sample from its contents.
	 * @async
	 * @param fileName SphereFS path of an audio file.
	 * @returns A promise for the newly constructed `Sample`.
	 */
	static fromFile(fileName: string): Promise<Sample>;

	/**
	 * Construct a new sample from the contents of an audio file. The sample can be used
	 * immediately; playback will be silent until the file is fully loaded.
	 * @param fileName SphereFS path of an audio file.
	 */
	constructor(fileName: string);

	/** Full, canonical SphereFS path of the audio file used for this sample. */
	readonly fileName: string;

	/**
	 * Play a new instance of this sample on a given mixer.
	 * @param mixer   The mixer used to play back the sample.
	 * @param options Playback options.
	 */
	play(mixer: Mixer, options?: SoundOptions): void;

	/** Stop playback of all currently playing instances of this sample. */
	stopAll(): void;
}

declare class Server
{
	constructor(port: number, backlogSize?: number);

	noDelay: boolean;
	numPending: number;

	accept(): void;
	acceptNext(): Promise<Socket>;
	close(): void;
}

/**
 * Represents a shader program used to control low-level graphics rendering.
 */
declare class Shader
{
	/** The default shader program provided by the engine. */
	static readonly Default: Shader;

	/**
	 * Load the given shader files in the background and construct a new shader program from them.
	 * @async
	 * @param options Options for creating the new shader program.
	 * @returns A promise for the new `Shader` object.
	 */
	static fromFiles(options: ShaderOptions): Promise<Shader>;

	/**
	 * Construct a new shader program. The shader can be used immediately, but will not have an
	 * effect on rendering until it's fully loaded.
	 * @param options Options for creating the new shader program.
	 */
	constructor(options: ShaderOptions);

	/**
	 * Get a new `Shader` using the same program as this one but with an independent set of uniform
	 * variables.
	 */
	clone(): Shader;

	/**
	 * Set the value of a `bool` uniform.
	 * @param name  Name of the uniform variable in the GLSL source text.
	 * @param value Value to set: either `true` or `false`.
	 */
	setBoolean(name: string, value: boolean): void;

	/**
	 * Set the values of a `vec4` uniform from the components of a `Color` (RGBA).
	 * @param name  Name of a `uniform` variable in the GLSL source text.
	 * @param color A `Color` object whose RGBA values will be used.
	 */
	setColorVector(name: string, color: Color): void;

	/**
	 * Set the value of a `float` (floating point) uniform.
	 * @param name  Name of a `uniform` variable in the GLSL source text.
	 * @param value Value to set.
	 */
	setFloat(name: string, value: number) : void;

	setFloatVector(name: string, values: [number, number] | [number, number, number] | [number, number, number, number]): void;

	/**
	 * Set the value of an `int` (integer) uniform.
	 * @param name  Name of a `uniform` variable in the GLSL source text.
	 * @param value Value to set. Anything after the decimal point will be ignored.
	 */
	setInt(name: string, value: number): void;

	setIntVector(name: string, values: [number, number] | [number, number, number] | [number, number, number, number]): void;

	/**
	 * Set the values of a `mat4` (4x4 matrix) uniform from the matrix cells of a `Transform`.
	 * @param name      Name of the `uniform` in the GLSL source text.
	 * @param transform A `Transform` object whose 4x4 matrix cells will be used.
	 */
	setMatrix(name: string, transform: Transform): void;
}

/**
 * Represents a graphics primitive whose parameters are stored on the GPU.
 */
declare class Shape
{
	/**
	 * Render a shape of the given type to the backbuffer.
	 * @param type     Type of primitive to draw.
	 * @param vertices Array of `Vertex` objects describing the shape's vertices.
	 */
	static drawImmediate(type: ShapeType, vertices: Vertex[]): void;

	/**
	 * Render a textured shape of the given type to the backbuffer.
	 * @param type     Type of primitive to draw.
	 * @param texture  Texture to use for the shape, or `null` for no texture.
	 * @param vertices Array of `Vertex` objects describing the shape's vertices.
	 */
	static drawImmediate(type: ShapeType, texture: Texture | null, vertices: Vertex[]): void;

	/**
	 * Render a shape of the given type to a surface.
	 * @param surface  Surface on which to render the shape.
	 * @param type     Type of primitive to draw.
	 * @param vertices Array of `Vertex` objects describing the shape's vertices.
	 */
	static drawImmediate(surface: Surface, type: ShapeType, vertices: Vertex[]): void;

	/**
	 * Render a textured shape of the given type to a surface.
	 * @param surface  Surface on which to render the shape.
	 * @param type     Type of primitive to draw.
	 * @param texture  Texture to use for the shape, or `null` for no texture.
	 * @param vertices Array of `Vertex` objects describing the shape's vertices.
	 */
	static drawImmediate(surface: Surface, type: ShapeType, texture: Texture | null, vertices: Vertex[]): void;

	/**
	 * Construct a new `Shape` with the given texture and vertices.
	 * @param type     Type of primitive the new `Shape` will represent.
	 * @param texture  Texture to use for this shape, or `null` for no texture.
	 * @param vertices A vertex list containing vertices for this shape.
	 * @param indices  Optional index list specifying which members of `vertices` are used in the
	 *                 shape. Omit this to use the entire vertex list.
	 */
	constructor(type: number, texture: Texture | null, vertices: VertexList, indices?: IndexList);

	/**
	 * Index list specifying which elements of `vertexList` are used in the shape.  Set this to
	 * `null` to use all elements of the vertex list in order.
	 */
	indexList: IndexList | null;

	/**
	 * Texture image used to texture the shape when rendered. How the texture is applied is
	 * typically determined by the `u` and `v` components of each vertex, but may depend on the
	 * shader in use. Use `null` for no texture.
	 */
	texture: Texture | null;

	/** Vertex list containing the vertices used in this shape. */
	vertexList: VertexList;

	/**
	 * Draw this shape to the backbuffer using an optional transform.
	 * @param transform Transform to be applied before the projection transform.
	 */
	draw(transform?: Transform): void;

	/**
	 * Draw this shape to a given surface using an optional transform.
	 * @param surface   Surface the shape will be rendered to.
	 * @param transform Transform to be applied before the projection transform.
	 */
	draw(surface: Surface, transform?: Transform): void;
}

declare class Socket
{
	static connectTo(hostName: string, port: number): Promise<Socket>;

	constructor();
	constructor(hostName: string, port: number);

	readonly bytesAvailable: number;
	readonly bytesPending: number;
	readonly bytesReceived: number;
	readonly bytesSent: number;
	readonly connected: boolean;
	noDelay: boolean;
	readonly remoteAddress: string;
	readonly remotePort: number;

	asyncRead(numBytes: number): Promise<ArrayBuffer>;
	asyncWrite(data: ArrayBuffer | ArrayBufferView): Promise<void>;
	close(): Promise<void>;
	connectTo(hostName: string, port: number): Promise<void>;
	disconnect(): void;
	peek(numBytes: number): ArrayBuffer;
	read(numBytes: number): ArrayBuffer;
	write(data: ArrayBuffer | ArrayBufferView): void;
}

/**
 * Represents an audio clip optimized for streaming playback.
 */
declare class Sound
{
	/**
	 * Open an audio file in the background and construct a `Sound` that can be used to play it.
	 * @async
	 * @param fileName SphereFS path of an audio file.
	 * @returns A promise for the newly constructed `Sound`.
	 */
	static fromFile(fileName: string): Promise<Sound>;

	/**
	 * Construct a `Sound` that can be used to play back the given audio file. The sound can be used
	 * immediately, but playback may be silent until enough audio data has been buffered.
	 * @param fileName SphereFS path of an audio file.
	 */
	constructor(fileName: string);

	readonly fileName: string;

	/** Duration of this sound, in seconds. */
	readonly length: number;

	pan: number;

	/** `true` if the sound is currently playing; `false` otherwise. */
	readonly playing: boolean;

	position: number;
	repeat: boolean;
	speed: number;
	volume: number;

	/**
	 * Pause playback of this sound. It can be resumed later by calling `play()` without a mixer.
	 */
	pause(): void;

	/**
	 * Play the sound on a given mixer. If the sound is paused and a mixer is not specified, resume
	 * playback from the paused position.
	 * @param mixer The mixer used to play back the sound.
	 */
	play(mixer?: Mixer): void;

	/** Stop playback of this sound. */
	stop(): void;
}

/**
 * Provides a stream-like interface for playing raw audio data.
 */
declare class SoundStream
{
	/**
	 * Construct a new audio stream with the given parameters.
	 * @param sampleRate The sample rate of the audio data, in Hz.
	 * @param bitsPerSample The number of bits per sample.
	 * @param numChannels Number of independent audio channels in the audio data.
	 */
	constructor(sampleRate?: number, bitsPerSample?: 8 | 16 | 32, numChannels?: number);

	/* Amount of audio currently buffered (and not yet played), in seconds. */
	readonly length: number;

	/** Pause playback of this audio stream. */
	pause(): void;

	/**
	 * Play this audio stream on a given mixer. If the stream is paused and a mixer is not
	 * specified, resume playback from the paused position.
	 */
	play(mixer?: Mixer): void;

	/** Stop playback and discard any unplayed data in the stream buffer. */
	stop(): void;

	/**
	 * Write new audio data to the end of the stream buffer. Can (and should!) be called during
	 * active playback.
	 * @param data Buffer containing audio data to feed into the stream.
	 */
	write(data: ArrayBuffer | ArrayBufferView): void;
}

declare class Surface extends Texture
{
	/**
	 * A surface representing the backbuffer. The contents of `Surface.Screen` are presented to the
	 * screen at the end of every frame's Render phase.
	 */
	static readonly Screen: Surface;

	/**
	 * Create a new surface initialized from the contents of an image file. The image is loaded in
	 * the background; the promise resolves once the surface is ready for use.
	 * @returns A promise for the new surface.
	 */
	static fromFile(fileName: string): Promise<Surface>;

	/** Blending operation to use when rendering to this surface. */
	blendOp: BlendOp;

	/** Height of the surface, in pixels. */
	readonly height: number;

	/** Transform to use when rendering to this surface. Must include a projection. */
	transform: Transform;

	/** Width of the surface, in pixels. */
	readonly width: number;

	/**
	 * Construct a new surface from the contents of an image file. Not supported in Oozaru; prefer
	 * `Surface.fromFile` in new code.
	 * @deprecated
	 * @param fileName SphereFS path to an image file.
	 */
	constructor(fileName: string);

	/**
	 * Construct a new surface of a given size and initial contents.
	 * @param width   The width of the new texture, in pixels.
	 * @param height  The height of the new texture, in pixels.
	 * @param content Either a `Color` to fill the texture with or a buffer of RGBA pixels.
	 */
	constructor(width: number, height: number, content?: Color | ArrayBuffer);

	clipTo(x: number, y: number, width: number, height: number): void;
	toTexture(): Texture;
}

/**
 * Represents an image used for texturing `Shape` primitives.
 */
declare class Texture
{
	/**
	 * Create a texture from an image file in the background. The promise resolves with a new
	 * `Texture` once it's ready to use.
	 * @param fileName SphereFS path of the image file to load.
	 */
	static fromFile(fileName: string): Promise<Texture>;

	/**
	 * The SphereFS path of the image file used to create the texture, or `null` for non-file-based
	 * textures.
	 */
	readonly fileName: string | null;

	/** Height of the texture image, in pixels. */
	readonly height: number;

	/** Width of the texture image, in pixels. */
	readonly width: number;

	/**
	 * Construct a new texture from an image file.
	 * @param fileName SphereFS path of the image file to load.
	 */
	constructor(fileName: string);

	/**
	 * Construct a new texture from the contents of a `Surface`.
	 * @param surface A surface whose contents will be used for the new texture.
	 */
	constructor(surface: Surface);

	/**
	 * Construct a new texture of a given size and initial contents.
	 * @param width   The width of the new texture, in pixels.
	 * @param height  The height of the new texture, in pixels.
	 * @param content Either a `Color` to fill the texture with or a buffer of RGBA pixels.
	 */
	constructor(width: number, height: number, content?: Color | ArrayBuffer | ArrayBufferView);

	/**
	 * Get the raw RGBA pixel data from this texture. May be slow!
	 */
	download(): Uint8ClampedArray;

	/**
	 * Upload new RGBA pixel data to this texture.
	 * @param data A buffer with the new RGBA pixel values.
	 */
	upload(data: ArrayBuffer | ArrayBufferView): void;
}

/**
 * Represents a transformation matrix for rendering operations.
 */
declare class Transform
{
	/** Constructs a new transform initialized to the identity matrix. */
	constructor();

	/** Provides direct access to the 4x4 matrix cells of this transform. */
	readonly matrix: number[][];

	/**
	 * Composes another transform with this one. The result is the same as if the two were applied
	 * consecutively.
	 * @param transform The transform to be applied after this one.
	 */
	compose(transform: Transform): Transform;

	/** Reset this transform to the identity matrix. */
	identity(): Transform;

	/** Add a 2D orthographic projection to the transform. */
	project2D(left: number, top: number, right: number, bottom: number, near?: number, far?: number): Transform;

	/** Add a 3D frustum projection to the transform. */
	project3D(fov: number, aspect: number, near: number, far: number): Transform;

	/**
	 * Add a 2D rotation (i.e. rotation about the Z axis) to the transform.
	 * @param angle The angle of rotation, in radians.
	 */
	rotate(angle: number): Transform;

	/**
	 * Add a rotation to the transform.
	 * @param angle The angle of rotation, in radians.
	 * @param vx    The X component of the vector to rotate around.
	 * @param vy    The Y component of the vector to rotate around.
	 * @param vz    The Z component of the vector to rotate around.
	 */
	rotate(angle: number, vx: number, vy: number, vz: number): Transform;

	/**
	 * Add a scaling transformation to the transform.
	 * @param sx The scaling factor for the X axis.
	 * @param sy The scaling factor for the Y axis.
	 * @param sz The scaling factor for the Z axis.
	 */
	scale(sx: number, sy: number, sz?: number): Transform;

	/**
	 * Add a translation (slide) to the transform.
	 * @param tx The amount to move the X axis.
	 * @param ty The amount to move the Y axis.
	 * @param tz The amount to move the Z axis.
	 */
	translate(tx: number, ty: number, tz?: number): Transform;
}

declare class VertexList
{
	constructor(vertices: Vertex[]);
}

/**
 * Provides functions for data compression and decompression.
 */
declare namespace Z
{
	/**
	 * Compress data using the DEFLATE compression algorithm.
	 * @param data  A buffer containing the data to compress.
	 * @param level Compression level between 0 (no compression) and 9 (max).
	 * @returns An ArrayBuffer containing the compressed data.
	 */
	function deflate(data: ArrayBuffer | ArrayBufferView, level?: number): ArrayBuffer;

	/**
	 * Uncompress data that was previously compressed using `Z.deflate`, with optional "inflate
	 * bomb" protection.
	 * @param data    A buffer containing some data compressed using `deflate`.
	 * @param maxSize The maximum allowed size of the data after inflation, in bytes.
	 * @returns An ArrayBuffer containing the uncompressed data.
	 */
	function inflate(data: ArrayBuffer | ArrayBufferView, maxSize?: number): ArrayBuffer;
}

declare module 'sphere-runtime'
{
	const from: typeof import('from').default;
	const Console: typeof import('console').default;
	const Easing: typeof import('tween').Easing;
	const FocusTarget: typeof import('focus-target').default;
	const Logger: typeof import('logger').default;
	const Music: typeof import('music').default;
	const Prim: typeof import('prim').default;
	const Query: typeof import('from').Query;
	const Random: typeof import('random').default;
	const Thread: typeof import('thread').default;
	const Tween: typeof import('tween').default;
}

declare module 'console'
{
	export default Console;

	import Thread from 'thread';

	interface ConsoleOptions
	{
		hotKey?: Key | null;
		inBackground?: boolean;
		logFileName?: string | null;
		mouseKey?: MouseKey | null;
		prompt?: string;
		priority?: number;
	}

	class Console extends Thread
	{
		constructor(options?: ConsoleOptions);

		visible: boolean;

		defineObject<T>(name: string, thisArg: T, methods: {} & ThisType<T>): void;
		log(...texts: string[]): void;
		start(): Promise<void>;
		undefineObject(name: string): void;
	}
}

declare module 'focus-target'
{
	export default FocusTarget;

	interface FocusTargetOptions
	{
		priority?: number;
	}

	class FocusTarget
	{
		constructor(options?: FocusTargetOptions);

		readonly hasFocus: boolean;

		dispose(): void;
		takeFocus(): void;
		yield(): void;
	}
}

declare module 'from'
{
	export default from;
	export { Query };

	/**
	 * Get a new query for the elements of one or more arrays or other iterable objects.
	 * @param sources One or more arrays or iterable objects to query.
	 */
	function from<T>(...sources: Iterable<T>[]): Query<T>

	/**
	 * Represents an iterable collection with query transformations applied. Queries can be looped
	 * over using `for..of` or additional query operations can be chained to produce a new query.
	 */
	class Query<T> implements Iterable<T>
	{
		[Symbol.iterator](): Iterator<T>;

		/** Run the query and check if all results pass the given predicate function. */
		all(predicate: (value: T) => boolean): boolean;

		allIn(values: Iterable<T>): boolean;
		any(predicate: (value: T) => boolean): boolean;
		anyIn(values: Iterable<T>): boolean;
		anyIs(value: T): boolean;
		ascending<K>(keySelector?: (value: T) => K): Query<T>;
		besides(callback: (value: T) => void): Query<T>;
		concat(...sources: Iterable<T>[]): Query<T>;
		count(): number;
		countBy<K extends string>(keySelector: (value: T) => K): Record<K, number>;
		descending<K>(keySelector?: (value: T) => K): Query<T>;
		drop(count: number): Query<T>;
		dropLast(count: number): Query<T>;
		dropWhile(predicate: (value: T) => boolean): Query<T>;
		first(predicate?: (value: T) => boolean): T;

		/**
		 * Run the query and call a function for each result.
		 * @param iteratee A function to call for each result. Its return value is ignored.
		 */
		forEach(iteratee: (value: T) => void): void;

		groupBy<K extends string>(keySelector: (value: T) => K): Record<K, T[]>;
		join<U, R>(joinSource: Iterable<U>, predicate: (left: T, right: U) => boolean, selector: (left: T, right: U) => R): Query<R>;
		last(predicate?: (value: T) => boolean): T;
		memoize(): Query<T>;
		over<R>(selector: (value: T) => Iterable<R>): Query<R>;
		plus(...values: T[]): Query<T>;
		pull(...values: T[]): Query<T>;
		random(count: number): Query<T>;
		reduce<R>(reducer: (accumulator: R, value: T) => R, seed: R): R;
		remove(predicate: (value: T) => boolean): void;

		/**
		 * Reverse the query results so the last result is returned first.
		 * @returns A new query for the reversed sequence.
		 */
		reverse(): Query<T>;

		sample(count: number): Query<T>;

		/**
		 * Transform query results using a mapping function.
		 * @param selector A callback that takes a query result and returns the transformed value.
		 * @returns A new query for the transformed results.
		 */
		select<R>(selector: (value: T) => R): Query<R>;

		shuffle(): Query<T>;
		take(count: number): Query<T>;
		takeLast(count: number): Query<T>;
		takeWhile(predicate: (value: T) => boolean): Query<T>;
		thru<R>(transform: (values: T[]) => Iterable<R>): Query<R>;
		toArray(): T[];
		uniq(): Query<T>;
		uniq<K>(predicate: (value: T) => K): Query<T>;
		update<R>(selector: (value: T) => R): void;
		valueAt(index: number): T | undefined;

		/**
		 * Query for values that satisfy a given predicate function.
		 * @param predicate A callback that returns `true` to keep a value or `false` to discard it.
		 * @returns A new query for the filtered results.
		 */
		where(predicate: (value: T) => boolean): Query<T>;

		without(...values: T[]): Query<T>;
		zip<U>(zipSource: Iterable<U>): Query<[ T, U ]>;
		zip<U, R>(zipSource: Iterable<U>, selector: (left: T, right: U) => R): Query<R>;
	}
}

declare module 'logger'
{
	export default Logger;

	class Logger
	{
		constructor(fileName: string);

		beginGroup(title: string): void;
		endGroup(): void;
		write(text: string): void;
	}
}

declare module 'music'
{
	export default Music;

	/** Provides convenient functions for managing background music. */
	namespace Music
	{
		/**
		 * Adjust the BGM volume, optionally over the course of several frames.
		 * @param newVolume The target volume level.
		 * @param numFrames The number of frames over which to adjust the volume.
		 * @returns A promise that resolves when the volume reaches the new level.
		 */
		function adjustVolume(newVolume: number, numFrames?: number): Promise<void>;

		/**
		 * Temporarily override the normal BGM with a specific track, with optional crossfade.
		 * @param fileName   SphereFS path of the music track to play.
		 * @param fadeFrames Duration of the optional crossfade transition, in frames.
		 */
		function override(fileName: string, fadeFrames?: number): void;

		/**
		 * Change the track currently at the top of the music stack, with optional crossfade.
		 * @param fileName   SphereFS path of the music track to play.
		 * @param fadeFrames Duration of the optional crossfade transition, in frames.
		 */
		function play(fileName: string, fadeFrames?: number): void;

		/**
		 * Remove the music currently at the top of the music stack and resume the previously
		 * playing track.
		 * @param fadeFrames Duration of the optional crossfade transition, in frames.
		 */
		function pop(fadeFrames?: number): void;

		/**
		 * Push a new track onto the top of the music stack. The previous track can be resumed by
		 * calling `pop`.
		 * @param fileName   SphereFS path of the music file to play.
		 * @param fadeFrames Duration of the optional crossfade transition, in frames.
		 */
		function push(fileName: string, fadeFrames?: number): void;

		/**
		 * Reset the music manager to normal operation after the game has called `override`.
		 * @param fadeFrames Duration of the optional crossfade, in frames.
		 */
		function reset(fadeFrames?: number): void;
	}
}

declare module 'prim'
{
	export default Prim;

	namespace Prim
	{
		function blit(surface: Surface, x: number, y: number, texture: Texture, mask?: Color): void;
		function blitSection(surface: Surface, x: number, y: number, texture: Texture, sx: number, sy: number, width: number, height: number, mask?: Color): void;
		function drawCircle(surface: Surface, x: number, y: number, radius: number, color: Color): void;
		function drawEllipse(surface: Surface, x: number, y: number, rx: number, ry: number, color: Color): void;
		function drawLine(surface: Surface, x1: number, y1: number, x2: number, y2: number, thickness: number, color: Color, color2?: Color): void;
		function drawPoint(surface: Surface, x: number, y: number, color: Color): void;
		function drawRectangle(surface: Surface, x: number, y: number, width: number, height: number, thickness: number, color: Color): void;
		function drawSolidCircle(surface: Surface, x: number, y: number, radius: number, color: Color, color2?: Color): void;
		function drawSolidEllipse(surface: Surface, x: number, y: number, rx: number, ry: number, color: Color, color2?: Color): void;
		function drawSolidRectangle(surface: Surface, x: number, y: number, width: number, height: number, color: Color): void;
		function drawSolidRectangle(surface: Surface, x: number, y: number, width: number, height: number, colorUL: Color, colorUR: Color, colorLR: Color, colorLL: Color): void;
		function drawSolidTriangle(surface: Surface, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color: Color): void;
		function drawSolidTriangle(surface: Surface, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, color1: Color, color2: Color, color3: Color): void;
		function fill(surface: Surface, color: Color): void;
	}
}

declare module 'random'
{
	export default Random;

	namespace Random
	{
		function chance(odds: number): boolean;
		function discrete(min: number, max: number): number;
		function normal(mean: number, sigma: number): number;
		function sample<T>(array: T[]): T;
		function string(length?: number): string;
		function uniform(mean: number, variance: number): number;
	}
}

declare module 'thread'
{
	export default Thread;

	class Thread
	{
		static join(...threads: Thread[]): Promise<void>;

		constructor(options?: JobOptions);

		readonly hasFocus: boolean;
		readonly priority: number;
		readonly running: boolean;

		on_startUp(): void;
		on_shutDown(): void;
		on_inputCheck(): void;
		on_render(): void;
		on_update(): void;

		pause(): void;
		resume(): void;
		start(): Promise<void>;
		stop(): void;
		takeFocus(): void;
		yieldFocus(): void;
	}
}

declare module 'tween'
{
	export default Tween;
	export { Easing };

	enum Easing
	{
		Back,
		Bounce,
		Circular,
		Cubic,
		Elastic,
		Exponential,
		Linear,
		Quadratic,
		Quartic,
		Quintic,
		Sine,
	}

	class Tween<K extends PropertyKey>
	{
		constructor(object: Record<K, number>, easingType?: Easing);

		easeIn(newValues: Record<K, number>, numFrames: number): Promise<void>;
		easeInOut(newValues: Record<K, number>, numFrames: number): Promise<void>;
		easeOut(newValues: Record<K, number>, numFrames: number): Promise<void>;
	}
}
