import resolveSyncEmissionAmount from "../../src/utility/resolve-sync-emission-amount";
import {BehaviorSubject, of, timer} from "rxjs";

describe("resolveSyncEmissionAmount", () => {
    it("should return 1 when loaded with a BehaviorSubject", () => {
        const source$ = new BehaviorSubject("hehe");
        const numberOfEmissions = resolveSyncEmissionAmount(source$);
        expect(numberOfEmissions).toBe(1);
    });

    it("should return 3 when loaded with 3 sync values", () => {
        const source$ = of(1, 2, 3);
        const numberOfEmissions = resolveSyncEmissionAmount(source$);
        expect(numberOfEmissions).toBe(3);
    });

    it("should return 0 when loaded with an async observable", () => {
        const source$ = timer(1000);
        const numberOfEmissions = resolveSyncEmissionAmount(source$);
        expect(numberOfEmissions).toBe(0);
    })
});
