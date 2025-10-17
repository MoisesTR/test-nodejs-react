#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

async function waitForDatabase() {
  console.log('⏳ Waiting for PostgreSQL to be ready...');

  for (let i = 0; i < 30; i++) {
    try {
      execSync('docker compose exec -T database pg_isready -U admin', {
        stdio: 'pipe',
        cwd: path.join(__dirname, '..')
      });
      console.log('✅ PostgreSQL is ready!');
      return;
    } catch (e) {
      process.stdout.write('.');
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Database failed to start after 30 seconds');
}

async function setupTestEnvironment() {
  console.log('🚀 Setting up test environment...');

  try {
    // Check if Docker is running
    try {
      execSync('docker ps', { stdio: 'pipe' });
    } catch (e) {
      throw new Error('Docker is not running. Please start Docker and try again.');
    }

    // Start Docker database
    console.log('📦 Starting PostgreSQL database...');
    execSync('docker compose up database -d', {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    // Wait for database to be ready
    await waitForDatabase();

    console.log('\n✅ Test environment ready!');
    console.log('🧪 Database is running, Prisma will handle test database creation');

  } catch (error) {
    console.error('❌ Failed to setup test environment:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   - Make sure Docker is running: docker ps');
    console.log('   - Try: docker compose down && docker compose up database -d');
    console.log('   - Check logs: docker compose logs database');
    process.exit(1);
  }
}

setupTestEnvironment();