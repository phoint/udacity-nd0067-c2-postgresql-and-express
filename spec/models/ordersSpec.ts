import { OrderStore } from '../../src/models/orders'
import { UserStore } from '../../src/models/user'
import { ProductStore } from '../../src/models/products';

const store = new OrderStore();
const userStore = new UserStore();
const productStore = new ProductStore();

const newUser = {
    username: "johnDoe",
    password: "password123"
}

const product1 = {
    name: "product 1",
    price: 25
}
const product2 = {
    name: "product 2",
    price: 27
}
const product3 = {
    name: "vip product 3",
    price: 47
}
const product4 = {
    name: "vip product 4",
    price: 59
}

beforeEach(async () => {
    // await productStore.create(product1);
    // await productStore.create(product2);
    // await productStore.create(product3);
    // await productStore.create(product4);
}, 1000)

describe('Order Model', () => {
    it('should have show method', () => {
        expect(store.show).toBeDefined()
    });
    it('should have create method', () => {
        expect(store.create).toBeDefined()
    });
    it('should have index method', () => {
        expect(store.index).toBeDefined()
    });
    it('should have add product method', () => {
        expect(store.addProduct).toBeDefined()
    });
    it('should have complete order method', () => {
        expect(store.completeOrder).toBeDefined()
    });
    it('should have get order by user method', () => {
        expect(store.getOrdersByUser).toBeDefined()
    });

    it('create method should add a order', async (done) => {
        const result = await store.create({
            status: 'active',
            userId: 1,
        });
        expect(result).toEqual({
            id: 1,
            userId: 1,
            status: 'active'
        });
        done();
    });

    it('index method should return a list of orders', async (done) => {
        const result = await store.index();
        expect(result).toHaveSize(1)
        expect(result).toEqual([{
            id: 1,
            userId: 1,
            status: "active",
            products: []
        }]);
        done();
    });

    it('show method should return a order', async (done) => {
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            userId: 1,
            status: "active",
            products: []
        });
        done();
    });

    it('add product method should return a order has a product', async (done) => {
        const result = await store.addProduct(3, "1", "1");
        expect(result).toEqual({
            id: 1,
            userId: 1,
            status: "active",
            products: [{
                product: "1",
                quantity: 3
            }]
        });
        done();
    })


    it('complete order method should change the order status', async (done) => {
        const updatedOrder = {
            id: 1,
            userId: 1,
            status: 'completed'
        }
        const result = await store.completeOrder(updatedOrder);
        expect(result).toEqual({
            id: 1,
            userId: 1,
            status: "completed",
            products: []
        });
        done();
    })
})