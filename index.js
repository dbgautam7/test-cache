const fs = require('fs')
const { redisClient } = require('./redisClient')
const MONGODB_URL = "mongodb+srv://gautamdb7:gautamdb7@cluster0.oke4bhs.mongodb.net/"
const setUpGears = async () => {
    const requirements = ['rgsync', 'pymongo==3.12.0']
    const writeBehindCode = fs.readFileSync('./write-behind.py', 'utf-8').toString().replace('%MONGODB_CONNECTION_URL%', MONGODB_URL)
    const params = [
        'RG.PYEXECUTE',
        writeBehindCode,
        'REQUIREMENTS',
        ...requirements,
    ]
    try {
        await redisClient.sendCommand(params)
        console.log('Redis gears write behind setup completed');
    } catch (err) {
        console.log('Redis gears write behind setup failed', err);
    }
}

const setWatchHistory = async (watchHistory, userId) => {
    const key = `users:${userId}`
    const keyExists = await redisClient?.exists(key)
    console.log(keyExists, "keyExists");
    if (!keyExists) {
        await redisClient?.json.set(key, '.', { watchHistory })
        return;
    }
    const user = await redisClient?.json?.get(key)
    await redisClient?.json.set(key, '$.watchHistory', {
        ...(user?.watchHistory ?? {}),
        ...watchHistory
    })

}

const handleCache = async () => {
    try {
        await redisClient.flushDb()
        await setUpGears()
        const userId = '1234'

        await setWatchHistory({ 1: 10 }, userId)
        await setWatchHistory({ 2: 20 }, userId)
        // process.exit()
    } catch (error) {
        console.log(error, "error====");
    }
}

handleCache()