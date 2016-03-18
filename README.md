# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

This project operates under a few assumptions:

- You want to write your book in a single source (markdown)
- You want to be able to export this source to many different formats (website, pdf, epub, mobi)
- You want your source to be completely free of format-specific markup
- You want to use CSS to design the look of your book
- You want to use JavaScript to add interactivity to digital formats
- You want an easy way to define custom elements that can look and behave differently in every format

## Getting Started

First install the `magicbook` package:

```
npm install magicbook -g
```

TODO: Then run the new project generator:

```
magicbook new myproject
```

## Configuration

To specify configuration for your project, you can create a file called `magicbook.json` in your project folder. In this file, you can set all of the following config settings. Most of these settings can also be overridden with command line arguments, including the name of the config file. See the documentation further down for command line arguments.

### Files

You can specify the files to build by adding a `files` array to your `magicbook.json` file. If you do not have a `files` array, it will look for all markdown files in `content/*.md`.

You can set the files property to be a single glob.

```json
{
  "files" : "content/*.md"
}
```

You can set the files array to be an array of globs.

```json
{
  "files" : [
    "content/chapter1/*.md",
    "content/chapter2/*.md"
  ]
}
```

Using an array, you can also specify each of the files you want to build.

```json
{
  "files" : [
    "content/first-file.md",
    "content/second-file.md",
    "content/third-file.md"
  ]
}
```

### Destination

`destination` specifies where to put the output formats. Because there are multiple output formats, the default destination is `build/:format`, which will create the following folders:

```
build/
  html/
  pdf/
  epub/
  mobi/
```

You can change this setting in the JSON config.

```json
{
  "destination" : "my/other/folder/:format"
}
```

You can also override the destination per format.

```json
{
  "destination" : "my/other/folder/:format",
  "formats" : {
    "html" : {
      "destination" : "my/third/folder/html"
    }
  }
}
```

### Layout

Like most web frameworks, magicbook has the ability to wrap your content in a layout file. The liquid templating language is used for this, and this is what a layout file might look like:

```html
<html>
  <head>
    <title>My Book</title>
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

To specify a layout to use, you can use the `layout` property in the JSON config.

```json
{
  "layout" : "layouts/main.html"
}
```

Like most other settings, you can set the layout for each format.

```json
{
  "layout" : "layouts/main.html",
  "formats" : {
    "html" : {
      "layout" : "layouts/website.html"
    }
  }
}
```

### Stylesheets

Magicbook comes with built-in SCSS functionality, where you can use built-in Liquid filters to automatically generate compiled version of your SCSS files. The following snippet shows how to use the `css` filter to look for a file called `styles.scss` in your `stylesheets` folder, and compile a file called `styles.css` into the `assets` folder of each of your formats.

```html
<link rel="stylesheet" href="{{ 'styles' | css }}">
```

You can change the default search directory by using the `stylesheets` setting in your config. The following setting will have magicbook look for a file located in `assets/css/styles.scss`.

```json
{
  "stylesheets" : "assets/css"
}
```

In this SCSS file, you can use `@import` to split up your CSS into separate modules. By using different files in each format layout, you can maintain different designs for each of the build formats.

## Commands

### `build`

Builds the book.

```bash
magicbook build
```

- `--config` allows you to specify the relative path to a configuration file

## Running the tests

`npm test`
