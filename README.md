# React Observable
A simple observable binding for your React components.

## Installation
with Yarn
```
yarn install @alaboudi/react-observable
```

with NPM
```
npm install @alaboudi/react-observable
```

## Usage
We have 2 primary APIs in this library: `useObservable` & `withObservable`. They
both enable your component to subscribe to an observable.

### useObservable
```typescript jsx
import { useObservable } from "@alaboudi/react-observable";
import { of } from "rxjs"; 

interface Book {
    title: string;
    description: string;
}

const FAKE_BOOK: Book = {
    title: 'Moby-Dick',
    description: 'A story about a whale 🐋'
};
const bookObservable$ = of(FAKE_BOOK);

const BookPreview = () => {
    const book = useObservable(bookObservable$);
    
    return (
        <article>
            <h1>{book.title}</h1>
            <p>{book.description}</p>
        </article>
    )
}
```
if your observable does not emit a value upon first render, you may pass an optional 2nd parameter as a fallback initial value.

```typescript jsx
    const bookObservable$ = new Subject<Book>();
    const initialFallbackValue = {
        title: 'The Kite Runner',
        description: 'A story about a boy'
    }
    const BookPreview = () => {
        const book = useObservable(bookObservable$, initialFallbackValue);
       
        return (
            <article>
                <h1>{book.title}</h1>
                <p>{book.description}</p>
            </article>
        )
    }
``` 

### withObservable
If your project is not compatible with React hooks (prior to v16.8), then you can always
use the following higher order component
```jsx
const bookObservable$ = new Subject<Book>();
const initialFallbackValue: Book = {
    // 
}

const BookPreview = (props) => (
   <article>
       <h1>{props.book.title}</h1>
       <p>{props.book.description}</p>
   </article>
)

export default withObservable(
    'book',
    bookObservable$,
    initialFallbackValue // optional
)(BookPreview)
```

## Typings
Typescript typings are included in this library.
