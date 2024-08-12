import { ProductStore } from '../../src/models/products'

const store = new ProductStore()

describe('Product Model', () => {
    it('should have show method', () => {
        expect(store.show).toBeDefined()
    });
    it('should have create method', () => {
        expect(store.create).toBeDefined()
    });
    it('should have index method', () => {
        expect(store.index).toBeDefined()
    });
    it('should have top method', () => {
        expect(store.top).toBeDefined()
    });

    it('create method should add a product', async (done) => {
        const result = await store.create({
            name: 'test product',
            price: 25,
        });
        expect(result).toEqual({
            id: 1,
            name: "test product",
            price: 25
        });
        done();
    });

    it('index method should return a list of products', async (done) => {
        const result = await store.index();
        expect(result).toHaveSize(1)
        expect(result).toEqual([{
            id: 1,
            name: "test product",
            price: 25
        }]);
        done();
    });

    it('show method should return a product', async (done) => {
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            name: "test product",
            price: 25
        });
        done()
    });
})