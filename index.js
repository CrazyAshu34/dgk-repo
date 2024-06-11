const serverless = require("serverless-http");
const express = require("express");
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.static('routes'));
app.use(express.static(path.resolve(__dirname, './build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './build', 'index.html'));
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

 
// app.listen(port);
// console.log('Server started at http://localhost:' + port);

  module.exports.handler = serverless(app);
