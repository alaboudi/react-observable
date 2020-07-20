import {Observable} from "rxjs";
import {publish, refCount} from "rxjs/operators";

const pubRefCountEnhancer = <T>(source$: Observable<T>): Observable<T> => source$.pipe(
    publish(),
    refCount()
);

export default pubRefCountEnhancer;
