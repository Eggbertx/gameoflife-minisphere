/**
 *  Sphere Runtime for Cellscripts
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

const ts = require('$/cell/typescript.js');

const compilerHost = {
	directoryExists: FS.directoryExists,
	fileExists: FS.fileExists,
	getCanonicalFileName: FS.fullPath,
	getCurrentDirectory() {
		return "$/";
	},
	getDefaultLibFileName(options) {
		return "$/types/lib.d.ts";
	},
	getNewLine() {
		return "\r\n";
	},
	getSourceFile(fileName, target) {
		const sourceText = FS.readFile(fileName);
		return ts.createSourceFile(fileName, sourceText, target);
	},
	readFile: FS.readFile,
	useCaseSensitiveFileNames() {
		return true;
	},
	writeFile: FS.writeFile,
};

const tsTool = new Tool((outFileName, inFileNames) => {
	const program = ts.createProgram(inFileNames, {
		target: ts.ScriptTarget.ESNext,
		module: ts.ModuleKind.ESNext,
		lib: [ 'lib.esnext.d.ts', 'lib.sphere.d.ts' ],
		outDir: FS.directoryOf(outFileName),
		isolatedModules: true,
		strict: true,
	}, compilerHost);
	program.emit();
	for (const diag of ts.getPreEmitDiagnostics(program)) {
		const message = ts.flattenDiagnosticMessageText(diag.messageText);
		const fileName = FS.fullPath(diag.file.fileName);
		const { line } = diag.file.getLineAndCharacterOfPosition(diag.start);
		error(`[${fileName}:${line + 1}] ${message}`);
	}
}, "transpiling");

export
function compile(dirName, sources)
{
	return stageTarget(dirName, sources);
}

function stageTarget(dirName, sources)
{
	const targets = [];
	FS.createDirectory(dirName);
	for (let i = 0; i < sources.length; ++i) {
		let fileName = FS.fullPath(dirName + '/' + sources[i].name);
		if (fileName.endsWith('.ts') || fileName.endsWith('.mjs') || fileName.endsWith('.js'))
			fileName = fileName.substring(0, fileName.lastIndexOf('.'));
		fileName += '.js';
		const target = tsTool.stage(fileName, [ sources[i] ], {
			name: sources[i].name,
		});
		targets.push(target);
	}
	return targets;
}
