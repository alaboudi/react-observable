import {Observable} from "rxjs";

const resolveSyncEmissionAmount = (source$: Observable<any>): number => {
    let numOfSyncEmissions = 0;
    const incrementNumOfSyncEmissions = () => numOfSyncEmissions++;
    const subscription = source$.subscribe(incrementNumOfSyncEmissions);
    subscription.unsubscribe();
    return  numOfSyncEmissions;
}

export default resolveSyncEmissionAmount;
