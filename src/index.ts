import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <div>
            <h1>Hi there!</h1>
        </div>
    `);
});

export { app };