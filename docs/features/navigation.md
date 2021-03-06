---
title: Navigation
description: Details on how the documentation scaffold generates navigation.
lunr: true
nav_sort: 2
nav_groups:
  - primary
tags: navigation
collection: features
order: 3
---
The navigation is powered by [metalsmith-navigation](https://github.com/unstoppablecarl/metalsmith-navigation).

## Adding pages to the navigation
The `nav_groups` metadata of a file decides if/where it should appear in the navigation.

There are three available values: `primary`, `secondary`, `tertiary`. The primary nav appears at the top, the secondary in the middle, and the tertiary last.

The elements are nested according to where they appear in the file structure. To add children to a page, simply create a folder with the same name as the file, and place its child pages inside.

## Ordering pages in the navigation

Pages are ordered alphabetically, to override this: add a `nav_sort` metadata to the files.

## Special entries

To make a file appear as a **bold** group, simply give it the metadata `nav_group: true`.

To make a file appear only as a category (unclickable), you should give it the metadata `nav_category: true`.

## Collections

To link a series of pages together with PREVIOUS and NEXT page links, you can create a collection.

In the build-docs.js, you can find the metalsmith-collections plugin, under which you will find a configuration like this:

```js
    .use(collections({
        gettingstarted:{
            sortBy: 'order',
        },
        features:{
            sortBy: 'order',
        }
    }))
```

In this setup we have two collections: `gettingstarted` and `features`. Both are sorted by `order`.

To add pages to a collection, we can add the following tags to the metadata:

```
collection: gettingstarted
order: 1
```

This would add a page to the collection at the first page. If you were to add another page to the collection at order 2 the page at order 1 would have a link at the bottom pointing towards the page at order 2, and vice versa.
