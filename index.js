const fastify = require('fastify')({ logger: true });
const { error } = require('console');
const { Pool } = require('pg');

// PostgreSQL connection
const pool = new Pool({
  user: 'ht',
  host: 'localhost',
  database: 'banking_app',
  password: 'pass',
  port: 4321,
});

fastify.decorate('db', pool);

// Onboard new customer
fastify.post('/onboard-customer', async (request, reply) => {
  const client = await fastify.db.connect();
  try {
    const { name, address, mobile } = request.body;
    if(name.length<3 || address.length<5 || mobile.length < 10){
      throw new Error('please fill required field correctly')
    }
    const mobileCheck = await client.query('SELECT * FROM customers WHERE mobile = $1', [mobile]);
    if (mobileCheck.rowCount > 0) {
      throw new Error('Mobile number already exists');
    }
    const res = await client.query('INSERT INTO customers (name, address, mobile) VALUES ($1, $2, $3) RETURNING *', [name, address, mobile]);
    return { customerId: res.rows[0].id };
  } catch (error) {
    reply.status(400).send({ error: error.message });
  } finally {
    client.release();
  }
});

// Update customer address
fastify.put('/update-customerAddress', async (request, reply) => {
  const client = await fastify.db.connect();
  try {
    const { address, customerId } = request.body;
    const oldAddressFetch = await client.query('select address from customers WHERE id = $1', [customerId]);
    const oldAddress = oldAddressFetch.rows[0].address
    if (oldAddress === address) {
      reply.status(401).send({
        status: 'failed',
        message: ` Address Already Exist : ${address}`,
      })
      return
    }
    await client.query('UPDATE customers SET address = $1 WHERE id = $2', [address, customerId]);
    return {
      status: 'Adress Updated Successfully',
      oldAddress,
      newAdress: address
    };
  } finally {
    client.release();
  }
});

// Manager approval
fastify.post('/manager-approval', async (request, reply) => {
  const client = await fastify.db.connect();
  try {
    const { customerId, approve } = request.body;
    await client.query('UPDATE customers SET manager_approval = $2 WHERE id = $1', [customerId, approve]);
    if (!approve) {
      return { status: 'Manager approval canceled' };
    }
    return { status: 'Manager approved' };
  } finally {
    client.release();
  }
});

// Compliance approval
fastify.post('/compliance-approval', async (request, reply) => {
  const client = await fastify.db.connect();
  try {
    const { customerId, approve } = request.body
    await client.query('UPDATE customers SET compliance_approval = $2 WHERE id = $1', [customerId, approve]);
    if (!approve) {
      return { status: 'Compliance approval canceled' };
    }
    return { status: 'Compliance approved' };
  } finally {
    client.release();
  }
});

// Create new account
fastify.post('/create-account', async (request, reply) => {
  const client = await fastify.db.connect();
  try {
    const { customerId, initialDeposit, minimumBalance } = request.body;
    checkCustomerAccount = await client.query('SELECT * FROM accounts WHERE customer_id = $1', [customerId])
    if (checkCustomerAccount.rowCount > 0) {
      return { status: "Account already exist", accountId: checkCustomerAccount.rows };
    }
    const customerQuery = await client.query('SELECT * FROM customers WHERE id = $1', [customerId]);
    if (customerQuery.rowCount === 0) {
      reply.status(401).send({ message: 'Customer not found' });
      return
    }
    const customer = customerQuery.rows[0];
    if (!customer.manager_approval || (initialDeposit > 10000 && !customer.compliance_approval)) {
      reply.status(401).send({ message: 'Approval required' });
      return
    }
    if (initialDeposit < minimumBalance) {
      reply.status(401).send({ message: 'Initial deposit cannot be less than the minimum balance' });
      return
    }
    const res = await client.query('INSERT INTO accounts (customer_id, current_balance, minimum_balance) VALUES ($1, $2, $3) RETURNING *', [customerId, initialDeposit, minimumBalance]);
    return { status: "success", accountId: res.rows[0].id };
  } finally {
    client.release();
  }
});

// Transaction
fastify.post('/transaction', async (request, reply) => {
  const client = await fastify.db.connect();
  try {
    const { accountId, amount } = request.body;
    const accountQuery = await client.query('SELECT * FROM accounts WHERE id = $1', [accountId]);
    if (accountQuery.rowCount === 0) {
      throw new Error('Account not found');
    }
    const account = accountQuery.rows[0];

    const newBalance = account.current_balance + amount;
    if (newBalance < account.minimum_balance) {
      throw new Error('Transaction would result in balance falling below the minimum required');
    }
    await client.query('UPDATE accounts SET current_balance = current_balance + $1 WHERE id = $2', [amount, accountId]);
    const transactionType = amount >= 0 ? 'credit' : 'debit';
    await client.query('INSERT INTO transactions (account_id, amount, transaction_type) VALUES ($1, $2, $3)', [accountId, amount, transactionType]);
    return { status: 'Transaction successful', newBalance };
  } catch (error) {
    reply.status(400).send({ error: error.message });
  } finally {
    client.release();
  }
});

//Statement
fastify.get('/statement/:id', async (request, reply) => {
  const client = await fastify.db.connect();
  try {
    const { id } = request.params
    const balance = await client.query('select current_balance from accounts where id = $1', [id])
    const transaction = await client.query('select * from transactions where account_id = $1', [id])
    if (transaction.rowCount === 0) {
      reply.send({ message: 'No tranasction found' })
      return
    }

    reply.send({
    "current_balance" : balance.rows[0].current_balance,
      "All Transaction": transaction.rows
    })
  }
  catch (error) {
  reply.status(400).send({ error: error.message });
  console.log(error)
} finally {
  client.release()
}
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: 'localhost' });
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
