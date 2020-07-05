import {useState, useEffect} from "react";
import {Observable} from "rxjs";
import skipSync from "./operators/skip-sync";
import getLastSyncEmission from "./utility/get-last-sync-emission";

const resolveInitialValue = <T>(source$: Observable<T>, initialValue?: T): (T | undefined) => {
    const lastSyncEmission = getLastSyncEmission(source$);
    return typeof lastSyncEmission === 'undefined' ? initialValue : lastSyncEmission;
}

const useObservable = <T>(source$: Observable<T>, initialValue?: T): T => {
    const [emittedValue, setEmittedValue] = useState<T>(() => resolveInitialValue(source$, initialValue));

    useEffect(() => {
        const sourceWithoutSync$ = source$.pipe(skipSync);
        const subscription = sourceWithoutSync$.subscribe(setEmittedValue);
        return () => subscription.unsubscribe();
    }, [source$]);

    return emittedValue;
}

export default useObservable;
