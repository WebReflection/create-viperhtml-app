# hyperHTML Reactive Views

To keep this project as clean as possible, I've separated views in the current folder.

There are at least two reasons you'd like to have views in a folder a part:

  * both `viperHTML` and `hyperHTML` can share the same view to obtain 100% SSR ability and graceful enhancement
  * views are mostly template literals and having them separated makes the rest of the code cleaner and easier to read


## The 2.5 hyperHTML rules

  * attributes, as well as events, should be defined within single or double quotes (even boolean attributes, yes)
  * html as string, node, Promise, or an array of previous values, should never have surrounding chars around.
  * text should always have at least a surrounding char around.

```js
render`
  <div attribute="${'quoted'}">
    <strong>${'html'}</strong>
       <em> ${'text'} </em>
  </div>
`;
```

Spaces are basically meaningless for HTML, nobody will ever seen them, so it's not an issue, even for links, to have sanitized text.

```html
you <a href="#">
      won't see</a> spaces
around the link text
<pre>
not even the first new line</pre>
```
