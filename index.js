const express = require('express');
const cors = require('cors');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema.js');

const app = express();
const port = 4000;

app.use(cors());

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true // 뭐지?
}));

app.listen(port, () => {
    console.log(`listen on ${port}`);
});