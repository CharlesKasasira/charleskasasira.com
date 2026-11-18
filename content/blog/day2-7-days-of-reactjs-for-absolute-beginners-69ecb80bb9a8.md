---
title: "Day2: 7 days of Reactjs for absolute beginners."
description: "Day2: 7 days of Reactjs for absolute beginners. On the second day of reactjs, I share one of the most important concepts of react, components. A component…"
date: "2021-10-30T10:31:13.968Z"
updated: "2021-12-07T07:01:34.322Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1638603054859/mtApbxtwM.png"
originalUrl: "https://blog.charleskasasira.com/day2-7-days-of-reactjs-for-absolute-beginners-69ecb80bb9a8"
---

**Day2: 7 days of Reactjs for absolute beginners.**

On the second day of reactjs, I share one of the most important concepts of react, components. A component is like a javascript function that has a specific functionality.

> Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.

There are two types of components, class and functional-based components

**Class components**

Class components are defined using the ES6 class. This was the only way of creating components before function components. But for now, I will be focused on the Functional based components which are easier and better with the use of [hooks](https://reactjs.org/docs/hooks-intro.html).

**Functional based components**

Functional components were introduced in React v16.8. They can take in props (properties) just like parameters in javascript and may return HTML (using JSX) telling the browser how the UI should look like.

When writing a component name, It's best to use a title case.

```js
function ComponentName(){  
 return <h1>Hello, world</h1>  
}
```

The above component is similar to this class component

```js
import React from 'react'

class ComponentName extends React.component{  
   render(){  
      return <h1>Hello, world</h1>  
   }  
}
```

A React project usually contains many components which can interact with each other. To make a component accessible by another, you will need to expose it and later on import it.

```js
//ComponentOne.js

function ComponentOne(){  
    return <h1>Hello, world</h1>  
}

export default ComponentOne;
```

```js
ComponentTwo.js

import ComponentOne from './ComponentOne'

function ComponentTwo(){  
     return (  
          <ComponentOne />  
     )  
}

export default ComponentTwo;
```

Conclusion   
One of the pros of React is the reusability of components. I did mention props but more of that and state in another part of the 7days.

Happy coding.
