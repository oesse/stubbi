import server from './server';

const port = process.env.STUBBI_PORT || 3333;
const uriControlPrefix = process.env.STUBBI_CTRL_PREFIX;

const app = server({ uriControlPrefix });
app.listen(port);
// eslint-disable-next-line no-console
console.log(`Stubbi listening on port ${port} ...`);
