import {of, timer} from "rxjs";
import getLastSyncEmission from "../../src/utility/get-last-sync-emission";

describe("getLastSyncEmission", () => {
   it("should return 1 when observable source is created with `of(1)`", () => {
       const source$ = of(1);
       const lastEmission = getLastSyncEmission(source$);
       expect(lastEmission).toBe(1);
   })

    it("should return 8 when observable source is created with `of(4,8)`", () => {
        const source$ = of(4, 8);
        const lastEmission = getLastSyncEmission(source$);
        expect(lastEmission).toBe(8);
    })

    it("should return undefined when observable source is async", () => {
        const source$ = timer(1000);
        const lastEmission = getLastSyncEmission(source$);
        expect(lastEmission).toBeUndefined();
    })
});
