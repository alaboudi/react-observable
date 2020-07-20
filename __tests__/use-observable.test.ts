import { of, Subject, timer } from "rxjs";
import { renderHook, act } from '@testing-library/react-hooks'
import useObservable from "../src/use-observable";
import {tap} from "rxjs/operators";

describe('useObservable', () => {
    it("should return a value when loaded with a single valued synchronous observable", () => {
        const source$ = of(10);
        const { result } = renderHook(() => useObservable(source$));
        const observableValue = result.current;
        expect(observableValue).toBe(10);
    });

    it("should return the last emitted value when loaded with a stream of synchronous observable", () => {
        const source$ = of(1, 2, 3, 4);
        const { result } = renderHook(() => useObservable(source$));
        expect(result.current).toBe(4);
    });

    it("should return undefined when loaded with an asynchronous function", () => {
        const source$ = timer(1000);
        const { result } = renderHook(() => useObservable(source$));
        expect(result.current).toBe(undefined);
    });

    it("should update when the observable fires with the emitted value", () => {
        const source$ = new Subject();
        const { result } = renderHook(() => useObservable(source$));
        act(() => {source$.next(10);})
        expect(result.current).toBe(10);
    });

    it("should unsubscribe from the observable when unmounted", () => {
        const source$ = new Subject();
        const { result, unmount } = renderHook(() => useObservable(source$));
        act(() => {source$.next(1)});
        act(() => {source$.next(2)});
        unmount();
        act(() => {source$.next(3)});
        expect(result.current).toBe(2);
    });

    it("should unsubscribe from the observable if a new observable is provided", () => {
        const source1$ = new Subject();
        const source2$ = new Subject();
        const { result, rerender } = renderHook(({ source$ }) => useObservable(source$), {
            initialProps: { source$: source1$ }
        });

        act(() => {source1$.next(1)});
        act(() => {source1$.next(2)});
        rerender({ source$: source2$ });
        act(() => {source1$.next(3)});
        expect(result.current).toBe(2);
    });

    it("should subscribe to newly provided observable if a new observable is provided", () => {
        const source1$ = new Subject();
        const source2$ = new Subject();
        const { result, rerender } = renderHook(({ source$ }) => useObservable(source$), {
            initialProps: { source$: source1$ }
        });

        act(() => {source1$.next(1)});
        act(() => {source1$.next(2)});
        rerender({ source$: source2$ });
        act(() => {source2$.next(3)});
        expect(result.current).toBe(3);
    });

    it("should return the last emitted value from the newly supplied stream of synchronous observable", () => {
        const source1$ = of(1, 2, 3, 4);
        const source2$ = of(5, 6, 7, 8);
        const { result, rerender } = renderHook(({ source$ }) => useObservable(source$), {
            initialProps: { source$: source1$ }
        });
        rerender({ source$: source2$ })
        expect(result.current).toBe(8);
    });

    it("should maintain the last emitted value from the previous stream when supplied with a new async stream", () => {
        const source1$ = of(1, 2, 3, 4);
        const source2$ = timer(1000);
        const { result, rerender } = renderHook(({ source$ }) => useObservable(source$), {
            initialProps: { source$: source1$ }
        });
        rerender({ source$: source2$ })
        expect(result.current).toBe(4);
    });

    it("should return emitted values when supplied with a new observable stream", () => {
        const source1$ = of(1, 2, 3, 4);
        const source2$ = new Subject<number>();
        const { result, rerender } = renderHook(({ source$ }) => useObservable(source$), {
            initialProps: { source$: source1$ }
        });
        rerender({ source$: source2$ });
        act(() => { source2$.next(5)})
        expect(result.current).toBe(5);
    });

    it("should fallback to initial value initial value if present and if observable is async", () => {
        const source$ = timer(1000);
        const initialFallbackValue = 5;
        const { result } = renderHook(() => useObservable(source$, initialFallbackValue));
        expect(result.current).toBe(initialFallbackValue);
    });

    it("should ignore the initial fallback value if observable stream is synchronous", () => {
        const source$ = of(1, 2, 3);
        const initialFallbackValue = 5;
        const { result } = renderHook(() => useObservable(source$, initialFallbackValue));
        expect(result.current).toBe(3);
    });

    it("source stream should only detect 1 subscription", () => {
        let numberOfEmissions = 0;
        const source$ = of(1).pipe(
            tap(() => numberOfEmissions++)
        );

        const { result } = renderHook(() => useObservable(source$));
        expect(numberOfEmissions).toBe(1)
    });
});
