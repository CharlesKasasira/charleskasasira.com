---
title: "Output to the command Line using Node.js"
description: "Node.js provides a console module which provides tons of very useful ways to interact with the command line. It is basically the same as the console you…"
date: "2021-08-12T18:13:20.949Z"
updated: "2021-08-12T18:13:20.949Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1638603100327/uY7Jyl2Zr.png"
originalUrl: "https://blog.charleskasasira.com/output-to-the-command-line-using-node-js-6a43cfcd3db7"
---

Node.js provides a console module which provides tons of very useful ways to interact with the command line. It is basically the same as the console you find in the browser.

The most basic and most used method is `console.log()`, which prints the string you pass to it to the console.

We can also format pretty phrases by passing variables and a format specifier.

*   `%s` format a variable as a string
*   `%d` format a variable as a number
*   `%i` format a variable as its integer part only
*   `%o` format a variable as an object

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603093519/AffsE-LWW.png)

`console.clear()` clears the console (the behavior might depend on the console used)

`console.count()` counts the number of times a string is printed, and prints the count next to it:

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603095246/kGUBhMD-N.png)

The `console.countReset()`method resets counter used with console.count().

Print the stack trace

There might be cases where it’s useful to print the call stack trace of a function, maybe to answer the question *how did you reach that part of the code?*

You can do so using `console.trace()`:

Calculate the time spent

You can easily calculate how much time a function takes to run, using `time()` and `timeEnd()`

The simplest way to go about coloring the console output is by using a library. [Chalk](https://github.com/chalk/chalk) is such a library, and in addition to coloring it also helps with other styling facilities, like making text bold, italic or underlined.

You install it with `npm install chalk`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603096939/9cH4wv05j.png)

Create a progress bar

[Progress](https://www.npmjs.com/package/progress) is an awesome package to create a progress bar in the console. Install it using `npm install progress`

This snippet creates a 10-step progress bar, and every 100ms one step is completed.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603098639/kaWyYT727.png)
