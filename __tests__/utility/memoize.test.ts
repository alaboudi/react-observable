import memoize from "../../src/utility/memoize";

describe("memoize", () => {
    it("should return same reference value when supplying same input to the decorated factory function", () => {
        const makeObject = () => ({})
        const memoizedMakeObject = memoize(makeObject);
        const object1 = memoizedMakeObject();
        const object2 = memoizedMakeObject();
        expect(object1).toBe(object2);
    });
    it("should return a new value when supplying different input (with same shape) to the decorated factory function", () => {
        const identity = a => a;
        const memoizedIdentity = memoize(identity);
        const object1 = memoizedIdentity({hi: 'bye'});
        const object2 = memoizedIdentity({hi: 'bye'});
        expect(object1).not.toBe(object2);
    })
    it("should produce a function with the same behavior as the underlying function", () => {
        const add = (a,b) => a + b;
        const memoizedAdd = memoize(add);
        expect(memoizedAdd(2,3)).toBe(5);
    });
})
