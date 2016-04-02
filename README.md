# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

This project is for you, if:

- You want to write your book in plain text (Markdown or HTML)
- You want to export to many different formats (static website, pdf, epub, mobi)
- You want your source to be completely free of format-specific hacks
- You want to use CSS to design the look of your book
- You want to use JavaScript to add interactivity to digital formats
- You want the ability to define custom elements that behave differently in every format
- You want to use a command-line tool for all of this
- You want that command-line tool be be written in Node-only. No more XSLT.

Although a small number of open source publishing frameworks already exists, it's hard to find any that are flexible enough to create modern, interactive books for the web while also doing print-ready PDF export.

## Getting Started

First install the `magicbook` package:

```bash
npm install magicbook -g
```

Then run the new project generator:

```bash
magicbook new myproject
```

This will give you a very basic project folder with a `magicbook.json` configuration file. Now `cd` into the new project and build the book.

```bash
cd myproject
magicbook build
```

You now have a `myproject/build` directory with two builds: a website and a PDF. This is of course a very basic setup. Consult the rest of this README for all the available functionality.

## Configuration

To specify configuration for your project, `magicbook` uses a file called `magicbook.json` in your project folder. When you run `magicbook build`, the configuration file will automatically be detected. If you wish to have a custom name and location for the configuration file, you can use the `--config` command line argument.

```bash
magicbook build --config=myfolder/myconfig.json
```

## Source files

