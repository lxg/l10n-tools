import plurals from "./plurals.mjs"

export default function(sourceFiles, catalogs) {
    const table = {}

    Object.keys(catalogs).forEach(locale => {
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
    })

    return table
}
