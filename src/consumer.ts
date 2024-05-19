import { createClient } from 'redis';

const client = createClient();

async function processOp(intenseOp: string) {
  const { operation } = JSON.parse(intenseOp);

  console.log(`Processing ${operation}...`);

  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log(`Finished processing ${operation}. That was hard.`);
}

export async function startConsumer() {
  try {
    await client.connect();
    console.log('Worker connected to Redis.');

    // Main loop
    // eslint-disable-next-line no-constant-condition
    while (true) {
      try {
        const op = await client.brPop('operations', 0);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await processOp(op.element);
      } catch (error) {
        console.error('Error processing submission:', error);
      }
    }
  } catch (error) {
    console.error('Failed to connect to Redis', error);
  }
}
