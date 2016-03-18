# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.


## Getting Started

First install the magic book project package:

```
npm install magicbook -g
```

TODO: Then run the new project generator:

```
magicbook new mynewproject
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

## Commands

### `build`

Builds the book.

```bash
magicbook build
```

- `--config` allows you to specify the relative path to a configuration file
- `--prod` adds fingerprints to all assets.
- `--watch` will continously monitor files for changes and recompile


## Running the tests

`npm test`
