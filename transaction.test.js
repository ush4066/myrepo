const { fastify } = require('./index'); // Import Fastify
const { Pool } = require('pg'); // Import PostgreSQL client
const supertest = require('supertest'); // Import supertest for HTTP testing

jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(), // Mock the query method
  };
  return { Pool: jest.fn(() => mPool) }; // Mock the Pool class to return mPool
});
// Basically To isolate the server logic from the database, 
//ensuring tests run consistently without depending on a real database.

describe('POST /transaction', () => { //endpoint being tested 
  let request;
  let poolInstance;

  beforeAll(async () => {
    await fastify.ready(); // Ensure Fastify is ready
    request = supertest(fastify.server); // Wrap Fastify for HTTP testing
    poolInstance = new Pool(); // Mocked Pool
  });

  afterAll(async () => {
    await fastify.close(); // Close Fastify
  });
//Define a test case To validate that the endpoint correctly handles a credit transaction.
  it('should process a credit transaction successfully', async () => {
    // Seed data test input for this scenario
    const transactionData = { accountId: 1, amount: 500 };

    // Mock database calls.To test how the endpoint handles different 
    //database interactions without using a real database.
    poolInstance.query
      .mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, current_balance: 1000, minimum_balance: 100 }],
      }) // Fetch account. Indicates the account exists.
      .mockResolvedValueOnce({ rowCount: 1 }) // Update balance. 
      .mockResolvedValueOnce({ rowCount: 1 }); // Insert transaction
    
    const res = await request.post('/transaction').send(transactionData);
//Response Assertions. To validate the endpoint's output matches the expected result for a successful transaction.
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      status: 'Transaction successful',
      oldBalance: 1000,
      newBalance: 1500,
    });
//Database call assertions. checks the logic of these three queries.
    expect(poolInstance.query).toHaveBeenCalledTimes(3);
    expect(poolInstance.query).toHaveBeenNthCalledWith(
      1,
      'SELECT * FROM accounts WHERE id = $1',
      [transactionData.accountId]
    );
    expect(poolInstance.query).toHaveBeenNthCalledWith(
      2,
      'UPDATE accounts SET current_balance = $1 WHERE id = $2',
      [1500, transactionData.accountId]
    );
    expect(poolInstance.query).toHaveBeenNthCalledWith(
      3,
      'INSERT INTO transactions (account_id, amount, transaction_type) VALUES ($1, $2, $3)',
      [transactionData.accountId, transactionData.amount, 'credit']
    );
  });
});
