#!/usr/bin/env -S deno run -A

import { Feed } from 'npm:feed@4'
import * as path from "https://deno.land/std@0.184.0/path/mod.ts";

console.error('header Content-Type application/rss+xml')
// console.error('header Content-Type text/plain')

const path_inside = Deno.env.get('REQUESTED')
	?.split('/')
	.filter((el: string) => el.length > 0)
	.slice(1)
	.join('/') || '';

const target_dir = await Deno.realPath(
	path.join(
		Deno.cwd(),
		'md',
		path_inside
	)
);

if (!target_dir.startsWith(Deno.cwd())) {
	console.error('status 400')
}

const feed = new Feed({
	title: "wolo.dev",
	generator: "wwebs",
	id: "https://wolo.dev",
	copyright: "2023 Willow Carlson-Huber under MIT",
	feedLinks: {
		atom: 'https://wolo.dev/feed.ts'
	},
	link: 'https://wolo.dev',
	description: 'funky posts by willow'
});

async function dir_walk(this_path: string) {
	for await (const child of Deno.readDir(this_path)) {
		if (child.isSymlink) {
			continue
		}
		const next_path = path.join(this_path, child.name);
		if (child.isDirectory) {
			await dir_walk(next_path);
		} else if (child.isFile && child.name.endsWith('.md')) {
			await add_to_feed(next_path);
		}
	}
}

async function add_to_feed(file: string) {
	let date: Date, name: string;

	if (path.basename(file).includes(':')) {
		const [date_str, name_str] = path.basename(file).split(':')
		name = name_str
		const [y, m, d] = date_str.split('-').map(n => Number.parseInt(n, 10))

		date = new Date(y, m - 1, d)
	} else {
		name = path.basename(file);
		date = new Date(0)
	}

	let txt_path = 'txt/' + path.relative('md', file);
	txt_path = txt_path.replace(/md$/, 'txt');
	const make_cmd = new Deno.Command('make', {
		args: [txt_path]
	});
	await make_cmd.output();

	const content = new TextDecoder().decode(await Deno.readFile(txt_path));

	const url = 'https://wolo.dev/html/' + path.relative('md', file).replace(/md$/, 'html');
	let mp3_url;
	try {
		await Deno.stat('./wav-human/' + path.relative('md', file).replace(/md$/, 'wav'));
		mp3_url = 'https://wolo.dev/wav-human/' + path.relative('md', file).replace(/md$/, 'wav');
	} catch {
		mp3_url = 'https://wolo.dev/wav/' + path.relative('md', file).replace(/md$/, 'wav');
	}

	feed.addItem({
		title: name,
		id: path.relative('md', file),
		link: url,
		audio: mp3_url,
		date,
		content,
	})
}

await dir_walk(target_dir)

console.log(feed.rss2());