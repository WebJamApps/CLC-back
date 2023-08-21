import Koa from 'koa';
import Router from '@koa/router';
import render from 'koa-ejs';
import path from 'path';
import Debug from 'debug';
import axios from 'axios';
import dotenv from 'dotenv';
import Breeze from 'breeze-chms';

dotenv.config();
const debug = Debug('CLC-back:index');
const app = new Koa();
const router = new Router();

render(app, {
    root: path.join(__dirname, '../CLC-back/dist'),
    layout: 'index',
    viewExt: 'html',
    cache: false,
    debug: true
})

// router.get('/members', async (ctx) => {
//     try {
//         const breezeKey = process.env.API_KEY;
//         const breezeUrl = 'https://churchoftommy.breezechms.com/people';
//         const res = await axios.get(breezeUrl, {
//             headers: {
//                 'Authorization': `Bearer ${breezeKey}`,
//                 'Accept': 'application/json',
//             },
//         });    
//         ctx.body = res.data;
//         ctx.status = res.status;
//     } catch (error:any) {
//         ctx.status = error.res ? error.res.status : 500;
//         ctx.body = { error: 'An error occured' };
//     }
// })

router.get('/members', async (ctx) => {
    try {
        const breeze = new Breeze('SUB_DOMAIN', 'API_KEY');
        const people = await breeze.people.get('PERSON_ID');
        ctx.body = people;
    } catch (error:any) {
        console.error('Error fetching data:', error);
        ctx.staus = 500;
        ctx.body = 'Internal Server Error';
    }
});

router.get('status', '/health-check', (ctx) => {
    ctx.status = 200;
    ctx.body   = {message: 'success'};
  });

app.use(router.routes())
.use(router.allowedMethods());

const port = process.env.PORT || 4444;
app.listen(port, async () => {
    debug('running in debug mode');
    console.log(`Magic is happening on port ${port}`);
})
