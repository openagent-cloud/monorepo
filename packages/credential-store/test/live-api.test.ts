/**
 * Live API Test Script
 * 
 * This script tests the credential store API running on localhost:5860.
 * It makes real HTTP requests to the API and verifies the responses.
 * 
 * To run this test:
 * 1. Make sure the API is running (make dev)
 * 2. Run: npx ts-node test/live-api.test.ts
 */

import axios from 'axios';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const API_URL = 'http://localhost:5860';
// You should set this to a valid API key for your test tenant
const API_KEY = process.env.TEST_API_KEY || 'your-test-api-key';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Test results tracking
let passedTests = 0;
let failedTests = 0;
let skippedTests = 0;

/**
 * Run a test and track the result
 */
async function runTest(name: string, testFn: () => Promise<void>): Promise<void> {
  try {
    console.log(`${colors.blue}Running test: ${name}${colors.reset}`);
    await testFn();
    console.log(`${colors.green}✓ Passed: ${name}${colors.reset}`);
    passedTests++;
  } catch (error) {
    console.error(`${colors.red}✗ Failed: ${name}${colors.reset}`);
    console.error(`${colors.red}Error: ${error.message}${colors.reset}`);
    if (error.response) {
      console.error(`${colors.red}Response status: ${error.response.status}${colors.reset}`);
      console.error(`${colors.red}Response data: ${JSON.stringify(error.response.data, null, 2)}${colors.reset}`);
    }
    failedTests++;
  }
}

/**
 * Skip a test
 */
function skipTest(name: string, reason: string): void {
  console.log(`${colors.yellow}Skipping test: ${name} (${reason})${colors.reset}`);
  skippedTests++;
}

/**
 * Assert that a condition is true
 */
function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

/**
 * Main test function
 */
async function runTests(): Promise<void> {
  console.log(`${colors.magenta}Starting live API tests for ${API_URL}${colors.reset}`);
  console.log(`${colors.magenta}Using API key: ${API_KEY.substring(0, 3)}...${API_KEY.substring(API_KEY.length - 3)}${colors.reset}`);

  // Test 1: API should return 401 for protected endpoints without API key
  await runTest('API requires authentication', async () => {
    try {
      await axios.get(`${API_URL}/credentials`);
      throw new Error('Expected 401 error but request succeeded');
    } catch (error) {
      assert(error.response.status === 401, `Expected status 401 but got ${error.response.status}`);
      assert(error.response.data.message === 'API key is required', 
        `Expected error message 'API key is required' but got '${error.response.data.message}'`);
    }
  });

  // Test 2: API should return 404 for non-existent endpoints
  await runTest('API returns 404 for non-existent endpoints', async () => {
    try {
      await axios.get(`${API_URL}/non-existent-endpoint`);
      throw new Error('Expected 404 error but request succeeded');
    } catch (error) {
      assert(error.response.status === 404, `Expected status 404 but got ${error.response.status}`);
    }
  });

  // Test 3: Credentials endpoint should be accessible with valid API key
  await runTest('Credentials endpoint is accessible with valid API key', async () => {
    try {
      const response = await axios.get(`${API_URL}/credentials`, {
        headers: { 'x-api-key': API_KEY }
      });
      assert(response.status === 200, `Expected status 200 but got ${response.status}`);
      assert(Array.isArray(response.data), 'Expected response data to be an array');
    } catch (error) {
      // If we get a 401, the API key might be invalid
      if (error.response && error.response.status === 401) {
        console.warn(`${colors.yellow}Warning: API key might be invalid. Skipping remaining tests that require authentication.${colors.reset}`);
        throw new Error('API key appears to be invalid. Please check your TEST_API_KEY environment variable.');
      }
      throw error;
    }
  });

  // Test 4: Analytics endpoint should be accessible with valid API key
  await runTest('Analytics endpoint is accessible with valid API key', async () => {
    const response = await axios.get(`${API_URL}/analytics/tokens`, {
      headers: { 'x-api-key': API_KEY }
    });
    assert(response.status === 200, `Expected status 200 but got ${response.status}`);
    // Check that the response has the expected structure
    assert(typeof response.data.totalTokensUsed === 'number', 'Expected totalTokensUsed to be a number');
    assert(typeof response.data.promptTokens === 'number', 'Expected promptTokens to be a number');
    assert(typeof response.data.completionTokens === 'number', 'Expected completionTokens to be a number');
  });

  // Test 5: Swagger documentation should be accessible
  await runTest('Swagger documentation is accessible', async () => {
    const response = await axios.get(`${API_URL}/api`);
    assert(response.status === 200, `Expected status 200 but got ${response.status}`);
    assert(response.data.includes('swagger'), 'Expected response to contain Swagger UI');
  });

  // Print test summary
  console.log(`\n${colors.magenta}Test Summary:${colors.reset}`);
  console.log(`${colors.green}Passed: ${passedTests}${colors.reset}`);
  console.log(`${colors.red}Failed: ${failedTests}${colors.reset}`);
  console.log(`${colors.yellow}Skipped: ${skippedTests}${colors.reset}`);

  if (failedTests > 0) {
    console.log(`\n${colors.red}Some tests failed. Please check the error messages above.${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}All tests passed!${colors.reset}`);
    process.exit(0);
  }
}

// Run the tests
runTests().catch(error => {
  console.error(`${colors.red}Error running tests: ${error.message}${colors.reset}`);
  process.exit(1);
});
