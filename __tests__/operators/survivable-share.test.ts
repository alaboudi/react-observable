import {of} from "rxjs";
import survivableShare from "../../src/operators/survivable-share";

describe("survivableShare", () => {
    describe("when given a survival count of 0 as input", () => {
        it("should provide a subscribable observable", () => {
            let hasSubscribed = false;
            const source$ = of(1).pipe(survivableShare(0));
            source$.subscribe(() => hasSubscribed = true);
            expect(hasSubscribed).toBe(true);
        });
    });
    describe("when given a survival count of 1 as input", () => {
        it("should provide a shared stream that does not resubscribe to source after not having subscribers for the first time", () => {
            let value = 0;
            const source$ = of(1, 2, 3);
            const shared$ = source$.pipe(survivableShare(1));
            shared$.subscribe(() => {value++;});
            shared$.subscribe(() => {value++;});
            expect(value).toBe(3);
        });
        it("should provide a shared stream that resubscribes to the source after all observes unsubscribe for the second time", () => {
            let value = 0;
            const source$ = of(1,2,3);
            const shared$ = source$.pipe(survivableShare(1));
            shared$.subscribe(() => {value++;});
            shared$.subscribe(() => {value++;});
            shared$.subscribe(() => {value++;});
            expect(value).toBe(6);
        });
    });
});
