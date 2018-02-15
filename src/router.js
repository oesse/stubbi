import Router from 'express-promise-router';

const uriControlPrefix = process.env.STUBBI_CTRL_PREFIX || '/stubs';

const router = Router();

router.get('/', async (req, res) => res.send('Stubbi says hi!\n'));
router.use(uriControlPrefix, (req, res) => res.sendStatus(501));

export default router;
