import { UserStore } from "../../src/models/user";

const store = new UserStore()

describe('User Model', () => {
    it('should have show method', () => {
        expect(store.show).toBeDefined()
    });
    it('should have create method', () => {
        expect(store.create).toBeDefined()
    });
    it('should have index method', () => {
        expect(store.index).toBeDefined()
    });
    it('should have authenticate method', () => {
        expect(store.authenticate).toBeDefined()
    });

    it('create method should add a user', async (done) => {
        const result = await store.create({
            username: 'johnDoe',
            password: 'password123',
        });
        expect(result.id).toEqual(1);
        expect(result.username).toEqual('johnDoe');
        expect(result.password).not.toEqual('password123');
        done();
    });

    it('index method should return a list of users', async (done) => {
        const result = await store.index();
        expect(result).toHaveSize(1)
        expect(result).toEqual([{
            id: 1,
            username: 'johnDoe',
            firstName: undefined,
            lastName: undefined,
        }]);
        done();
    });

    it('show method should return a user', async (done) => {
        const result = await store.show("1");
        expect(result).toEqual({
            id: 1,
            username: 'johnDoe',
            firstName: undefined,
            lastName: undefined,
        });
        done()
    });

    it('authenticate method should return null when wrong password', async (done) => {
        const username = 'johnDoe';
        const password = 'password456'
        const result = await store.authenticate(username, password);
        expect(result).toBeNull();
        done()
    });

    it('authenticate method should return a user when correct password', async (done) => {
        const username = 'johnDoe';
        const password = 'password123'
        const result = await store.authenticate(username, password);
        expect(result).toEqual({
            id: 1,
            username: 'johnDoe',
        });
        done()
    });
})