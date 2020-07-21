import {Observable, Subject, Subscription} from "rxjs";

function survivableShare<T>(survivalCount: number) {
    let subject: Subject<T> | undefined;
    let refCount = 0;
    let deathCount = 0;
    let subscription: Subscription | undefined;

    return (source$: Observable<T>) => new Observable(observer => {
        refCount++;
        let innerSubscription: Subscription;
        if(!subscription) {
            subject = new Subject<T>();
            innerSubscription = subject.subscribe(observer);
            subscription = source$.subscribe({
                next(value) { subject.next(value); },
                error(err) { subject.error(err); },
                complete() { subject.complete(); }
            });
        } else {
            innerSubscription = subject.subscribe(observer);
        }

        return function teardown() {
            refCount--;
            innerSubscription.unsubscribe();
            if(refCount === 0) {
                deathCount++;
                if(deathCount > survivalCount) {
                    subscription.unsubscribe();
                    deathCount = 0;
                    subscription = undefined;
                    subject = undefined;
                }
            }
        }
    });
}

export default survivableShare;
