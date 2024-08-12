import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
};

export class ProductStore {
  index = async (): Promise<Product[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products';

      const result = await conn.query(sql);
      conn.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    }
  };

  top = async (limit: number): Promise<String[]> => {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT p.name, count(1) FROM products AS p INNER JOIN order_products AS o ON p.id = o.product_id GROUP BY p.name ORDER BY count(1) DESC LIMIT ($1)';
      const result = await conn.query(sql, [limit]);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Could not get products. Error: ${error}`);
    }
  }

  show = async (id: string): Promise<Product> => {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      const conn = await Client.connect();

      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find product ${id}. Error: ${error}`);
    }
  };

  create = async (p: Product): Promise<Product> => {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO products (name, price) VALUES ($1, $2) RETURNING *';

      const result = await conn.query(sql, [p.name, p.price]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not add product ${p.name}. Error: ${error}`);
    }
  };
}
