import plurals from "./plurals.mjs"
import * as fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const basedir = dirname(dirname(fileURLToPath(import.meta.url)))

export default async function(sourceFiles, extras, catalogs) {
    const table = {}

    for (const locale of Object.keys(catalogs)) {
        const lang = locale.substr(0, 2)

        table[locale] = table[locale] || {
            p : plurals(locale, true),
            t : {}
        }

        Object.keys(catalogs[locale].translations).forEach(context => {
            Object.keys(catalogs[locale].translations[context]).forEach(msgid => {
                if (msgid) {
                    const entry = catalogs[locale].translations[context][msgid]
                    const isContained = entry.locations.filter(location => sourceFiles.includes(location.file)).length;

                    if (isContained) {
                        const prefix = entry.msgctxt ? `${entry.msgctxt}\u0004` : ""
                        const key = `${prefix}${entry.msgid}`
                        const value = entry.msgid_plural ? entry.msgstr : entry.msgstr[0] || ""

                        table[locale].t[key] = value
                    }
                }
            })
        })

        // adding extra translations (currently only month/day names)
        if (extras) {
            let path = ""

            if (fs.existsSync(`${basedir}/cldr/${locale}.mjs`)) {
                path = `${basedir}/cldr/${locale}.mjs`
            } else if (fs.existsSync(`${basedir}/cldr/${lang}.mjs`)) {
                path = `${basedir}/cldr/${lang}.mjs`
            }

            if (path) {
                const dates = (await import(path)).default

                extras.forEach(extra => {
                    const type = extra.replace(/^.*:/, "")

                    if (["days", "daysShort", "months", "monthsShort"].includes(type)) {
                        table[locale].t = {...table[locale].t, ...dates[type]}
                    }
                })
            }
        }
    }

    return table
}
