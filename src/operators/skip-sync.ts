import { share } from "rxjs/operators";
import { Observable } from "rxjs";

/**
 * This operator skips all synchronously emitted values from an observable.
 *
 * @example
 * const source$ = new BehaviorSubject<number>(1);
 * const noSyncSource$ = source$.pipe(skipSync);
 *
 * source$.subscribe(console.log);
 * noSyncSource$.subscribe(console.log)
 * source$.next(2);
 *
 * // source$ observer will log 1 & 2
 * // noSycSource$ will only log 2
 *
 * @param {Observable<T>} source$
 * @return {Observable<T>}
 */
const skipSync = <T>(source$: Observable<T>): Observable<T> => {
    const noop = () => {}
    const shared$ = source$.pipe(share());
    const subscription = shared$.subscribe(noop);
    subscription.unsubscribe();
    return shared$;
}

export default skipSync;
