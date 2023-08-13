# Rendering Tests

This page tests rendering support.

```rust
fn main() {
	println!("This should be formatted like a code block")
}
```

```javascript
const foo = require("bar");

console.log("This is a long code block...");
console.log(
  "If your viewport is short, it will be shortened to take up less space.",
);

for (let n = 0; n < 1000; n++) {
  let out = "";
  if (n % 3 == 0) {
    out += "fizz";
  }
  if (n % 5 == 0) {
    out += "buzz";
  }
  if (out == "") {
    out = n.toString();
  }
}
```

![This is an image with alt text.](https://images.unsplash.com/photo-1682887523022-322cf76c2950?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80)

::: {.character .kel} :::  
<span class="name">KEL: </span> Test character templating. Kel by OMOCAT, used for testing because I don't have any characters of my own right now.  
:::

::: {.character .kel .angry .yell} :::  
<span class="name">KEL: </span> Character animations.  
:::