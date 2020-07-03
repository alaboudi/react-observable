import {useState, useEffect} from "react";
import {Observable} from "rxjs";
import skipSync from "./operators/skip-sync";

const resolveInitialValue = <T>(source$: Observable<T>, initialValue?: T): (T | undefined) => {
    let value: T;
    const subscription = source$.subscribe(v => value = v);
    subscription.unsubscribe();
    return typeof value === 'undefined' ? initialValue : value;
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
