---
title: "HOW TO: Create a dynamic avatar from the user's initials pure Javascript."
description: "Hey, am Charles Kassira and in this short \"Do It Yourself\", I would like to show you how to write a short piece of code using HTML, CSS, and vanilla…"
date: "2022-01-13T06:29:32.216Z"
updated: "2022-01-13T06:29:32.216Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1642054548685/Ek0kEz7bv.png"
originalUrl: "https://blog.charleskasasira.com/how-to-create-a-dynamic-avatar-from-the-users-initials-pure-javascript"
---

Hey, am Charles Kassira and in this short "Do It Yourself", I would like to show you how to write a short piece of code using HTML, CSS, and vanilla javascript to create dynamic avatars from the user’s initials. Which you can see commonly used on platforms like Trello, Gmail before a user uploads an avatar. 


![dyamic avatar.png](https://cdn.hashnode.com/res/hashnode/image/upload/v1642054548685/Ek0kEz7bv.png)

### Why did I want to solve it

During a project I was lucky to work on, I was tasked to create this small feature, a dynamic avatar because the users on this particular system didn’t usually update their profile picture, so I had to create one from the initials of their display names, (the female and male avatar placeholders are not fun anymore) hence this post.

Since I was using react js for the project, I wrote the original component in react js but I figured that since it’s relatively a few lines of code, I would write it in vanilla javascript for those that are anti-react plus if you can do it in vanilla, you definitely can do it in any js library or framework.

### HTML: the structure
In the HTML file, I only created a div with an id of avatar and that's all.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dynamic Avatar</title>
</head>
<body>
    <!-- div for the avatar -->
    <div id="avatar"></div>
</body>
</html>
```


### CSS: The style
I went with the minimal styling since most avatars are circular, I gave it a uniform width and height and then a 50% border-radius, then to make sure that the initials are always at the center, I gave it a display of flex then aligned its items to the center.

```css
#avatar{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: gray;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
    }
```

### JS: The behavior

And finally, with javascript, the big part is to get the first letter of each name in the string. For the first initial, all you have to do is get the character at index zero, then consider that the second name starts after the first space and get the character at index zero of the string after the space.


```js
const avatar = document.getElementById('avatar')
const username = 'Charles Kasasira' // will be fetching the username, just used my to illustrate
const firstNameInitial = username[0]
const secondNameInitial = username.split(' ')[1].split('')[0]
avatar.innerHTML= firstNameInitial + secondNameInitial
```

And that's it, you can make it more fun with random colors for different users and add more CSS for fancy styling to make it better.

What did I learn from this small feature?. 

Small as it is, this was my first approach to this problem and I got to learn that even a simple solution may be hard if you don’t think of breaking it down to the simplest parts. All I had to do here was create a circle, split a string, and display the index zero of the different chunks of the name. I hope you learned one or two things. 

As beau says, 
> USE YOUR CODE FOR GOOD.
