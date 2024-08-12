import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/products';
import verifyAuthTokenMiddleware from '../util/verifyAuthTokenMiddleware';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const popularProduct = async (req: Request, res: Response) => {
  const top = req.query.top as string;
  const popular = await store.top(parseInt(top))
  res.json(popular);
}

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  console.log(`Found product: ${product}`);
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name,
      price: req.body.price,
    };

    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/popular-product', popularProduct)
  app.get('/products/:id', show);
  app.post('/products', verifyAuthTokenMiddleware, create);
};

export default productRoutes;
