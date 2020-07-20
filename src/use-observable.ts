import {Observable, OperatorFunction} from "rxjs";
import {useEffect, useState} from "react";
import memoize from "./utility/memoize";
import getLastSyncEmission from "./utility/get-last-sync-emission";
import pubRefCountEnhancer from "./utility/enhance-pub-refcount";

const resolveInitialValue = <T>(source$: Observable<T>, enhancer: OperatorFunction<T, T>, initialValue?: T): (T | undefined) => {
    const enhancedSource$ = enhancer(source$);
    const lastSyncEmission = getLastSyncEmission(enhancedSource$);
    return lastSyncEmission === undefined ? initialValue : lastSyncEmission;
}

const useObservable = <T>(source$: Observable<T>, initialValue?: T): T => {
    const [enhancer] = useState(() => memoize(pubRefCountEnhancer))
    const [emittedValue, setEmittedValue] = useState<T>(() => resolveInitialValue(source$, enhancer, initialValue));

    useEffect(() => {
        const enhancedSource$ = enhancer(source$);
        const subscription = enhancedSource$.subscribe(setEmittedValue);
        return () => subscription.unsubscribe();
    }, [source$, setEmittedValue, enhancer]);

    return emittedValue;
};

export default useObservable;
