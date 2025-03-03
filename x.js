/*

const fastify = require('./index').fastify;
const { Pool } = require('pg');
const supertest = require('supertest');

// Globally mock the pg module. 
//pgsql database is mocked in this section.Jest's built-in mocking functionality is used to mock the pg module and its Pool class.
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('POST /transaction (credit scenario)', () => {
  let request;
  let poolInstance;

  beforeAll(async () => {
    await fastify.ready(); // Ensures Fastify is ready
    request = supertest(fastify.server);

    // Access the mocked instance of Pool
    poolInstance = new Pool();
  });

  afterAll(async () => {
    await fastify.close(); // Closes Fastify after tests
  });

  it('should successfully perform a credit transaction', async () => {
    const accountId = 1;
    const amount = 500; // Positive amount for credit. We are simulating 
    //a credit transaction where accountId is set to 1 and the amount to be credited is 500. 
   // These values are passed to the /transaction endpoint to simulate a real request.
   
   
   //After setting up the test data, you mock the poolInstance.query method to simulate the responses from the database.
   //These mocks represent three different queries that would normally be run against the database

    // Mock the poolInstance.query calls to simulate the database response
    poolInstance.query.mockResolvedValueOnce({
     rowCount: 1,
      rows: [{ id: accountId, current_balance: 10000, minimum_balance: 100 }]
    })
// this will simulate the database returning an account with a balance of 10000 and a minimum balance of 100

    poolInstance.query.mockResolvedValueOnce({ rowCount: 1 }); // Mock update balance
    poolInstance.query.mockResolvedValueOnce({ rowCount: 1 }); // Mock insert transaction

    // Make the request to the /transaction endpoint
    const res = await request.post('/transaction').send({ accountId, amount });

    // Log the query mock calls to verify the mock is working
    console.log('Mocked query calls:', poolInstance.query.mock.calls);

    // Log the response body and status to debug the issue
    console.log('Response Body:', res.body);
    console.log('Response Status:', res.status);

    // Asserting the status and response for a successful credit transaction
    expect(res.status).toBe(200); // This should pass if everything is correct
    expect(res.body).toEqual({
      status: 'Transaction successful',
      oldBalance: 10000,
      newBalance: 10500 // Old balance + amount = 1500
    });
  });
});

*/