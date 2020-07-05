import { BehaviorSubject } from "rxjs";
import skipSync from "../../src/operators/skip-sync";

describe('skip-sync', () => {
    it("should skip over value initially provided by a BehaviorSubject", () => {
        let numberOfEmissions = 0;
        const incrementEmissions = () => numberOfEmissions++
        const source$ = new BehaviorSubject(1);
        const subscription = source$.pipe(skipSync).subscribe(incrementEmissions);
        subscription.unsubscribe();
        expect(numberOfEmissions).toBe(0);
    });

    it("should not skip over the second emission", () => {
        let numberOfEmissions = 0;
        const incrementEmissions = () => numberOfEmissions++
        const source$ = new BehaviorSubject(1);
        const subscription = source$.pipe(skipSync).subscribe(incrementEmissions);
        source$.next(1)
        subscription.unsubscribe();
        expect(numberOfEmissions).toBe(1);
    })
});
