#!/usr/bin/env -S deno run -A
import * as path from "https://deno.land/std@0.184.0/path/mod.ts";

const wwebs_root = Deno.realPathSync(path.dirname(path.dirname(path.fromFileUrl(Deno.mainModule))));

console.log('<hr><div class="hr"><span>End of content</span></div>');

console.log(`<p><a href="/LICENSE">Content license</a></p>`);


console.log(`
<p>Information about me:</p>
<table>
<tr>
	<td>Public mailbox</td>
	<td>The word 'public' at the letter 'w' dot this domain name.</td>
</tr>
<tr>
	<td>Fediverse</td>
	<td><a rel="me" href="https://blahaj.zone/@w">@w@blahaj.zone</a></td>
</tr>
</table>
`);



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
		const human_wav_path = path.join(wwebs_root, other_version(requested, 'wav-human', 'wav').join('/'))
		try {
			Deno.statSync(human_wav_path);
			return ['wav-human', 'wav', 'Human reading']
		} catch {
			return ['wav', 'wav', 'Machine reading']
		}
	})()
]) {
	const path = '/' + other_version(requested, dir, ext).join('/');
	if (ext == 'wav') {
	console.log(`<tr>
	<td>${name}</td>
	<td><audio controls preload="none"><source src="${path}" type="audio/wav"></audio></td>
</tr>`)
	} else {
	console.log(`<tr>
	<td>${name}</td>
	<td><a rel="alternate" href="${path}">${path}</a></td>
</tr>`)
	}
}

console.log('</table>');


console.log(`
<p><a href="https://github.com/spaghetus/website-2">Source code</a></p>
</body>
</html>
`);
