import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.send(`
        <div>
            <h1>Hi theres!</h1>
        </div>
    `);
});

export { app };