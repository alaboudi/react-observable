import { skip } from "rxjs/operators";
import { Observable } from "rxjs";

import resolveSyncEmissionAmount from "../utility/resolve-sync-emission-amount";

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
    const numOfSyncEmissions = resolveSyncEmissionAmount(source$);
    return source$.pipe(
        skip(numOfSyncEmissions)
    );
}

export default skipSync;
