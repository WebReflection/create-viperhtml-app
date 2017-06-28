const hyperHTML = require('hyperhtml');
const uaInfo = require('../view/ua-info.js');

document.addEventListener(
  'DOMContentLoaded',
  () => {
    document.body.appendChild(
      uaInfo(
        hyperHTML.wire(document.body),
        navigator
      )
    );
  },
  {once: true}
);