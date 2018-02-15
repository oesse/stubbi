import 'regenerator-runtime/runtime';
import server from './server';

const port = process.env.STUBBI_PORT || 3333;

const app = server();
app.listen(port);
// eslint-disable-next-line no-console
console.log(`Stubbi listening on port ${port} ...`);
