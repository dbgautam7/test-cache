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
        await redisClient?.sendCommand(params)
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
// const setWatchHistory = async (watchHistory, userId) => {
//     const key = `users:${userId}`;
//     // Check if the key exists
//     const keyExists = await redisClient.exists(key);
//     console.log(keyExists, "keyExists");

//     if (!keyExists) {
//         // Serialize the watchHistory object and set it in Redis
//         await redisClient.set(key, JSON.stringify(watchHistory));
//         return;
//     }

//     // Retrieve the existing user data and deserialize it
//     const userData = await redisClient.get(key);
//     const parsedUserData = JSON.parse(userData);

//     // Update the watchHistory field with the new data
//     const updatedData = {
//         ...parsedUserData,
//         watchHistory: {
//             ...parsedUserData.watchHistory,
//             ...watchHistory
//         }
//     };

//     // Serialize the updated data and set it back in Redis
//     await redisClient.set(key, JSON.stringify(updatedData));
// };

const handleCache = async () => {
    const parse = await redisClient.get('doc')
    console.log(JSON.parse(parse), "dco")
    try {
        await redisClient.flushDb()
        await setUpGears()
        // const userId = '1234'

        // await setWatchHistory({ 1: 10 }, userId)
        // await setWatchHistory({ 2: 20 }, userId)
        // process.exit()
    } catch (error) {
        console.log(error, "error====");
    }
}

handleCache()