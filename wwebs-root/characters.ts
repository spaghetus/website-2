#!/usr/bin/env -S deno run -A 
import * as path from "https://deno.land/std@0.184.0/path/mod.ts";

console.error('header Content-Type text/css')

for await (const child of Deno.readDir("static/characters")) {
	if (child.isSymlink) {
		continue
	}
	const next_path = path.join("static/characters", child.name);
	if (child.isFile && child.name.endsWith('.json')) {
		await character(next_path);
	}
}

type Spec = {
	name: string,
	color: string,
	id: string,
	image: {[index: string]: string}
}

async function character(json_path: string) {
	const json = new TextDecoder().decode(await Deno.readFile(json_path))
	const spec: Spec = JSON.parse(json);

	name(spec.id, spec.name, spec.color)

	for (const emotion_name of Object.keys(spec.image)) {
		const filename = spec.image[emotion_name];
		if (!filename) {continue;}
		const file_path = path.join('/'+path.dirname(json_path), filename);
		emotion(file_path, spec.id, emotion_name);
	}

	const neutral_filename = spec.image["neutral"];
	if (!neutral_filename) {return;}
	const neutral_path = path.join('/'+path.dirname(json_path), neutral_filename);
	emotion(neutral_path, spec.id, undefined)
}

function name(char_id: string, char_name: string, color: string) {
	const selector = `div.character.${char_id}`

	console.log(`
	${selector}::before {
		content: '${char_name}:';
		color: ${color};
	}
	`)
}

function emotion(file: string, char_id: string, emote_name: string | undefined) {
	const selector = `div.character.${char_id}${emote_name ? `.${emote_name}` : ''}`

	console.log(`
	${selector} {
		background-image: url('${file}')
	}
	`)
}