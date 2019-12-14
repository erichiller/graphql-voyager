const express = require('express');
const graphqlHTTP = require('express-graphql');

const schema = require('./schema.json');

import {readFile} from 'fs';


function introspectionProvider(query) {
  console.log(query);
  readFile('./schema.json')
    .then(response => response.json());
  
  // return fetch(window.location.origin + '/graphql', {
  //   method: 'post',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ query: query }),
  // }).then(response => response.json());
}

const app = express();
app.use(express.static(__dirname));
app.use('/graphql', graphqlHTTP(() => introspectionProvider));

app.listen(0, function() {
  const port = this.address().port;
  console.log(`Started on http://localhost:${port}/`);
});
