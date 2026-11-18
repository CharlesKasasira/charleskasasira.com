---
title: "Semantic Versioning, what you should know."
description: "Semantic Versioning (SemVer), is an industry-standard for software versioning aiming to make it easier to manage dependencies. Semantic Versioning works by…"
date: "2021-09-22T10:36:30.856Z"
updated: "2021-09-22T10:36:30.856Z"
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1638603069746/Gj2iIS2zP.png"
originalUrl: "https://blog.charleskasasira.com/semantic-versioning-what-you-should-know-4beb159e9365"
---

Semantic Versioning (SemVer), is an industry-standard for software versioning aiming to make it easier to manage dependencies. Semantic Versioning works by structuring each version identifier into three parts, “MAJOR.MINOR.PATCH” notation.

Why SemVer?

*   You can keep track of every transition in the software development phase.
*   Versioning can do the job of explaining to the developers what type of changes have taken place and the possible updates that should take place in the software.
*   It helps to keep things clean and meaningful.
*   It helps other people who might be using your project as a dependency.

Each of these parts is managed as a number and incremented according to the following rules:

*   PATCH is incremented for bug fixes or other changes that do not change the behaviour of the API.
*   MINOR is incremented for backward-compatible changes of the API, meaning that existing consumers can safely ignore such a version change.
*   MAJOR is incremented for breaking changes, i.e. for changes that are not within the backwards compatibility scope. Existing consumers have to adapt to the new API, very likely by adapting their code.

More should know

~(tilde): will update you to all future patch versions, without incrementing the minor version. ~1.2.3 will use releases from 1.2.3 to <1.3.0.

^(caret): will update you to all future minor/patch versions, without incrementing the major version. ^2.3.4 will use releases from 2.3.4 to < 3.0.0

The first version starts at 0.1.0 and not at 0.0.1, as no bug fixes have taken place, rather we start with a set of features as the first draft of the project.
