# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

This project operates under a few assumptions:

- You want to write your book in a single source (markdown or HTML)
- You want to export this source to many different formats (static website, pdf, epub, mobi)
- You want your source to be completely free of format-specific markup
- You want to use CSS to design the look of your book
- You want to use JavaScript to add interactivity to digital formats
- You want an easy way to define custom elements that can look and behave differently in every format

Although a small number of open source publishing frameworks already exists, it's very hard to find frameworks that are flexible enough to create modern, interactive books for the web while supporting print-ready PDF export too.

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

### Formats

By default `magicbook` will turn your project into a HTML website, ePub, MOBI and PDF. To only enable certain formats, you can use the `enableFormats` setting.

```json
{
  "enableFormats" : ["pdf", "html"]
}
```

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

## Plugins

Almost all functionality in `magicbook` are written via plugins. Some plugins come enabled by default, while others need to be enabled to work. It's easy to write custom plugins for your book, either by putting plugin files in the book itself (TODO) or by adding existing plugins via NPM (TODO).

## Stylesheets

This plugin is **enabled by default**. The stylesheets plugin allows you to specify an array of `.css` or `.scss` files to include in the build. The following example shows a configuration file specifying two stylesheets to include in all builds.

```json
{
  "stylesheets" : {
    "files" : [
      "css/first.css",
      "css/first.scss",
    ]
  }
}
```

You can also override this setting per format, as shown here:

```json
{
  "formats" : {
    "html" : {
      "stylesheets" : {
        "files" : [
          "css/myhtmlstyles.css"
        ]
      }
    }
  }
}
```

To link use this CSS in your build formats, you can insert the compiled CSS in the layout using the `{{ css }}` tag.

```html
<html>
  <head>
    {{ css }}
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

In SCSS files, you can use `@import` to split up your CSS into separate modules. By using different files in each format layout, you can maintain different designs for each of the build formats.

### Mathjax

This plugin is **disabled by default**. The mathjax plugin allows you to write math equations in markdown, and automatically convert these to MathML to be rendered by Mathjax in the output formats.

First enable the mathjax plugin, by adding it to your config plugins array.

```json
{
  "plugins" : [
    "mathjax"
  ]
}
```

Then you can write inline and block math equations in your markdown.

```md
This is an inline equation: $$5 + 5$$. The following is a block equation:

$$$
5 + 5
$$$
```

The plugin will automatically include the required JavaScript libraries for the different formats.

## Command line

### `build`

Builds the book.

```bash
magicbook build
```

- `--config` allows you to specify the relative path to a configuration file

## Running the tests

`npm test`
