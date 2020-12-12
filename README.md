A tiny hook (2 KB gzipped) that make router.query and router.pathname available on first-render


### Motivation
Current Next.js router have a few issues on client side, 
the router.query object and router.pathname string isn't available on first-render,
that cause issues if your code isn't designed with that in mind. 
I have suffered that problems specially on hooks that fetch data based on the query params

## Install
Install as project dependency:

```bash
npm i use-client-router
```

```bash
yarn add use-client-router
```

## ✨ Features
- router.query object populated on the very first-render
- router.pathname string available on first-render  
- same interface of Next.js router

### Usage example

Consider the following page **pages/post/[pid].js**

```
├── pages
│   ├── post/[pid].js
```

```js
import { useClientRouter } from "use-client-router";

const Post = () => {
    const router = useClientRouter(); // instead of useRouter from Next.js
    
    // without useClientRouter on first render the { pid } would be undefined
    const { pid } = router.query;
    
    // without useClientRouter on first render the pathaname would be undefined
    const pathname = router.pathname;

    return <p>Post: {pid}</p>
}

export default Post
```

Summary: replace useRouter() in your code with useClientRouter()