const devData = require('./data/development-data/index.js');
const seed = require('./seed');
const connection = require('./connection');

const runSeed = async () => {
  await seed(devData);
  connection.end();
};

runSeed();
