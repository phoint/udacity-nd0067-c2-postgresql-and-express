import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/userRoutes';
import productRoutes from './handlers/productRoutes';
import orderRoutes from './handlers/orderRoutes';
import cors from 'cors'

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

const corsOptions = {
  origin: 'http://someotherdomain.com',
  optionSuccessStatus: 200
}
app.use(cors(corsOptions))
app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Hello World!');
});
userRoutes(app);
productRoutes(app);
orderRoutes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
