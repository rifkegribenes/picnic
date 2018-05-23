'use strict';

module.exports = {
  'url' : process.env.MONGO_URI,
  options: {
		keepAlive: 1,
		connectTimeoutMS: 30000,
		reconnectTries: 30,
		reconnectInterval: 5000
		}
};
