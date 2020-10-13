import express, { Request, Response } from 'express';

const app = express();
app.use('/getAll',(req: Request, res: Response) => {
});

app.listen(5000,() => console.debug("LISTENING"));