import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send(`
        <div>
            <h1>Hi theress!</h1>
        </div>
    `);
});

export { app };
