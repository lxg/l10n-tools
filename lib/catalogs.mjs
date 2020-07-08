import * as fs from 'fs'
import gettextParser from "gettext-parser"
import plurals from "./plurals.mjs"

export default function(dir, locales) {
    const catalogs = {}

    locales.forEach(locale => {
        const fileName = `${dir}/${locale}.po`
        if (fs.existsSync(fileName)) {
            const input = fs.readFileSync(fileName).toString("utf-8")
            catalogs[locale] = gettextParser.po.parse(input)
        }
        else {
            catalogs[locale] = createCatalog(locale)
        }
    })

    return catalogs
}

export function createCatalog(locale) {
    return {
        "charset": "utf-8",
        "headers": {
            "language": locale.replace("-", "_"),
            "content-type": "text/plain; charset=utf-8",
            "plural-forms": plurals[locale.substr(0,2)] || plurals._default
        },
        "translations": {}
    }
}
