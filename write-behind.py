# Gears Recipe for a single write behind

# import redis gears & mongo db libs
from rgsync import RGJSONWriteBehind
from rgsync.Connectors import MongoConnector, MongoConnection

# change mongodb connection (admin)
# mongodb://usrAdmin:passwordAdmin@10.10.20.2:27017/dbSpeedMernDemo?authSource=admin
mongoUrl = '%MONGODB_CONNECTION_URL%'

# MongoConnection(user, password, host, authSource?, fullConnectionUrl?)
connection = MongoConnection('', '', '', '', mongoUrl)

# change MongoDB database
db = 'db'

# change MongoDB collection & it's primary key
userConnector = MongoConnector(connection, db, 'users', 'userId')

# change redis keys with prefix that must be synced with mongodb collection
RGJSONWriteBehind(GB,  keysPrefix='users',
                  connector=userConnector, name='UserWatchHistoryWriteBehind',
                  version='99.99.99')