You can write your book in `.md`, `.html`, or both. `magicbook` uses a very simple layer on top of HTML5 called [HTMLBook](http://oreillymedia.github.io/HTMLBook) to define the various elements in a book. This mostly means using a few `data-type` attributes to specify chapters and sections, and it's very easy to learn. It is also what makes it possible `magicbook` to do its magic when generating table of contents, etc.

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

### Writing in HTML

If you choose to write in HTML, you will need to make sure that you're using the HTMLBook `data-type` attributes. `magicbook` will not break if you don't use them, but it won't be possible to generate a table of contents, etc.

### Building source files

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

*This setting is also available in the configuration for each build*, which you can read more about below.

## Builds

You must add a `builds` array to your configuration that as a minimum defines the format of each build. Here's a simple example with the bare minimum configuration to build your book into a website.

```json
{
  "builds" : [
    { "format" : "html" }
  ]
}
```

`magicbook` has the following built-in formats:

- `html` will save all source files as separate `.html` files as a static website.
- `pdf` will combine all source files, bundle them into a single `.html` file, and generate a PDF in the format destination folder. Currently this process uses Prince XML for PDF generation, as it's one of the few applications that can do print-ready PDF files from HTML. You will need a Prince XML license to use it without a watermark.
- `epub` TODO
- `mobi` TODO

The `builds` array is a very powerful concept, as it further allows you to specify specific settings for each build. For example, here's a book that uses a different introduction for the HTML and PDF builds.

```json
{
  "builds" : [
    {
      "format" : "pdf",
      "files" : [
        "content/print-introduction.md",
        "content/chapter-1.md",
        "content/chapter-2.md"
      ]
    },
    {
      "format" : "html",
      "files" : [
        "content/web-introduction.md",
        "content/chapter-1.md",
        "content/chapter-2.md"
      ]
    }
  ]
}
```

Almost all settings in `magicbook` can be specified as either a global setting or a build setting. Below, each setting will state *This setting is also available as a build setting* if this is true.

Using the `builds` array, you can have several builds that uses the same format. This is useful if you want to e.g. generate a PDF with hyperlinks, and another PDF for print that doesn't have hyperlinks.

### Build destination folder

`destination` specifies where to put the builds. Because you can have many builds, the default destination is `build/:build`, which will create a build folder within `build` for each build (`build/build1`, `build/build2`, etc).

You can change this setting in your configuration file.

```json
{
  "destination" : "my/custom/folder/:build"
}
```

*This setting is also available as a build setting.*

## Internal links

If you wish to link internally between files, you can simply use an anchor link (`<a href="#myid">My link</a>` or `[My link](#myid)`), while making sure that this ID exists in one of the files in the build. `magicbook` will automatically insert the filename in the formats that need it.

If you want to insert page numbers in link text for print, it's [easy with Prince XML and CSS](http://www.princexml.com/doc/7.1/cross-references/).

## Images

When you want to insert an image, simply create a folder called `images` in your book, save your image into this folder, and create an image tag using the name of your image.

For an image saved to `images/myimage.jpg`, the following would be the appropriate markup.

```md
![This is an image](myimage.jpg)
```

or

```html
<img src="myimage.jpg" alt="This is an image" />
```

During the build process, `magicbook` will transfer all files located in `images` to the asset folder of each build and replace the image src attribute appropriately.

### Source folder

You can change the default image source folder in the configuration, which for the image tag above would make `magicbook` look for the image in `custom/folder/images/myimage.jpg`.

```json
{
  "images" : {
    "source" : "custom/images/folder"
  }
}
```

*This setting is also available as a build setting.*

### Destination folder

It is also possible to control where the images are stored in the build. You can specify a custom destination folder by using the `destination` property. It defaults to `assets`.

```json
{
  "images" : {
    "destination" : "custom/assets/folder"
  }
}
```

*This setting is also available as a build setting.*

### Digest

The `digest` option will add a md5 checksum of the image content to the filename, to allow you to set long caching headers for a production website.

```json
{
  "images" : {
    "digest" : true
  }
}
```

*This setting is also available as a build setting.*

## Layouts

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

Layouts support the use of liquid includes (even when the `liquid` plugin has been disabled). See more information under the `liquid` plugin.

*This setting is also available as a build setting.*

## Liquid

It is also possible to use Liquid templating in your source files. By default, each file will receive an object that looks like the following.

```json
{
  "format" : "",
  "config" : {},
  "page" : {}
}
```

- `format` is a string with the name of the format. This can be used to show or hide specific markup in each format.
- `config` is an object with all the configuration settings for the specific format.
- `page` is an object with the YAML frontmatter variables from the particular file.

Even though `magicbook` has a built-in views, it's possible to use Liquid includes. The default search location is in `/includes`, but you can easily change this.

```json
{
  "liquid" : {
    "includes" : "my/include/folder"
  }
}
```

This makes it possible to either have different includes for each format, or have a single include for all formats where the `format` liquid variable is used to generate specific template markup.

*This setting is also available as a build setting.*

## YAML Frontmatter

You can specify YAML frontmatter in each file, and make those variables available as liquid variables in the file content. Here's a quick example of how this works.

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

## Stylesheets

You can style all your builds using CSS or SCSS. The `stylesheets` configuration allows you to specify an array of `.css` or `.scss` files to include in the build. The following example shows a configuration file specifying two stylesheets to include in all builds.

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

You can insert the compiled CSS in the layout using the `{{ stylesheets }}` liquid variable tag. This will insert each file as a separate `<link>` element.

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

*This setting is also available as a build setting.*

### Destination

It is also possible to control where these stylesheets are stored in the build. You can specify a custom destination folder by using the `destination` property. It defaults to `assets`.

```json
{
  "stylesheets" : {
    "destination" : "customfolder"
  }
}
```

*This setting is also available as a build setting.*

### Compress

The `compress` property will remove whitespace from the CSS file, resulting in much smaller file sizes.

```json
{
  "stylesheets" : {
    "compress" : true
  }
}
```

*This setting is also available as a build setting.*

### Bundle

The `bundle` option will combine all the files in the `stylesheets` array into a single CSS file in the output. This, combined with the `compress` option, is recommended to improve the loading speed of a production website. You can set it to `true` or the desired name of the bundle.

```json
{
  "stylesheets" : {
    "bundle" : "mybundle.css"
  }
}
```

*This setting is also available as a build setting.*

### Digest

The `digest` option will add a the md5 checksum of the file content to the filename, to allow you to set long caching headers for a production website.

```json
{
  "stylesheets" : {
    "digest" : true
  }
}
```

*This setting is also available as a build setting.*


## Math

`magicbook` allows you to write math equations via latex math expressions and automatically render these with the Katex math library. We chose to use Katex over Mathjax as it's faster, smaller, and supports bundling alongside other libraries. Mathjax is problematic when it comes to these things.

Here's an example with an inline and block math equations in your markdown.

```md
This is an inline equation: $$5 + 5$$. The following is a block equation:

$$
5 + 5
$$
```

The required JavaScript libraries will automatically be added to the build assets during the build process (TODO).

## Plugins

Almost all functionality in `magicbook` is written via plugins. This makes it both possible to disable almost any functionality that you don't want, as well as easily adding new functionality in a custom plugin.

### Adding plugins

It's easy to write custom plugins for your book. You can place a file in your book repo and reference it in the plugins array. The following will try to load a file located at `plugins/myplugin.js` in the book folder.

```json
{
  "addPlugins" : ["plugins/myplugin"]
}
```

You can also create plugins as NPM packages, simply using the name of the package.

```json
{
  "addPlugins" : ["mypackage"]
}
```

The load order of plugins is native plugins first, then plugins in the book folder, then NPM packages. `magicbook` will output a warning if the plugin is not found. Consult the `src/plugins/blank.js` file to see the structure of a plugin. Using the `addPlugins` will add your custom plugins at the end of the plugin pipeline, after the built-in plugins. This setting is also available inside the `builds` array, so each build can have different plugins.

### Removing plugins

If you want to remove native plugins, you can use the `removePlugins` property. By using this property, you can disable almost all functionality in `magicbook`. Plugins are included based on their filenames, so you can easily figure out plugin names by looking at the [plugins source folder](https://github.com/magicbookproject/magicbook/tree/master/src/plugins).

```json
{
  "removePlugins" : ["katex"]
}
```

### Resetting plugins

If you want complete control over all plugins and their order, you can use the `plugins` setting. This specifies the exact order of all plugins, and plugins not present in the array will be disabled. The following will completely disable all plugins in `magicbook`.

```json
{
  "plugins" : []
}
```

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

Run the jasmine tests:

`npm test`

Run a V8 profiling build of the example folder:

`npm run profile`
