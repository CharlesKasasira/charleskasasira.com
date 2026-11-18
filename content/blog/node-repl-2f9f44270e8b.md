---
title: "Node REPL"
description: "REPL (Read Evaluate Print Loop) is a programming language environment that takes single expression as user input and returns the result back to the…"
date: "2021-08-12T17:22:03.250Z"
updated: "2021-08-12T17:22:03.250Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1638603119938/pDa8e6O65.png"
originalUrl: "https://blog.charleskasasira.com/node-repl-2f9f44270e8b"
---

REPL (Read Evaluate Print Loop) is a programming language environment that takes single expression as user input and returns the result back to the console. REPL is just like the **IDLE** for Python.

*   **Read -**It reads the user’s input and parses it into JavaScript data structure and stores it into memory.
*   **Evaluate -**it evaluates the JavaScript data structure.
*   **Print -**It prints the result of the evaluated data structure.
*   **Loop -**Loops the command until the user exits.

To enter the RELP terminal, you use the node command.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603107094/pIKT8UKM0A.png)

As the console is just like the browser’s console, you can test anything on it. e.g, if you write **1+ 2** it will display the addition of 1 and 2 i.e. **3** in the new line

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603108817/A0j0lOObL.png)

#### Exploring JavaScript objects

Enter the name of a JavaScript class, like `Number`, add a dot and press `tab`.The REPL will print all the properties and methods you can access on that class

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603110567/FGtPJ18ud.png)

You can inspect the globals you have access to by typing `global.` and pressing `tab`

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603112623/SUUTPe8X8.png)

#### The \_ special variable

If after some code you type `_`, that is going to print the result of the last operation.

### Dot commands

The REPL has some special commands, all starting with a dot `.`

*   `.help`: shows the dot commands help
*   `.editor`: enables editor mode, to write multi-line code. Once you are in this mode, enter `Ctrl+D` to run the code you wrote.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603114669/Ad_Bfa9JZ.png)

*   `.break`: when inputting a multi-line expression, entering the `.break` command will abort further input. Same as pressing `Ctrl+C`.
*   `.clear`: resets the REPL context to an empty object and clears any multi-line expression currently being input.
*   `.load`: loads a JavaScript file, relative to the current working directory
*   `.save`: saves all you entered in the REPL session to a file (specify the filename)

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603116355/VMobPOW8P.png)

*   `.exit`: exits the REPL or you can press `Ctrl+C` twice

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1638603118142/D72v61NLf.png)
