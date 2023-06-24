#!/usr/bin/env -S deno run -A

console.error('header Content-Type text/markdown')

const filename = new URL('', import.meta.url).pathname.split('/').findLast(_v => true)

if (filename == 'tree.ts') {
	console.log("# Tree:\n")
} else if (filename == 'chrono.ts') {
	console.log("# Chrono:\n")
}

let requested = Deno.env.get("REQUESTED");
console.error(requested);

requested = requested?.substring(requested.indexOf(filename || '') + (filename?.length || 0))

if (requested?.length || 0 > 0) {
	console.log('=> . Up one level')
}

async function list_dir(path: string, depth = -1) {
	let print_path_segments = path.split('/');
	let cut_counter = requested?.split('/').length || 0;
	while (cut_counter > -1) {
		console.error('printing:', print_path_segments, cut_counter);
		cut_counter -= 1
		print_path_segments = print_path_segments.slice(1)
	}
	let print_path = print_path_segments.join('/') || '.'
	console.error('printing:', print_path);


	if (depth >= 0) {
		console.log(`=> ./${filename}/${path.split('/').findLast(_v => true)} ${print_path}`)
	}
	const files = []
	for await (const entry of Deno.readDir(path)) {
		if (entry.isDirectory) {
			await list_dir(path + '/' + entry.name, depth+1)
		} else if (entry.isFile && entry.name.endsWith('md')) {
			entry.name = entry.name.replace(/md$/, 'gem')
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
		console.log('=> ' +
			'../'.repeat(requested?.split('/').length || 0) +
			path.replace(/\.\.\/md/, '../gem') + '/' + entry.name + ` ${print_path + '/' + entry.name}`)
	}
}

list_dir(`../md${requested}`)