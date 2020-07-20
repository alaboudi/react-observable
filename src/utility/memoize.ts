const areInputsEqual = (newInputs: readonly unknown[], oldInputs: readonly unknown[]): boolean => {
    if (newInputs.length !== oldInputs.length) {
        return false;
    }
    for(let i = 0; i < newInputs.length; i++) {
        if(newInputs[i] !== oldInputs[i]) {
            return false;
        }
    }
    return true;
}

export default function memoizeOne<
    ResultFn extends (this: any, ...newArgs: any[]) => ReturnType<ResultFn>
    >(resultFn: ResultFn): ResultFn {
    let lastThis: unknown;
    let lastArgs: unknown[] = [];
    let lastResult: ReturnType<ResultFn>;
    let calledOnce: boolean = false;

    // breaking cache when context (this) or arguments change
    function memoized(this: unknown, ...newArgs: unknown[]): ReturnType<ResultFn> {
        if (calledOnce && lastThis === this && areInputsEqual(newArgs, lastArgs)) {
            return lastResult;
        }

        // Throwing during an assignment aborts the assignment: https://codepen.io/alexreardon/pen/RYKoaz
        // Doing the lastResult assignment first so that if it throws
        // nothing will be overwritten
        lastResult = resultFn.apply(this, newArgs);
        calledOnce = true;
        lastThis = this;
        lastArgs = newArgs;
        return lastResult;
    }

    return memoized as ResultFn;
}
