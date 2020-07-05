import {Observable} from "rxjs";

const getLastSyncEmission = <T>(source$: Observable<T>): (T | undefined) => {
    let value: T;
    const subscription = source$.subscribe(v => value = v);
    subscription.unsubscribe();
    return value;
}

export default getLastSyncEmission;
