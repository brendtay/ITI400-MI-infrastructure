import express from 'express';
import { createServer } from 'vite';

async function start() {
  // Create Vite server
  const vite = await createServer({
    server: { middleware: true }
  });

  // Create Express app
  const app = express();

  // Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // Define your API routes
  app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from the Express server!' });
  });

  // Serve static files (optional)
  app.use(express.static('public'));

  // Start the server
  app.listen(3000, () => {
    console.log('Server is running at http://localhost:3000');
  });
}

start();
