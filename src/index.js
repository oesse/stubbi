import 'regenerator-runtime/runtime';
import app from './server';

const port = process.env.STUBBI_PORT || 3333;

app.listen(port);
// eslint-disable-next-line no-console
console.log(`Stubbi listening on port ${port} ...`);
