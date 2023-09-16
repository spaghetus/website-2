#!/usr/bin/env -S deno run --ext ts -A

// Tree generation for all content types
const REQUESTED = Deno.env.get('REQUESTED')
const SEGMENTS = REQUESTED?.split('/') || [];

// Get path into tree or chrono
const FILENAME = import.meta.url.split('/').at(-1) || '?';
const PATH_INTO = SEGMENTS.slice((SEGMENTS?.indexOf(FILENAME)+1) || 0).join('/')

// Get content type
const CONTENT_TYPE = (REQUESTED?.match(/^\/(\w+)/) || [' ?'])[0].slice(1);

enum ContentType {
	HTML = 0,
	Gem,
	Md,
	Txt,
}

let content_type: ContentType;
switch (CONTENT_TYPE) {
	case 'html':
		content_type = ContentType.HTML;
		break;
	case 'gem':
		content_type = ContentType.Gem;
		break;
	case 'md':
		content_type = ContentType.Md;
		break;
	case 'txt':
		content_type = ContentType.Txt;
		break;
	default:
		throw new Error(`Unknown content type ${CONTENT_TYPE}`);
}

// Build the file tree
interface Dir {
	kind: 'dir',
	name: string,
	entries: Array<Dir | File>,
}

interface File {
	kind: 'file',
	name: string,
}

async function build_tree(path: string): Promise<Dir | File> {
	let file = await Deno.stat(path);
	if (file.isFile || file.isSymlink) {
		return {
			kind: 'file',
			name: path.split('/').at(-1) || '?',
		};
	}

	let dir = await Deno.readDir(path);
	let out: Dir = {
		kind: 'dir',
		name: path.split('/').at(-1) || '?',
		entries: [],
	}
	for await (const entry of dir) {
		let new_tree = await build_tree(`${path}/${entry.name}`);
		if (new_tree.kind == 'dir' || new_tree.name.endsWith('.md')) {
			out.entries.push(new_tree);
		}
	}
	out.entries.sort((a, b) => a.name > b.name ? 1 : -1)

	return out;
}

const tree = await build_tree(`/wsrc/md/${PATH_INTO}`);
tree.name = CONTENT_TYPE

// Write header
switch (content_type) {
	case ContentType.HTML: {
			const out = await(new Deno.Command(`../segment/header.html.ts`)).output();
			Deno.stdout.writeSync(out.stdout);
			Deno.stderr.writeSync(out.stderr);
			break;
		}
	case ContentType.Gem:
	case ContentType.Md:
	case ContentType.Txt:
}

// Convert tree to markup
function html_tree(tree: Dir | File, path_here: string): Array<string> {
	if (tree.kind == 'file') {
		return [`<li><a href="${path_here}/${tree.name.replace(/\.md$/, `.${CONTENT_TYPE}`)}">${tree.name.replace(/\.md$/, `.${CONTENT_TYPE}`)}</a></li>`]
	}
	const out = [`<li>${tree.name}`, '<ul>'];
	for (const file of tree.entries) {
		for (const line of html_tree(file, `${path_here}/${tree.name}`)) {
			out.push(line);
		}
	}
	out.push('</ul></li>');
	return out;
}
function md_tree(tree: Dir | File, path_here: string): Array<string> {
	if (tree.kind == 'file') {
		return [`* [${tree.name.replace(/\.md$/, `.${CONTENT_TYPE}`)}](${path_here}/${tree.name.replace(/\.md$/, `.${CONTENT_TYPE}`)})`]
	}

	const out = [`* ${tree.name}`];
	for (const file of tree.entries) {
		for (const line of md_tree(file, `${path_here}/${tree.name}`)) {
			out.push(`  ${line}`);
		}
	}

	return out;
}

function gem_tree(tree: Dir | File, path_here: string): Array<string> {
	if (tree.kind == 'file') {
		return [`=> ${path_here}/${tree.name.replace(/\.md$/, `.${CONTENT_TYPE}`)} ${tree.name.replace(/\.md$/, `.${CONTENT_TYPE}`)}`]
	}

	const out = [`# ${path_here}/${tree.name}`];
	for (const file of tree.entries) {
		for (const line of gem_tree(file, `${path_here}/${tree.name}`)) {
			out.push(`${line}`);
		}
	}

	return out;
}

let lines;
switch (content_type) {
	case ContentType.HTML:
		lines = html_tree(tree, ``);
		break;
	case ContentType.Gem:
		lines = gem_tree(tree, ``);
		break;
	case ContentType.Txt:
	case ContentType.Md:
		lines = md_tree(tree, ``);
		break;
}

console.log(lines?.join('\n'));
