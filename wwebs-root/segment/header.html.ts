#!/usr/bin/env -S deno run -A

console.log(
`<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>${Deno.env.get("TITLE") || '??'}</title>
	<meta http-equiv="Content-Security-Policy" content="default-src 'self';
		script-src 'self';
		style-src 'self'
			https://cdnjs.cloudflare.com/ajax/libs/milligram/1.4.1/milligram.min.css
			https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.css
		font-src https://davidar.github.io/linja-pona/linja-pona-4.1.woff 'self';
		img-src *;">
	<link rel="stylesheet" href="/static/style.css">
	<link rel="stylesheet" href="/code-styles/langs">
</head>

<body>`
);
