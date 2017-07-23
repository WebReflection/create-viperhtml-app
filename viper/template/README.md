# Highlighted HTML & Automatic Views Generation

Following a `(render, model) => html` it is possible to use plain HTML files in this folder.

Every single change though, will be reflected into the `./view` folder, using the same file name,
but wrapping the output as a module.

As example, creating a `ua-info.html` file in this folder with the following content:
```html
<p>
  <small> Your user agent string is: </small><br>
  ${model.userAgent}
</p>
```

Will automatically produce, whenever you watch via `npm run watch` or execute `npm run template-to-view`,
the equivalent JS file inside the view folder.
```js
module.exports = (render, model) => render`
<p>
  <small> Your user agent string is: </small><br>
  ${model.userAgent}
</p>`;
```

This is one way to simplify static content creation, using all the already available features
your editors have when it comes to HTML.