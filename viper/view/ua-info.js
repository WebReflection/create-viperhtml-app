// what does the index page represent ?
module.exports = (render, model) => render`
  <p>
    Your user agent string is: <br>
    ${model.userAgent}
  </p>
`;
