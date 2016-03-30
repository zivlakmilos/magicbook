# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

This project operates under a few assumptions:

- You want to write your book in a single source (markdown or HTML)
- You want to export this source to many different formats (static website, pdf, epub, mobi)
- You want your source to be completely free of format-specific markup
- You want to use CSS to design the look of your book
- You want to use JavaScript to add interactivity to digital formats
- You want an easy way to define custom elements that can look and behave differently in every format

Although a small number of open source publishing frameworks already exists, it's very hard to find frameworks that are flexible enough to create modern, interactive books for the web while also supporting print-ready PDF export.

## Getting Started

First install the `magicbook` package:

```bash
npm install magicbook -g
```

Then run the new project generator:

```bash
magicbook new myproject
```

Then `cd` into the new project and build the book.

```bash
cd myproject
magicbook build
```

You now have a `myproject/build` directory with both a website and a PDF of your book. This is of course a vanilla book. Consult the rest of this README for extra functionality.

## Writing

You can write your book in `.md`, `.html`, or both. As HTML doesn't define book-specific markup, we use a very simple spec called [HTMLBook](http://oreillymedia.github.io/HTMLBook) to define various elements in the book. It's very easy to learn, and it introduces no new HTML tags.

### Writing in Markdown

If you chose to write your book in Markdown, `magicbook` will automatically convert your markdown to HTMLBook. A simple file like the following...

```md
# Chapter title

## Sect 1

### Sect 2
```

... will be converted to the following HTMLBook markup.

```html
<section data-type="chapter">
  <h1>Chapter Title</h1>
  <section data-type="sect1">
    <h1>Sect 1</h1>
    <section data-type="sect2">
      <h2>Sect 2</h2>
    </section>
  </section>
</section>
```

This gives you a common way to style your book with CSS across formats.

### Writing in HTML

If you choose to write in HTML, it's up to you whether you want to use HTMLBook or not. You can write your entire book using just HTML5, and use CSS to style your markup. Nothing prevents you from doing that.

## Configuration

To specify configuration for your project, you can create a file called `magicbook.json` in your project folder. In this file, you can set all of the following config settings. Most of these settings can also be overridden with command line arguments, including the name of the config file. See the documentation further down for command line arguments.

### Enabled formats

By default `magicbook` will turn your project into a HTML website, ePub, MOBI and PDF. To only enable certain formats, you can use the `enableFormats` setting.

```json
{
  "enabledFormats" : ["pdf", "html"]
}
```

Read more about formats below.

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
  "formats" : {
    "html" : {
      "layout" : "layouts/website.html"
    }
  }
}
```

Layouts support the use of liquid includes (even when the `liquid` plugin has been disabled). See more information under the `liquid` plugin.

## Plugins

Almost all functionality in `magicbook` is written via plugins. Some plugins are enabled by default, while others need a configuration setting to work. It's easy to write custom plugins for your book. You can place a file in your book repo and reference it in the plugins array. The following will try to load a file located at `plugins/myplugin.js` in the book folder.

```json
{
  "plugins" : ["plugins/myplugin"]
}
```

You can also create plugins as NPM packages, simply using the name of the package.

```json
{
  "plugins" : ["mypackage"]
}
```

The load order of plugins is native plugins first, then plugins in the book folder, then NPM packages. `magicbook` will output a warning if the plugin is not found. Consult the `src/plugins/blank.js` file to see what's possible with plugins. Remember that if you're specifying your own plugins array, you are clearing the default enabled plugins, and you must add those plugin names to your array.

### html

This plugin is **enabled by default**. It saves all source files as separate `.html` files in the format destination folder. This can be used to build static websites.

### pdf

This plugin is **enabled by default**. It combines all source files, bundles them into a single `.html` file, and generates a PDF in the format destination folder. This can be used to make print book.

Currently this process uses Prince XML for PDF generation, as it's one of the few applications that can do print-ready PDF files from HTML. You will need a Prince XML license to use it without a watermark.

We would like to enable support for PanDoc, wkhtmltopdf down the road, although those programs don't have the flexibility of Prince XML.

### epub

Not created yet

### mobi

Not created yet

### Liquid

This plugin is **enabled by default**. It allows you to use Liquid templating in your source files. By default, each file will receive an object that looks like the following.

```json
{
  "format" : "",
  "config" : {},
  "page" : {}
}
```

- `format` is a string with the name of the format. This can be used show show or hide specific markup in each format.
- `config` is an object with all the configuration settings for the specific format.
- `page` is an object with variables assigned to `file.config` during the build process. Right now, this is mostly done in the `frontmatter` plugin, but you can easily write a plugin that adds extra variables to this object.

Even though `magicbook` has a built-in views, it's possible to use Liquid includes. The default search location is in `/includes`, but you can customize this as a general setting or a format setting.

```json
{
  "liquid" : {
    "includes" : "my/include/folder"
  },
  "formats" : {
    "html" : {
      "includes" : "my/other/include/folder"
    }
  }
}
```

This makes it possible to either have includes for each format, or have a single include for all formats where the `format` liquid variable is used to generate specific template markup.

### Frontmatter

This plugin is **enabled by default**. In combination with the `liquid` plugin, this plugin allows you to specify YAML frontmatter in each file, and make those variables available as liquid variables in the file content. Here's a quick example of how this works.

```markdown
---
name: Rune Madsen
---

