import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
import verifyAuthTokenMiddleware from '../util/verifyAuthTokenMiddleware';

const store = new OrderStore();

const index = async (req: Request, res: Response): Promise<void> => {
  const orders = await store.index();
  res.json(orders);
};

const show = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await store.show(req.params.id);
    console.log(`Found user: ${order}`);
    res.json(order);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const order: Order = {
      status: req.body.status,
      userId: req.body.userId,
    };

    const newOrder = await store.create(order);
    res.json(newOrder);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const getOrdersByUser = async (req: Request, res: Response): Promise<void> => {
  try {
      const status = req.query.status as string
      const orders = await store.getOrdersByUser(req.params.userId, status);
      res.json(orders);
  } catch (error) {
    res.status(400).json(error);
  }
};

const completeOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id
    const status = req.body.status
    const order = await store.show(id)
    if (!order) {
      throw new Error("Order Not Found");
    }
    const updatedOrder = {
      ...order,
      status: status
    }

    const result = await store.completeOrder(updatedOrder)
    res.json(result)
  } catch (error) {
    res.status(400).json(error)
  }
}

const addProduct = async (req: Request, res: Response): Promise<void> => {
  const orderId: string = req.params.id;
  const productId: string = req.body.productId;
  const quantity: number = parseInt(req.body.quantity);

  try {
    const addedProduct = await store.addProduct(quantity, orderId, productId);
    res.json(addedProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orderRoutes = (app: express.Application): void => {
  app.get('/orders', verifyAuthTokenMiddleware, index);
  app.get('/orders/:id', verifyAuthTokenMiddleware, show);
  app.put('/orders/:id', verifyAuthTokenMiddleware, completeOrder);
  app.post('/orders', verifyAuthTokenMiddleware, create);
  app.post('/orders/:id/products', verifyAuthTokenMiddleware, addProduct);
  app.get('/orders/users/:userId', verifyAuthTokenMiddleware, getOrdersByUser);
};

export default orderRoutes;
