#!/usr/bin/env -S deno run -A

console.error('header Content-Type text/markdown')

const filename = new URL('', import.meta.url).pathname.split('/').findLast(_v => true)

if (filename == 'tree.ts') {
	console.log("# Tree:\n")
} else if (filename == 'chrono.ts') {
	console.log("# Chrono:\n")
}

let requested = Deno.env.get("REQUESTED");
requested = requested?.substring(requested.indexOf(filename || '') + (filename?.length || 0))

if (requested?.length || 0 > 0) {
	console.log('[Up one level](..)\n')
}

async function list_dir(path: string, depth = -1) {
	if (depth >= 0) {
		console.log(`${'  '.repeat(depth)}* [${path.split('/').findLast(_v => true)}](./${path.split('/').findLast(_v => true)}):`)
	}
	const files = []
	for await (const entry of Deno.readDir(path)) {
		if (entry.isDirectory) {
			await list_dir(path + '/' + entry.name, depth+1)
		} else if (entry.isFile && entry.name.endsWith('md')) {
			// entry.name = entry.name.replace(/md$/, 'md')
			files.push(entry)
		}
	}

	if (filename == 'tree.ts') {
		files.sort((a, b) => {
			if (a.name == b.name) {
				return 0
			} else {
				return a.name > b.name ? 1 : -1
			}
		})
	} else if (filename == 'chrono.ts') {
		files.sort((a, b) => {
			const a_date = Deno.statSync(path + '/' + a.name).mtime || new Date(0);
			const b_date = Deno.statSync(path + '/' + b.name).mtime || new Date(0);
			if (a_date == b_date) {
				return 0;
			} else {
				return a_date > b_date ? 1 : -1;
			}
		})
	}

	for (const entry of files) {
		console.log(`${'  '.repeat(depth + 1)}* [${entry.name}](` +
			'../'.repeat(requested?.split('/').length || 0) +
			path + '/' + entry.name + ')')
	}
}

list_dir(`../md${requested}`)