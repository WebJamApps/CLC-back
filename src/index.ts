import Koa from 'koa';
import Router from '@koa/router';
import render from 'koa-ejs';
import path from 'path';
import Debug from 'debug';
import dotenv from 'dotenv';
import Breeze from './breeze';
import cors from '@koa/cors';
import enforceHttps from 'koa-sslify';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import bodyParser from 'koa-bodyparser';
import morgan from 'koa-morgan';
import send from 'koa-send';
import ReadCSV from './ReadCSV';

dotenv.config();
const debug = Debug('CLC-back:index');

const corsOptions= {
    origin: JSON.parse(process.env.AllowUrl || '{}').urls,
    credentials: true,
    optionsSuccessStatus: 200,
};

const readCsv = new ReadCSV();
const app = new Koa();
const router = new Router();

if (process.env.NODE_ENV === 'production' && process.env.BUILD_BRANCH === 'master') app.use(enforceHttps({ port: 4444 }))
app.use(serve(path.normalize(path.join(__dirname, '../CollegeLutheran/dist'))));
app.use(cors(corsOptions));
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(helmet.contentSecurityPolicy({
    directives: {
        'defaultSrc': ["'self'"],
        'baseUri': ["'self'"],
        'fontSrc': ["'self'", 'https:', 'data:'],
        'frameSrc': ["'self'", 'https://accounts.google.com', 'https://www.facebook.com', 'https://open.spotify.com',
          'https://w.soundcloud.com', 'https://www.youtube.com', 'https://dl.dropboxusercontent.com', 'https://js.stripe.com'],
        'frameAncestors': ["'self'"],
        'imgSrc': ["'self'", 'data:', 'https:', 'https://dl.dropboxusercontent.com'],
        'mediaSrc': ["'self'", 'https://dl.dropboxusercontent.com'],
        'objectSrc': ["'none'"],
        'scriptSrc': ["'self'", 'https://accounts.google.com', 'https://maps.googleapis.com', 'https://apis.google.com', 'https://cdn.tiny.cloud',
          'https://w.soundcloud.com', 'https://www.youtube.com', 'https://s.ytimg.com', 'https://cdnjs.cloudflare.com', 'https://js.stripe.com'],
        'scriptSrcAttr': ["'none'"],
        'styleSrc': ["'self'", 'https:', "'unsafe-inline'"],
        'connectSrc': ["'self'", 'ws:', 'wss:'],
      },
}));
app.use(bodyParser());
router.post('/submit', (ctx) => {
    const jsonData = ctx.request.body; //access parsed JSON data
    console.log(jsonData);
    ctx.body = 'Successfully submitted JSON data'
});
app.use(morgan('tiny'));
// // routes(app);
router.get(':splat*', async (ctx) => {
    const indexPath = path.normalize(path.join(__dirname, '../CollegeLutheran/dist/index.html'));
    await send(ctx, indexPath);
});

app.on('error', (err) => {
    console.log(err);
});

render(app, {
    root: path.join(__dirname, '../CLC-back/dist'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
})

router.get('/members', async (ctx) => {
    try {
        const subDomain = (process.env.SUB_DOMAIN || '');
        const breezeKey = (process.env.API_KEY || '');
        const breeze = new Breeze(subDomain, breezeKey);
        const people = await breeze.people.list({ limit: 5 });
        ctx.body = people;
        ctx.status = 200;
    } catch (error:any) {
        ctx.status = error.res ? error.res.status : 500;
        ctx.body = { error: 'An error occured' };
    }
})
// app.use(async (ctx) => {
//     ctx.status = 404;
//     ctx.body = 'Not Found';
// });
// app.use(async (ctx) => {
//     ctx.throw(500, 'error');
// });

app.use(router.routes())
.use(router.allowedMethods());

if (process.env.NODE_ENV !== 'test') {
const port = process.env.PORT || 4444;
app.listen(port, async () => {
    debug('running in debug mode');
    console.log(`Magic is happening on port ${port}`);
    const result = await readCsv.run();
    debug(result);
});
}
debug(`isTTY?: ${process.stderr.isTTY}`);

export default app;

