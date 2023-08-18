// import Koa from 'koa';
import Debug from 'debug';

const Koa = require('koa');

const debug = Debug('CLC-back:index');

const port = 4444;

const app = new Koa();

app.use(async (ctx: { body: string; }) => (ctx.body="Welcome to koa"))

// const port = process.env.PORT || 4444;
// app.listen(port, async () => {
//     debug('running in debug mode');
//     console.log(`Magic is happening on port ${port}`);
// })

app.listen(port, () => console.log('Magic is happening'));
