import { QueryResult } from 'pg';
import Client from '../database';

export type OrderProduct = {
  product: string;
  quantity: number;
}

export type Order = {
  id?: number;
  userId: number;
  status: string;
  products?: OrderProduct[];
};

const orderMapper = (result: QueryResult<any>): Order[] => {
  if (!result.rows.length) {
    return [];
  }
  // a map to hold orders with their products
  const ordersMap = new Map<number, Order>();

  result.rows.forEach(row => {
    const orderId = row.id;

    // If the order already exists in the map, add the product to its list
    if (ordersMap.has(orderId)) {
      const order = ordersMap.get(orderId);
      if (order) {
        order.products = order.products || [];
        if (row.product_id) {
          order.products.push({
            product: row.product_id,
            quantity: row.quantity,
          });
        }
      }
    } else {
      // If the order does not exist, create a new one
      ordersMap.set(orderId, {
        id: orderId,
        userId: parseInt(row.user_id),
        status: row.status,
        products: row.product_id
          ? [
              {
                product: row.product_id,
                quantity: row.quantity,
              },
            ]
          : [],
      });
    }
  });
  return Array.from(ordersMap.values());
}

export class OrderStore {
  index = async (): Promise<Order[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT o.id, o.user_id, o.status, p.product_id, p.quantity FROM orders AS o LEFT OUTER JOIN order_products AS p ON o.id = p.order_id';

      const result = await conn.query(sql);
      conn.release();
      return orderMapper(result);
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  };

  show = async (id: string): Promise<Order> => {
    try {
      const sql = 'SELECT o.id, o.user_id, o.status, p.product_id, p.quantity FROM orders AS o LEFT OUTER JOIN order_products AS p ON o.id = p.order_id WHERE o.id = ($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      return orderMapper(result)[0];
    } catch (error) {
      throw new Error(`Could not find order ${id}. Error: ${error}`);
    }
  };

  create = async (o: Order): Promise<Order> => {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO orders (user_id, status) VALUES ($1, $2) RETURNING *';

      const result = await conn.query(sql, [o.userId, o.status]);
      conn.release();

      return result.rows.map(r => ({
        id: r.id as number,
        userId: parseInt(r.user_id) as number,
        status: r.status as string
      }))[0];
    } catch (error) {
      throw new Error(
        `Could not add new order for user ${o.userId}. Error: ${error}`,
      );
    }
  };

  addProduct = async (
    quantity: number,
    orderId: string,
    productId: string,
  ): Promise<Order> => {
    try {
      const sql =
        'INSERT INTO order_products (quantity, order_id, product_id) VALUES($1, $2, $3) RETURNING *';
      const conn = await Client.connect();

      const result = await conn.query(sql, [quantity, orderId, productId]);

      
      conn.release();
      if (!result.rows.length) {
        throw new Error("Error while running insert query");
      }
      const id = result.rows[0].id
      const orderResult = await this.show(id)
      return orderResult;
    } catch (err) {
      throw new Error(
        `Could not add product ${productId} to order ${orderId}: ${err}`,
      );
    }
  };

  getOrdersByUser = async (userId: string, status?: string): Promise<Order[]> => {
    try {
      const conn = await Client.connect();
      let sql = 'SELECT * FROM orders WHERE user_id = ($1)';
      const uId = parseInt(userId)
      let result = null
      if (status) {
        sql = 'SELECT * FROM orders WHERE user_id = ($1) AND status = ($2)';
        result = await conn.query(sql, [uId, status]);
      } else {
        result = await conn.query(sql, [uId])
      }
      conn.release();

      return result.rows.map(r => ({
        id: r.id,
        userId: parseInt(r.user_id),
        status: r.status,
        products: []
      }));
    } catch (error) {
      throw new Error(`Could not get orders. Error: ${error}`);
    }
  };

  completeOrder = async (order: Order): Promise<Order> => {
    try {
      const conn = await Client.connect();
      const sql = 'UPDATE orders SET status = ($1) WHERE id = ($2) RETURNING *';
      const result = await conn.query(sql, [order.status, order.id])
      conn.release();

      return result.rows.map(r => ({
        id: r.id,
        userId: parseInt(r.user_id),
        status: r.status,
        products: []
      }))[0];
    } catch (error) {
      throw new Error(`Can't complete the order. Error: ${error}`);
    }
  }
}
