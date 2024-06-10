const createUser = async (req, res) => {
    const clickhouseClient = req.app.locals.clickhouseClient;
    const { user_id, message, timestamp, metric } = req.body;

    // Validate input
    if (!user_id || !message || !timestamp || !metric) {
        return res.status(400).send({ error: 'Missing required fields' });
    }

    try {
        const data = await clickhouseClient.insert({
            table: 'users',
            values: [{ user_id, message, timestamp, metric }],
            format: 'JSONEachRow'
        });

        res.status(201).send({ message: 'New user added successfully', data });
    } catch (error) {
        console.error('Error adding new user:', error);
        res.status(500).send({ error: 'An error occurred while adding the new user' });
    }
};

module.exports = createUser;
