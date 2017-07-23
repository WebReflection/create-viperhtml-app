# hyperHTML: Declarative Front End

The `index.js` file is the entry point to your Web Application.

By default, you can use modern syntax and let Webpack and Babel transpile that for you.

Bear in mind you can load views even asynchronously thanks to a Webpack `import` feature.

```js
const asyncView = (viewName, wire, model) =>
  import(`../view/${viewName}.js`)
        .then(renderFn => renderFn(wire, model));

const view = {
  index: (wire, model) => asyncView('index', wire, model),
  uaInfo: (wire, model) => asyncView('ua-info', wire, model)
};

// example based on current demo
view.uaInfo(
  hyperHTML.bind(document.body),
  navigator
);
```


### Easy PWA

The optional `sw.js` file is also parsed through Webpack but moved at the root of the site as `/sw.js`
to simplify the Service Worker scope, handling every request instead of just sub-folders.

This file will contain at its top a `APPLICATION_BUNDLE` **array** constant with all the default bundle files.

You can use such information as you prefer, as example creating a unique cache name and cache all bundle files.

```js
const openCache = caches.open(
  'cache:' + hashCode(APPLICATION_BUNDLE.join('$'))
);

addEventListener('install', evt => {
  evt.waitUntil(openCache.then(
    cache => cache.addAll(APPLICATION_BUNDLE)
  ));
});

// for example purpose
function hashCode(str) {
  for (var
    length = str.length,
    hash = 31,
    i = 0; i < length; i++
  ) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return hash;
}
```