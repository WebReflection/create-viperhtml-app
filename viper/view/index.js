// what does the index page represent ?
module.exports = (render, model) => render`
  <!DOCTYPE html>
  <html lang="${model.language}">
    <head>
      <title> ${model.title} </title>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width,initial-scale=1.0">
      <meta name="apple-mobile-web-app-capable" content="yes">
      <meta name="mobile-web-app-capable" content="yes">
      <meta name="theme-color" content="#ffffff">
      <style>${model.style}</style>
      <link rel="manifest" href="/manifest.json">
      <link rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png">
      <link rel="icon" type="image/png" href="/img/favicon-32x32.png" sizes="32x32">
      <link rel="icon" type="image/png" href="/img/favicon-16x16.png" sizes="16x16">
      <link rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#5bbad5">
      <script defer>(navigator.serviceWorker||{register:String}).register('${model.sw}')</script>
      <script src="${model.script}" defer></script>
    </head>
    <body>${model.body}</body>
  </html>
`;