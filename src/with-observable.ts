import { createFactory, Component, ComponentClass, ComponentType} from "react";
import { Observable, Subscription } from "rxjs";
import getLastSyncEmission from "./utility/get-last-sync-emission";
import survivableShare from "./operators/survivable-share";

const resolveInitialValue = <T>(source$: Observable<T>, initialValue?: T): (T | undefined) => {
    const lastSyncEmission = getLastSyncEmission(source$);
    return typeof lastSyncEmission === 'undefined' ? initialValue : lastSyncEmission;
}

const withObservable = <T>(propName: string, source$: Observable<T>, initialValue?: T) => <P>(BaseComponent: ComponentType<P>) => {
    const factory = createFactory(BaseComponent as ComponentClass<P>);
    const enhancedSource$ = source$.pipe(survivableShare(1));

    return class extends Component<P, { emittedValue?: T }> {
        subscription: Subscription | undefined;
        constructor(props: P) {
            super(props);
            this.state = {emittedValue: resolveInitialValue(enhancedSource$, initialValue)};
        }

        setObservableValue(val: T) {
            this.setState({emittedValue: val});
        }

        componentDidMount() {
            this.subscription = enhancedSource$
                .subscribe(this.setObservableValue);
        }

        componentWillUnmount() {
            this.subscription?.unsubscribe();
        }

        render() {
            return factory({
                ...this.props,
                [propName]: this.state.emittedValue
            });
        }
    }
}

export default withObservable;
