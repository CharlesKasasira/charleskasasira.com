---
title: "Introduction to the Node Package Manager"
description: "npm is the default package manager for the JavaScript runtime environment Node.js. It was developed by Isaac Z. Schlueter, written entirely in JavaScript…"
date: "2021-08-23T14:06:12.665Z"
updated: "2021-08-23T14:06:12.665Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1638603075969/Z7pt1nUFE.png"
originalUrl: "https://blog.charleskasasira.com/introduction-to-the-node-package-manager-ac6c3a23d148"
---

npm is the default package manager for the JavaScript runtime environment [Node.js](https://en.wikipedia.org/wiki/Node.js "Node.js"). It was developed by Isaac Z. Schlueter, written entirely in JavaScript. npm comes with node.js. [**Yarn**](https://yarnpkg.com/en/) and [**pnpm**](https://pnpm.js.org/) are alternatives to npm cli.

It consists of a command line client, also called npm, and an online database of public and paid-for private packages, called the npm registry. The registry is accessed via the client, and the available packages can be browsed and searched via the [npm website](https://www.npmjs.com/). The package manager and the registry are managed by npm, Inc.

To check which version of the package manager is installed on your computer use `npm -v`

`npm` manages downloads of dependencies of your project.

#### Installing all dependencies

If a project has a `package.json` file, by running `npm install` it will install everything the project needs, in the `node_modules` folder, creating it if it's not existing already.

#### Installing a single package

You can also install a specific package. Furthermore, since npm 5, this command adds `<package-name>` to the `package.json` file *dependencies*.

npm install <package-name>

#### Updating packages

npm update

npm will check all packages for a newer version that satisfies your versioning constraints.

You can specify a single package to update as well:

npm update <package-name>

#### Running Tasks

The package.json file supports a format for specifying command line tasks that can be run by using

npm run <task-name>
