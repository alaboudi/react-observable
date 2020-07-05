import { createFactory, Component, ComponentClass, ComponentType} from "react";
import { Observable, Subscription } from "rxjs";
import skipSync from "./operators/skip-sync";
import getLastSyncEmission from "./utility/get-last-sync-emission";

const resolveInitialValue = <T>(source$: Observable<T>, initialValue?: T): (T | undefined) => {
    const lastSyncEmission = getLastSyncEmission(source$);
    return typeof lastSyncEmission === 'undefined' ? initialValue : lastSyncEmission;
}

const withObservable = <T>(propName: string, source$: Observable<T>, initialValue?: T) => <P>(BaseComponent: ComponentType<P>) => {
    const factory = createFactory(BaseComponent as ComponentClass<P>);

    return class extends Component<P, { emittedValue?: T }> {
        subscription: Subscription | undefined;
        constructor(props: P) {
            super(props);
            this.state = {emittedValue: resolveInitialValue(source$, initialValue)};
        }

        setObservableValue(val: T) {
            this.setState({emittedValue: val});
        }

        componentDidMount() {
            this.subscription = source$
                .pipe(skipSync)
                .subscribe(this.setObservableValue);
        }

        componentDidUpdate() {
            this.subscription?.unsubscribe();
            this.subscription = source$
                .pipe(skipSync)
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
