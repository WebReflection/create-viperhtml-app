const hyperHTML = require('hyperhtml');

const uaInfo = require('../view/ua-info.js');

// if the main script is served deferred
// this is granted to work
// otherwise it might not work if async
document.addEventListener(
  'DOMContentLoaded',
  () => {
    const body = document.body;
    body.appendChild(
      uaInfo(
        hyperHTML.wire(body),
        navigator
      )
    );
  },
  {once: true}
);
