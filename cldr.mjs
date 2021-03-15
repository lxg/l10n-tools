#!/usr/bin/env node

import * as fs from 'fs'
import fg from "fast-glob"
import { dirname } from 'path'
import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))

const cldrPath = `${__dirname}/cldr`

if (!fs.existsSync(cldrPath)) {
    fs.mkdirSync(cldrPath)
}

// delete old files
fg.sync("*", { cwd: cldrPath }).forEach(file => fs.unlinkSync(`${cldrPath}/${file}`))

// create new files
const cldrDataPath = `${__dirname}/node_modules/cldr-dates-modern/main`
const cldrFiles = fg.sync("**/ca-gregorian.json", { cwd: cldrDataPath })

cldrFiles.forEach(file => {
    const locale = file.replace(/\/.*$/, "")
    const cldr = JSON.parse(fs.readFileSync(`${cldrDataPath}/${file}`).toString())

    const extract = {
        days: cldr.main[locale].dates.calendars.gregorian.days["stand-alone"].wide,
        daysShort: cldr.main[locale].dates.calendars.gregorian.days["stand-alone"].abbreviated,
        months: cldr.main[locale].dates.calendars.gregorian.months["stand-alone"].wide,
        monthsShort: cldr.main[locale].dates.calendars.gregorian.months["stand-alone"].abbreviated
    }

    const data = {
        days: {
            "l10n\u0004Monday": extract.days.mon,
            "l10n\u0004Tuesday": extract.days.tue,
            "l10n\u0004Wednesday": extract.days.wed,
            "l10n\u0004Thursday": extract.days.thu,
            "l10n\u0004Friday": extract.days.fri,
            "l10n\u0004Saturday": extract.days.sat,
            "l10n\u0004Sunday": extract.days.sun
        },
        daysShort: {
            "l10n\u0004Mon": extract.daysShort.mon,
            "l10n\u0004Tue": extract.daysShort.tue,
            "l10n\u0004Wed": extract.daysShort.wed,
            "l10n\u0004Thu": extract.daysShort.thu,
            "l10n\u0004Fri": extract.daysShort.fri,
            "l10n\u0004Sat": extract.daysShort.sat,
            "l10n\u0004Sun": extract.daysShort.sun
        },
        months: {
            "l10n\u0004January": extract.months[1],
            "l10n\u0004February": extract.months[2],
            "l10n\u0004March": extract.months[3],
            "l10n\u0004April": extract.months[4],
            "l10n\u0004May": extract.months[5],
            "l10n\u0004June": extract.months[6],
            "l10n\u0004July": extract.months[7],
            "l10n\u0004August": extract.months[8],
            "l10n\u0004September": extract.months[9],
            "l10n\u0004October": extract.months[10],
            "l10n\u0004November": extract.months[11],
            "l10n\u0004December": extract.months[12]
        },
        monthsShort: {
            "l10n\u0004Jan": extract.monthsShort[1],
            "l10n\u0004Feb": extract.monthsShort[2],
            "l10n\u0004Mar": extract.monthsShort[3],
            "l10n\u0004Apr": extract.monthsShort[4],
            "l10n\u0004May": extract.monthsShort[5],
            "l10n\u0004Jun": extract.monthsShort[6],
            "l10n\u0004Jul": extract.monthsShort[7],
            "l10n\u0004Aug": extract.monthsShort[8],
            "l10n\u0004Sep": extract.monthsShort[9],
            "l10n\u0004Oct": extract.monthsShort[10],
            "l10n\u0004Nov": extract.monthsShort[11],
            "l10n\u0004Dec": extract.monthsShort[12]
        }
    }

    fs.writeFileSync(`${cldrPath}/${locale}.mjs`, `export default ${JSON.stringify(data)}`)
})
