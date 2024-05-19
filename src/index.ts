import express from 'express';
import { createClient } from 'redis';
import { startConsumer } from './consumer';

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.json());

const client = createClient();
client.on('error', (err) => console.log('Redis Client Error', err));

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/intense-operation', async (req, res) => {
  const operation = req.body.operation;

  try {
    await client.lPush(
      'operations',
      JSON.stringify({
        operation,
      }),
    );
    res.status(200).send('Received and stored.');
  } catch (error) {
    console.error('Redis error:', error);
    res.status(500).send('Failed to store');
  }
});

async function start() {
  try {
    await client.connect();
    console.log('Connected to Redis');

    app.listen(8080, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to connect', error);
  }
}

// Start the server, and listen on port 8080. void - we do not need to await this function
void start();
void startConsumer();
