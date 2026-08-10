const createApp = require('./app');
const environment = require('./config/environment');
const { connectDatabase } = require('./config/database');

const start = async () => {
  await connectDatabase(environment.mongoUri);
  const app = createApp();
  app.listen(environment.port, () => process.stdout.write(`Library Management API running on port ${environment.port}\n`));
};

start().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
