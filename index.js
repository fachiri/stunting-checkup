const app = require('./src/app');
const { port } = require('./src/config/keys')

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});