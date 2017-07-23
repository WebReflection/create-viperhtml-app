// this file will contain a reference to all
// bundled files which is the APPLICATION_BUNDLE array.

// You can use this array to cache em all
// or just the first bundle file.

// You can also use such bundle to grant a unique
// cache on your Service Worker storage.

const openCache = caches.open(
  'cache:' + hashCode(APPLICATION_BUNDLE.join('$'))
);

const any = $ => new Promise((D, E, A, L) => {
  A = [];
  L = $.map(($, i) => Promise
      .resolve($)
      .then(D, O => (((A[i] = O), --L) || E(A)))
  ).length;
});

addEventListener('install', e => {
  e.waitUntil(openCache.then(
    cache => cache.addAll(APPLICATION_BUNDLE)
  ));
});

addEventListener('fetch', e => {
  const request = e.request;
  e.respondWith(
    openCache.then(cache => cache.match(request).then(
      response => {
        const remote = fetch(request).then(
          response => {
            if (199 < response.status && response.status < 400) {
              cache.put(request, response.clone());
            }
            return response;
          }
        );
        return any([response || remote, remote]);
      }
    ))
  );
});

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
