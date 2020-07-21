import {MonoTypeOperatorFunction, Observable } from "rxjs";
import {useEffect, useState} from "react";
import memoize from "./utility/memoize";
import getLastSyncEmission from "./utility/get-last-sync-emission";
import survivableShare from "./operators/survivable-share";

const resolveInitialValue = <T>(source$: Observable<T>, operatorFunction: MonoTypeOperatorFunction<T>, initialValue?: T): (T | undefined) => {
    const enhancedSource$ = operatorFunction(source$);
    const lastSyncEmission = getLastSyncEmission(enhancedSource$);
    return lastSyncEmission === undefined ? initialValue : lastSyncEmission;
}

const useObservable = <T>(source$: Observable<T>, initialValue?: T): T => {
    const [operatorFunction] = useState(() => memoize(
        survivableShare(1) as MonoTypeOperatorFunction<T>)
    );

    const [emittedValue, setEmittedValue] = useState<T>(() => resolveInitialValue(
        source$,
        operatorFunction,
        initialValue
    ));

    useEffect(() => {
        const enhancedSource$ = operatorFunction(source$);
        const subscription = enhancedSource$.subscribe(setEmittedValue);
        return () => subscription.unsubscribe();
    }, [source$, setEmittedValue, operatorFunction]);

    return emittedValue;
};

export default useObservable;
