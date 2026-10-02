#!/usr/bin/env node
/*
 * Daily currency-rate updater.
 *
 * Fetches the current USD and EUR rates (in RUB) from the Central Bank of
 * Russia and stores them in the currency_date table for the current date.
 * Replaces the old client-side apilayer.net call, whose API key was
 * deactivated (error 102 "User not active"), which is why rates stopped
 * updating on 2025-04-15.
 *
 * Table convention (currency ids: 0=RUB, 1=USD, 2=EUR):
 *   (date, currency_base=0, currency_sec=1, value) -> RUB per 1 USD
 *   (date, currency_base=0, currency_sec=2, value) -> RUB per 1 EUR
 *
 * DB connection is read from the environment (DB_HOST/DB_PORT/DB_NAME/
 * DB_USER/DB_PASSWORD), the same variables the app uses.
 */
const https = require('https')
const { Client } = require('pg')

const SOURCE = 'https://www.cbr-xml-daily.ru/daily_json.js'

function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'mymoney-currency/1.0' } }, res => {
            if (res.statusCode !== 200) {
                res.resume()
                return reject(new Error(`HTTP ${res.statusCode} from ${url}`))
            }
            const chunks = []
            res.on('data', c => chunks.push(c))
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
        }).on('error', reject)
    })
}

function round2(n) {
    return Math.round(n * 100) / 100
}

(async () => {
    const data = JSON.parse(await fetch(SOURCE))
    const usd = round2(data.Valute.USD.Value / data.Valute.USD.Nominal)
    const eur = round2(data.Valute.EUR.Value / data.Valute.EUR.Nominal)
    if (!(usd > 0) || !(eur > 0)) {
        throw new Error(`Bad rates parsed: USD=${usd} EUR=${eur}`)
    }
    const date = new Date().toISOString().slice(0, 10)

    const client = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'mymoney',
        user: process.env.DB_USER || 'mymoney',
        password: process.env.DB_PASSWORD
    })
    await client.connect()
    try {
        await client.query(
            `INSERT INTO currency_date (date, currency_base, currency_sec, value)
             VALUES ($1, 0, 1, $2), ($1, 0, 2, $3)
             ON CONFLICT (date, currency_base, currency_sec)
             DO UPDATE SET value = EXCLUDED.value`,
            [date, usd, eur]
        )
        console.log(`currency updated ${date}: USD=${usd} EUR=${eur}`)
    } finally {
        await client.end()
    }
})().catch(err => {
    console.error('update_currency failed:', err.message)
    process.exit(1)
})
