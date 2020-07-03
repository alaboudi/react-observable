import { share } from "rxjs/operators";
import { Observable } from "rxjs";

const noop = () => {}

const skipSync = <T>(source$: Observable<T>): Observable<T> => {
    const shared$ = source$.pipe(share());
    const subscription = shared$.subscribe(noop);
    subscription.unsubscribe();
    return shared$;
}

export default skipSync;
