// this file will contain a reference
// to a top level Bundle constant
// which is an object with at least two properties:
// Bundle.assets, an Array with all bundled assets
// Bundle.hash, the unique hash of all asssets (content)

// You can use this reference to cache all files
// or just the first bundled file.

// You can also use such bundle to grant a unique
// cache on your Service Worker storage.

const openCache = caches.open(Bundle.hash);
addEventListener('install', e => {
  // all JS files plus the site root
  const assets = Bundle.assets.concat('/');
  e.waitUntil(openCache.then(
    cache => cache.addAll(assets)
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

// simple utility to resolve whatever comes first
// or reject if all of them fails
const any = $ => new Promise((D, E, A, L) => {
  A = [];
  L = $.map(($, i) => Promise
      .resolve($)
      .then(D, O => (((A[i] = O), --L) || E(A)))
  ).length;
});
