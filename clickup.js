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


/**
 * @returns {Promise<ClickHouseClient>}
 */
const initClickHouseClient = async () => {
    // const client = createClient({
    //     url: 'https://aga3g5grmd.asia-southeast1.gcp.clickhouse.cloud:8443', // Replace with your ClickHouse host URL
    //     username: 'default',                      // Replace with your ClickHouse username
    //     password: 'nZ1z3r7X_A6Re',                     // Replace with your ClickHouse password
    //     database: 'system',                      // Replace with your ClickHouse database name
    //     application: 'pingpong',
    // });
    const client = createClient({
        url: 'http://localhost:8123',  // Replace with your ClickHouse host URL
        username: 'default',           // Replace with your ClickHouse username
        password: '',                  // Replace with your ClickHouse password if any
        database: 'default',           // Replace with your ClickHouse database name
        application: 'pingpong',
    });

    console.log('ClickHouse ping');
    if (!(await client.ping())) {
        throw new Error('failed to ping ClickHouse!');
    }
    console.log('ClickHouse pong!');
    return client;
};

module.exports = { initClickHouseClient };

const main = async () => {
    console.log('Initialising ClickHouse client');
    const client = await initClickHouseClient();

    const row = await client.query({
        query: `SELECT * FROM users`,
        format: 'JSONEachRow',
    });

    /** @type {ClickHouseResultSet<Count>} */
    const jsonRow = await row.json();
    console.log(jsonRow, "dddddd");
    console.log(`I have found ${jsonRow?.length} user records!`);

    await client.close();
    console.log('👋');
};

main();


