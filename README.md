# The Magic Book Project

The Magic Book Project is an open source project funded by New York University's Interactive Telecommunications Program. It aims to be the best free tool for creating print and digital books from a single source.

## Configuration

To specify options for your project, you can create a file called `magicbook.json` in your project folder. In this file, you can use the following config settings, and most of these can be overridden in the settings for each format.

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

`plugins`. Array of globs specifying plugin files to include in the build process.

`layout`. Layout view used for the build. This layout can use the asset helpers to include JS and CSS files.

## Commands

### `build`

Builds the book.

```bash
magicbook build
```

- `--config` allows you to specify the relative path to a configuration file
- `--prod` adds fingerprints to all assets.
- `--watch` will continously monitor files for changes and recompile
