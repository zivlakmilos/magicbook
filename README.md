# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

## Configuration

A project requires a `magicbook.json` file to specify configuration settings.

- `files`. Array of globs specifying the files to build.
- `destination`. Specifies where to put the build files. Defaults to `build/:format`.


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
