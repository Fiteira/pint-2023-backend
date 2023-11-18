const NodeCache = require("node-cache");

// create a new instance of NodeCache
const cache = new NodeCache();

// export the cache object
module.exports = cache;