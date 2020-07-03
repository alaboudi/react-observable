import { createFactory, Component, ComponentClass, ComponentType} from "react";
import { Observable, Subscription } from "rxjs";
import skipSync from "./operators/skip-sync";

const resolveInitialValue = <T>(source$: Observable<T>, initialValue?: T): (T | undefined) => {
    let value: T;
    const subscription = source$.subscribe(v => value = v);
    subscription.unsubscribe();
    return typeof value === 'undefined' ? initialValue : value;
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
