const app = require('./src/app');
const keys = require('./src/config/keys')

app.listen(keys.port, () => {
  console.log(`Listening: http://localhost:${keys.port}`);
});