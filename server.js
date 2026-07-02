require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./src/GraphQL/schema');

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors({
    origin: [process.env.CLIENT_URL, process.env.ADMIN_URL].filter(Boolean),
    credentials: true,
}));
app.use(express.json());

// GraphQL endpoint
app.use('/graphql', graphqlHTTP((req) => ({
    schema,
    graphiql: true,
    context: { req },
})));

// REST routes (payments, webhooks)
app.use('/api/pesapal', require('./src/Rest/Routes/pesapalRouter'));

mongoose.connect(process.env.DATABASE_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => console.log(`Studio Mobia API running on port ${PORT}`));
    })
    .catch(err => console.error('DB connection error:', err));
