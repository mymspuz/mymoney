# Deployment notes

Production runs on an Ubuntu host behind Caddy, served at **finance.itnog.ru**.

## Stack
- Node (Express API + prebuilt Angular in `client/dist/client`), served by one
  process on port 5000 under systemd (`User=mymoney`, `WorkingDirectory=/opt/mymoney`).
- PostgreSQL (database `mymoney`). Connection + `JWT_SECRET` come from
  `/opt/mymoney/.env` (not committed):

  ```
  NODE_ENV=production
  PORT=5000
  DB_NAME=mymoney
  DB_USER=mymoney
  DB_PASSWORD=...
  DB_HOST=localhost
  DB_PORT=5432
  JWT_SECRET=...
  ```
- Caddy reverse-proxies `finance.itnog.ru` to `localhost:5000` (automatic HTTPS).

## Install / update
```
cd /opt/mymoney
npm install --omit=dev --legacy-peer-deps      # backend deps only
sudo systemctl restart mymoney
```

## Currency rates (CBR)
Rates (USD/EUR in RUB) are fetched server-side from the Central Bank of Russia
and written to `currency_date` — this replaced the dead apilayer.net client call.

- Daily updater: `scripts/update_currency.js`, run by `mymoney-currency.timer`.
- One-off history backfill: `scripts/backfill_currency.js`
  (`BACKFILL_START=YYYY-MM-DD` optional, defaults to 2025-04-16).

Install the timer:
```
sudo cp deploy/mymoney-currency.service deploy/mymoney-currency.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now mymoney-currency.timer
sudo systemctl start mymoney-currency.service   # run once now
```

currency ids: `0=RUB, 1=USD, 2=EUR`. A row `(date, 0, 1, value)` means RUB per
1 USD; `(date, 0, 2, value)` means RUB per 1 EUR.
