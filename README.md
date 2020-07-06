# l10n-tools – catalog tools for the lxg/l10n library

This package is a collection of tools to work with the [@lxg/l10n library](https://github.com/lxg/l10n).

## Installation

This package is available via NPM:

```shell
npm install --save-dev @lxg/l10n-tools
```

## Usage

The *catalog manager* is a CLI tool and has two tasks:

1. It extracts all translatable strings into a `.po` catalog.
2. It builds translation tables as a lightweight JSON objects.

The `npx l10n` tool is the CLI frontend to the catalog manager.

### Setup

Before you can start using the catalog manager, you must add some configuration to your project’s `package.json` file:

```json
{
    "l10n": {
        "directory": "l10n",
        "instance": "l10n",
        "locales": [
            "de-DE",
            "fr-FR"
        ],
        "sources": [
            "main.js",
            "other.js",
            "src/*"
        ],
        "targets": {
            "l10n/translations.json": [
                "first.js",
                "src/*"
            ]
        }
    }
}
```

The `directory` key specifies where the translations catalogs will be stored. It is optional and defaults to `l10n`.

The `instance` key specifies the variable name of your instance of the `L10n` class. It is optional and defaults to `l10n`.

The `locales` key specifies the locales into which your package should be translated. The format for locales is: two lowercase letters for the language, followed by a hyphen (not an underscore!), followed by two uppercase letters for the region/country. NOTE: This tool assumes the `en-GB` locale as default, therefore you don’t need to add it.

The `sources` key contains a list which specifies the files to be considered for the catalog. Each item in this list can either be a verbatim file name or a glob expression.

The `targets` key is an object, where each entry is a target file for the JSON dictionary mapped to a list of sources. Each item in this list can either be a verbatim file name or a glob expression. By mapping the output target to a subset of the source files, we can build multiple translation dictionaries for different parts of your application, allowing smaller downloads e.g. in lazy-loading setups.

### Extracting Message Strings

Calling the `npx l10n` command will cause the following things to happen:

- The tool will go through all the existing catalogs for the specified locales and collect existing translations.
- It will go through all source files and collect translatable messages in the `l10n.t`, `l10n.n`, `l10n.x` functions.
- It creates new language catalogs (.po files) for each specified locale, composed from the currently existing messages in the specified source files. If a translation exists for a message, it will be retained.
- It creates one or more translation dictionaries as specified in the `targets` field. Each dictionary contains the translations for the given sources, for *all* specified locales.

### Workflow and Source Control

Assuming you are using the configuration from the above example, the extractor will create or update the catalogs for German and French. Catalogs would be stored in the `./l10n` directory. So after running the command for the first time, you will find the new files `./l10n/de-DE.po` and `./l10n/fr-FR.po` in your project.

The `*.po` files can be given to a human translator or be run through a translation tool which supports this format (there are lots of them). After the `.po` files have been updated, you can run `npx l10n` again, to create the translation dictionaries.

All .po files and JSON dictionaries should be put under version control.

### Non-JavaScript Sources

This tool uses a JavaScript parser ([Acorn](https://github.com/acornjs/)) to find translatable strings in the source files. If you want to process TypeScript, TSX, JSX or other formats which cannot be processed by the parser, you must first generate the native JS code from them, and then reference the generated output as sources.

## Using the Translation Dictionaries

After the .po files have been translated and the dictionaries have been generated, you can use them in your code base. Please see the documentation of [@lxg/l10n](https://github.com/lxg/l10n) for details.
