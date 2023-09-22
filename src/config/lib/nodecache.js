const NodeCache = require('node-cache');
const cache = new NodeCache();

const getValue = key => process.env[key] || cache.get(key);
const setValue = (key, value) => cache.set(key, value);
const getAllKeys = () => cache.keys();

module.exports = {
  getValue,
  setValue,
  getAllKeys,
};
