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
```jsx
const bookObservable$ = //;

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

### withObservable
If your project is not compatible with React hooks (prior to v16.8), then you can always
use the following higher order component
```jsx
const bookObservable$ = //;

const BookPreview = (props) => (
   <article>
       <h1>{props.book.title}</h1>
       <p>{props.book.description}</p>
   </article>
)

export default withObservable('book', bookObservable$)(BookPreview)
```

## Typings
Typescript typings are included in this library.
