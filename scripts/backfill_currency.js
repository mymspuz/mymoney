#!/usr/bin/env node
/*
 * One-off backfill of historical currency rates.
 *
 * Rates stopped updating on 2025-04-15 (deactivated apilayer.net key), leaving
 * income rows after that date with no USD/EUR conversion. This script pulls the
 * USD (R01235) and EUR (R01239) daily history from the Central Bank of Russia
 * for the gap and fills currency_date for every income date that lacks a rate.
 *
 * CBR publishes rates on business days only; for income dates that fall on a
 * weekend/holiday we use the most recent prior business-day rate (which is how
 * the official rate actually applies).
 *
 * Range: BACKFILL_START (default 2018-01-01) .. today; fills every income date
 * in that range that has no rate yet (idempotent — ON CONFLICT DO NOTHING).
 * DB connection from env (DB_HOST/DB_PORT/DB_NAME/DB_USER/DB_PASSWORD).
 */
const https = require('https')
const { Client } = require('pg')

const START = process.env.BACKFILL_START || '2018-01-01'
const END = new Date().toISOString().slice(0, 10)
const USD_CODE = 'R01235'
const EUR_CODE = 'R01239'

function toCbrDate(isoDate) { // YYYY-MM-DD -> DD/MM/YYYY
    const [y, m, d] = isoDate.split('-')
    return `${d}/${m}/${y}`
}

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'mymoney-currency/1.0' } }, res => {
            if (res.statusCode !== 200) {
                res.resume()
                return reject(new Error(`HTTP ${res.statusCode} from ${url}`))
            }
            const chunks = []
            res.on('data', c => chunks.push(c))
            // CBR XML is windows-1251; the fields we parse (dates, numbers) are ASCII.
            res.on('end', () => resolve(Buffer.concat(chunks).toString('latin1')))
        }).on('error', reject)
    })
}

// Parse <Record Date="DD.MM.YYYY" ...><Nominal>N</Nominal><Value>x,yy</Value>...
function parseDynamic(xml) {
    const re = /<Record Date="(\d{2})\.(\d{2})\.(\d{4})"[^>]*>\s*<Nominal>(\d+)<\/Nominal>\s*<Value>([\d,]+)<\/Value>/g
    const out = []
    let m
    while ((m = re.exec(xml))) {
        const date = `${m[3]}-${m[2]}-${m[1]}`
        const nominal = parseInt(m[4], 10)
        const value = parseFloat(m[5].replace(',', '.')) / nominal
        out.push({ date, value: Math.round(value * 100) / 100 })
    }
    out.sort((a, b) => (a.date < b.date ? -1 : 1))
    return out
}

function rateOnOrBefore(sorted, date) {
    let r = null
    for (const rec of sorted) {
        if (rec.date <= date) r = rec.value
        else break
    }
    return r
}

async function fetchSeries(code) {
    const url = `https://www.cbr.ru/scripts/XML_dynamic.asp?date_req1=${toCbrDate(START)}&date_req2=${toCbrDate(END)}&VAL_NM_RQ=${code}`
    return parseDynamic(await fetch(url))
}

(async () => {
    const [usd, eur] = await Promise.all([fetchSeries(USD_CODE), fetchSeries(EUR_CODE)])
    console.log(`CBR records: USD=${usd.length} EUR=${eur.length} (${START}..${END})`)
    if (!usd.length || !eur.length) throw new Error('No CBR data parsed')

    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'mymoney',
        user: process.env.DB_USER || 'mymoney',
        password: process.env.DB_PASSWORD
    })
    await client.connect()
    try {
        const { rows } = await client.query(
            `SELECT DISTINCT i.date::text AS d
             FROM incomes i
             WHERE i.date >= $1
               AND NOT EXISTS (
                   SELECT 1 FROM currency_date c
                   WHERE c.date = i.date AND c.currency_sec = 1)
             ORDER BY d`,
            [START]
        )
        let filled = 0, skipped = 0
        for (const { d } of rows) {
            const u = rateOnOrBefore(usd, d)
            const e = rateOnOrBefore(eur, d)
            if (u == null || e == null) { skipped++; continue }
            await client.query(
                `INSERT INTO currency_date (date, currency_base, currency_sec, value)
                 VALUES ($1, 0, 1, $2), ($1, 0, 2, $3)
                 ON CONFLICT (date, currency_base, currency_sec) DO NOTHING`,
                [d, u, e]
            )
            filled++
        }
        console.log(`income dates needing a rate: ${rows.length}; filled: ${filled}; skipped(no rate): ${skipped}`)
    } finally {
        await client.end()
    }
})().catch(err => {
    console.error('backfill_currency failed:', err.message)
    process.exit(1)
})
