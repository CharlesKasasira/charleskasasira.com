---
title: "HOW TO: Click outside to close in Javascript"
description: "How to close a modal or any context using HTML, CSS, and vanilla javascript by clicking outside"
date: "2022-01-18T06:10:40.256Z"
updated: "2022-09-22T06:46:51.059Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1663828744471/VbTZZIBF2.png"
originalUrl: "https://blog.charleskasasira.com/how-to-click-outside-to-close-in-javascript"
---

Hey, Charles Kasasira here, time to time, I write 2-minutes packaged articles on *how to* do some cool stuff in web development, and in this short "Do It Yourself", I would like to show you how you too can write a short piece of code using HTML, CSS and vanilla javascript to close a modal or any context by clicking outside, just like twitter's context menu.

[Open the embedded media](https://www.youtube.com/watch?v=5G3usm0LXWw&t=169s)
This might be important in some instances, like
- When you have to implement your own modal.
- When implementing context menus like twitter's context menu.
- It's good UX, that you can click-to-open something, and then not only be able to click that same thing to close it, but click outside to close as well.


![clickOutside.gif](https://cdn.hashnode.com/res/hashnode/image/upload/v1642485414278/ACl9ia5jo.gif)

### HTML: the structure.

```html
    <button onclick="toggleMenu()" class="btn">
        Click to Show
    </button>
    <ul id="menu">
        <li class="menu-item">Edit</li>
        <li class="menu-item">Delete</li>
        <li class="menu-item">Close</li> 
    </ul>
```


For the skeleton of the project, all I needed was a button that will toggle our dropdown on and off, plus an unordered list which will be our dropdown menu.

### CSS: the style

```CSS
.btn{
    background-color: #147;
    color: #fff;
    border: none;
    border-radius: 5px;
    padding: 10px 49px;
    font-weight: 500;
    cursor: pointer;
}

.btn:hover{
    background-color: #148;
}

#menu{
    display: none;
    position: absolute;
    z-index: 1000;
    min-width: 10rem;
    padding: .5rem 0;
    margin: 0;
    font-size: 1rem;
    color: #212529;
    text-align: left;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0,0,0,.15);
    border-radius: .25rem;
}
  
#menu.show {
    display: block;
}

.menu-item{
    padding: 8px 20px;
    cursor: pointer;
}  
```


Went with close to the minimum styles to design the button and #myDropdown for the unordered list which starts with the display as none but is toggled with a show class setting the display to block with an event using javascript, for the behavior. !Important, You need to give the dropdown menu a position of absolute and z-index greater than 1 to appear to the top of other content if there is any.

### JS: the behavior

```js
const menu = document.getElementById("menu");

const toggleMenu = () => menu.classList.toggle("show");

window.onclick = (event) => {
    if (!event.target.matches('.btn')) {
        if(menu.classList.contains('show')){
            menu.classList.remove('show')
        }
    }
}

menu.addEventListener('click', (event) => event.stopPropagation());
```
Lastly, with javascript. I first defined the menu id, then on the toggleMenu() method which I call on click of the button, I toggle, (add or remove) the show class from the menu.

I am using arrow functions here, if you are not used to them, you could use the function declaration or read something about them. And that's it, as always you can have more fun of course with more css for fancy styling plus adding an animation.

Full Source Code: [Github](https://github.com/CharlesKasasira/Articles-Code/tree/master/how-to-click-outside-to-close-in-javascript)

What could I learn from this small feature?. Small as it is, I got to refresh my knowledge of the event.stopPropagation() method. [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation) - The stopPropagation() method of the Event interface prevents further propagation of the current event in the capturing and bubbling phases.


> USE YOUR CODE FOR GOOD. -beau
