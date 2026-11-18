---
title: "Cheat sheet: Arrays in JavaScript"
description: "JavaScript Arrays are a very flexible data structure and are used as lists, stacks, queues, etc. Every value in an array is associated with a numeric index…"
date: "2022-01-22T13:57:59.723Z"
updated: "2022-05-19T08:18:33.531Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1649419834262/6U-DEQyOs.png"
originalUrl: "https://blog.charleskasasira.com/cheat-sheet-arrays-in-javascript"
---

JavaScript Arrays are a very flexible data structure and are used as lists, stacks, queues, etc. Every value in an array is associated with a numeric index starting with 0. Here is everything you need to get started with arrays


## Using Arrays

How to create an array.

```js
//1. using array literals
const arrayName = [1, 2, 3, 4]

//2. Using array constructor
const arrayName = new Array.from("foo")
```

How to read from an array

```js
const arrayName = [1, 2, 3, 4]

//1. Using array indices
arrayName[0] // this returns a value at index 0 of the array.
console.log(arrayName[0]) // Output: 1

//2. Using the at() method
console.log(arrayName.at(-1)) // Output: 4
```

*When reading from an array using indices, negative indices don’t work while when using the at() method, you can use a negative or positive index.*

How to update an array

```js
const arrayName = [1, 2, 3, 4];
arrayName[0] = 9; // this will change the value at index one to 9
console.log(arrayName); // Output: [9, 2, 3, 4]
```

How to determine the length of an array

```js
const arrayName = [1, 2, 3, 4];
// use the length method
console.log(arrayName.length); //Output: 4
```

How to write to an array (adding elements)

```js
// add an element to the end of the array
arrayName.push(4);

// alternatively, you could add an element at indices of the length of the array.
arrayName[arrayName.length] = 4;

// add element(s) to the beginning of the array
arrayName.unshift(element);
```

How to remove an element from an Array

```js
// remove the last element
arrayName.pop();

// leaves only elements at a specified length of an array
arrayName.length = 1;

// to remove all elements
arrayName.length = 0;

// removes an element at index 0
arrayName.shift();
```

How to concatenate arrays

```js
const arr1 = [1, 2, 3]
const arr2 = [4, 5, 6]

// using the spread operator
const arr3 = […arr1, …arr2]
console.log(arr3) // Output: [1, 2, 3, 4, 5, 6]

// using the concat() method
const arr3 = arr1.concat(arr2)
console.log(arr3) // Output: [1, 2, 3, 4, 5, 6]
```

## Array methods

slice()
```repl
> ['■','●','▲'].slice(1, 3)
['●','▲']
```

filter()

```repl
> ['■','●','■'].filter(x => x==='■')
['■','■']
```

map()
```repl
> ['▲','●'].map(x => x+x)
> ['▲▲','●●']
```

flatMap()
```repl
> ['▲','●'].flatMap(x => [x,x])
> ['▲','▲','●','●']
```

splice()
```repl
> ['■','●','▲'].some(x => x==='●')
> true
```

some()
```repl
> ['■','●','▲'].every(x => x==='●')
true
```

every()
```repl
> ['■','●','▲'].every(x => x==='●')
false
```

join()
```
> ['■','●','▲'].join('-')
'■-●-▲'
```

reduce()
```repl
> ['■','●'].reduce((result,x) => result+x, '▲')
'▲■●'
```

reduceRight()
```repl
> ['■','●'].reduceRight((result,x) => result+x, '▲')
'▲●■'
```

fill()
```repl
> ['■','●','▲'].fill('●')
['●','●','●']
```

sort()
```repl
> ['■','●','■'].sort()
['■','■','●']
```

reverse()
```repl
> ['■','●','▲'].reverse()
['▲','●','■']
```

includes()
```repl
> ['■','●','■'].includes('■')
true
```

indexOf()
```repl
> ['■','●','■'].indexOf('■')
0
```

lastIndexOf()
```repl
> ['■','●','■'].lastIndexOf('■')
2
```

find()
```repl
> ['■','●','■'].find(x => x==='■')
'■'
```

findIndex()
```repl
> ['■','●','■'].findIndex(x => x==='■')
0
```

Hope you found this helpful.
