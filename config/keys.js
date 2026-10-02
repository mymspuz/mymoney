module.exports = {
    dbName: process.env.DB_NAME || 'mymoney',
    dbUser: process.env.DB_USER || 'mymoney',
    dbPassword: process.env.DB_PASSWORD || '',
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || 5432,
    jwt: process.env.JWT_SECRET || 'dev-mspz'
}
