const { ClickHouseClient, createClient } = require('@clickhouse/client'); // or '@clickhouse/client-web'

/**
 * @typedef {Object} Meta
 * @property {string} name
 * @property {string} type
 */

/**
 * @typedef {Object} Statistics
 * @property {number} elapsed
 * @property {number} rows_read
 * @property {number} bytes_read
 */

/**
 * @typedef {Object} ClickHouseResultSet
 * @property {Meta[]} meta
 * @property {T[]} data
 * @property {number} rows
 * @property {Statistics} statistics
 * @template T
 */

/**
 * @typedef {Object} Count
 * @property {number} c
 */

// Please replace client connection parameters like `host`
// `username`, `password`, `database` as needed.

/**
 * @returns {Promise<ClickHouseClient>}
 */
const initClickHouseClient = async () => {
    const client = createClient({
        host: 'https://fehvnyuam0.ap-southeast-1.aws.clickhouse.cloud:8443', // Replace with your ClickHouse host URL
        username: 'default',                      // Replace with your ClickHouse username
        password: '_HCURe30PDkBK',                     // Replace with your ClickHouse password
        database: 'system',                      // Replace with your ClickHouse database name
        application: 'pingpong',
    });

    console.log('ClickHouse ping');
    if (!(await client.ping())) {
        throw new Error('failed to ping ClickHouse!');
    }
    console.log('ClickHouse pong!');
    return client;
};

const main = async () => {
    console.log('Initialising ClickHouse client');
    const client = await initClickHouseClient();

    const row = await client.query({
        query: `SELECT count() AS c FROM system.users WHERE name='default'`,
    });

    /** @type {ClickHouseResultSet<Count>} */
    const jsonRow = await row.json();
    console.log(jsonRow, "dddddd");
    console.log(`I have found ${jsonRow.data[0].c} system tables!`);

    await client.close();
    console.log('👋');
};

main();
