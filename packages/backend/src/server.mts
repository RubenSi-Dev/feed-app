import app from './app.mjs';

const PORT = 3000;

console.log('Server side shared types imported successfully!');

try {
  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}`);
  });
} catch (err) {
  console.error(err);
}
