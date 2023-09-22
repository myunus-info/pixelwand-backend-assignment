const path = require('path');
const mongoose = require('mongoose');
const nodeCache = require(path.join(process.cwd(), 'src/config/lib/nodecache'));
const DB = nodeCache.getValue('DATABASE').replace('<PASSWORD>', nodeCache.getValue('DB_PASS'));

mongoose.set('strictQuery', false);
module.exports = mongoose.connect(DB);
