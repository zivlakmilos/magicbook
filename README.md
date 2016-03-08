# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

## Configuration

A project requires a `magicbook.json` file to specify configuration settings. Most of these config settings can be overridden in the settings for each format.

`files`. Array of globs specifying the files to build.

`destination`. Specifies where to put the build files. Defaults to `build/:format`. If used inside a format setting, it sets the folder for that format only.

`formats`. Object with keys for each build format.

```json
{
  "formats" : {
    "pdf" : {

    },
    "html" : {
      
    }
  }
}
```


## Commands

### `new`

Creates a new project skeleton inside the current directory.

```bash
magicbook new myproject
```

### `build`

Builds the book.

```bash
magicbook build
```

- `--prod` adds fingerprints to all assets.
- `--watch` will continously monitor files for changes and recompile
