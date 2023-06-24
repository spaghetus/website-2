#!/usr/bin/env -S deno run -A
import * as path from "https://deno.land/std@0.184.0/path/mod.ts";

const wwebs_root = Deno.realPathSync(path.dirname(path.dirname(path.fromFileUrl(Deno.mainModule))));

console.log('<hr><div class="hr"><span>End of content</span></div>');

const requested = Deno.env.get('REQUESTED')
	?.split('/')
	.filter((el: string) => el.length > 0) || ['html', 'index.html'];

function other_version(from: string[], dir: string, ext: string) {
	const new_path = from.filter(_ => true);
	new_path[0] = dir;
	new_path[new_path.length - 1] = new_path[new_path.length - 1].replace(/html$/, ext)
	return new_path
}

console.log('<p>Other versions of this page:</p>');
console.log('<table>');
for (const [dir, ext, name] of [
	['gem', 'gem', 'Gemtext'],
	['md', 'md', 'Markdown'],
	['pdf', 'pdf', 'Printable'],
	['txt', 'txt', 'Plain-text'],
	(() => {
		let human_wav_path = path.join(wwebs_root, other_version(requested, 'wav-human', 'wav').join('/'))
		try {
			Deno.statSync(human_wav_path);
			return ['wav-human', 'wav', 'Human reading']
		} catch {
			return ['wav', 'wav', 'Machine reading']
		}
	})()
]) {
	let path = '/' + other_version(requested, dir, ext).join('/');
	console.log(`<tr>
	<td>${name}</td>
	<td><a href="${path}">${path}</a></td>
</tr>`)
}


console.log(`
</body>
</html>
`);
