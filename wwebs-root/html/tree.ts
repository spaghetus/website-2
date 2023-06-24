#!/usr/bin/env -S deno run -A

console.error('header Content-Type text/html')

const filename = new URL('', import.meta.url).pathname.split('/').findLast(_v => true)


let requested = Deno.env.get("REQUESTED");
requested = requested?.substring(requested.indexOf(filename || '') + (filename?.length || 0))




async function list_dir(path: string, depth = -1) {
	if (depth >= 0) {
		console.log('<li>');
		console.log(`<a href="./${filename}/${path.split('/').findLast(_v => true)}">${path.split('/').findLast(_v => true)}</a><br />`)
	}
	console.log('<ul>');
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
		console.log('<li>');
		
		
		console.log('<a href="' +
			'../'.repeat(requested?.split('/').length || 0) +
			path.replace(/\.\.\/md/, '../html') + '/' + entry.name + '">' +
			entry.name +
			'</a>')
		
		console.log('</li>');
	}
	console.log('</ul>');
	if (depth >= 0) {
		console.log('</li>');
	}
}
console.log(Deno.readTextFileSync('../static/header.html'));

if (filename == 'tree.ts') {
	console.log("<h1>Tree</h1>")
} else if (filename == 'chrono.ts') {
	console.log("<h1>Chrono</h1>")
}

if (requested?.length || 0 > 0) {
	console.log('<p><a href=".">Up one level</a></p>')
}

await list_dir(`../md${requested}`)

console.log(Deno.readTextFileSync('../static/footer.html'));
