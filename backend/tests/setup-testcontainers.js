const { GenericContainer } = require('testcontainers');

let postgresContainer;

// Setup test database with testcontainers
const setupTestContainer = async () => {
  console.log('Starting PostgreSQL test container...');
  
  postgresContainer = await new GenericContainer('postgres:15-alpine')
    .withEnvironment({
      POSTGRES_DB: 'test_db',
      POSTGRES_USER: 'test_user',
      POSTGRES_PASSWORD: 'test_pass'
    })
    .withExposedPorts(5432)
    .start();

  const host = postgresContainer.getHost();
  const port = postgresContainer.getMappedPort(5432);
  
  process.env.DATABASE_URL = `postgresql://test_user:test_pass@${host}:${port}/test_db`;
  
  console.log(`Test database available at: ${process.env.DATABASE_URL}`);
};

const teardownTestContainer = async () => {
  if (postgresContainer) {
    await postgresContainer.stop();
  }
};

module.exports = {
  setupTestContainer,
  teardownTestContainer
};