# About the author

The author, {{ name }}, was born in Denmark.
```

The YAML Frontmatter also allows you to override some configuration for each file. For example, you can specify a custom layout for a file. This will override any settings in the configuration file.

```markdown
---
layout: layouts/introduction.html
---
```

This only works for the following configuration variables:

- `layout`
- `includes`


### Stylesheets

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

You can also override this for a particular format.

```json
{
  "formats" : {
    "html" : {
      "stylesheets" : {
        "files" : [
          "myhtmlstyles.css"
        ]
      }
    }
  }
}
```

You can insert the compiled CSS in the layout using the `{{ stylesheets }}` liquid variable tag.

```html
<html>
  <head>
    {{ stylesheets }}
  </head>
  <body>
    {{ content }}
  </body>
</html>
```

By using different files for each format, you can have a book that looks very different across formats. To share styles between the formats, you can use SCSS `@import`.

 It is also possible to control where these stylesheets are stored. You can specify a custom destination folder by using the `destination` property. It defaults to `/assets`.

```json
{
  "stylesheets" : {
    "destination" : "customfolder"
  }
}
```

For each CSS file in the array, `magicbook` will add a `<link>` tag in the final format. If you're building a website for deployment, there's a number of built-in options you might consider.

The `compress` property will remove whitespace from the CSS file, resulting in much smaller file sizes.

```json
{
  "stylesheets" : {
    "compress" : true
  }
}
```

The `bundle` option will combine all the files in the `stylesheets` array into a single CSS file in the output. This, combined with the `compress` option, is recommended to improve the loading speed of a production website. You can set it to `true` or the desired name of the bundle.

```json
{
  "stylesheets" : {
    "bundle" : "mybundle.css"
  }
}
```

The `digest` option will add a the md5 checksum of the file content to the filename, to allow you to set long caching headers for a production website.

```json
{
  "stylesheets" : {
    "digest" : true
  }
}
```


### Katex

This plugin is **disabled by default**. The katex plugin allows you to write math equations via latex math expressions and automatically render these with the Katex math library. We chose to use Katex over Mathjax as it's faster, smaller, and supports bundling alongside other libraries. Mathjax is hell when it comes to these things.

To use, first enable the katex plugin, by adding it to your config plugins array.

```json
{
  "plugins" : [
    "katex"
  ]
}
```

Then you can write inline and block math equations in your markdown.

```md
This is an inline equation: $$5 + 5$$. The following is a block equation:

$$
5 + 5
$$
```

The plugin will automatically include the required JavaScript libraries for the different formats.

## Command line

### `build`

Builds the book.

```bash
magicbook build
```

You can specify the path to a configuration file by using the `--config` argument.

```bash
magicbook build --config=myconfig.json
```

To automatically build your book whenever a file changes, use the `--watch` flag.

```bash
magicbook build --watch
```


## Running the tests

`npm test`
