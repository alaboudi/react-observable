import {useState, useEffect} from "react";
import {Observable} from "rxjs";

const useObservable = <T>(source$: Observable<T>, initialValue?: T) => {
    const [emittedValue, setEmittedValue] = useState<T>(initialValue);

    useEffect(() => {
        const subscription = source$.subscribe(setEmittedValue);
        return () => subscription.unsubscribe();
    }, [source$]);

    return emittedValue;
}

export default useObservable;
