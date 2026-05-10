import { Router } from 'express';
import pinterest from '../../../integrations/pinterest/routes.js';
import discord from '../../../integrations/discord/routes.js';
import openai from '../../../integrations/openai/routes.js';
import riot from '../../../integrations/riot/routes.js';

const r = Router();

r.use('/pinterest', pinterest);
r.use('/discord', discord);
r.use('/openai', openai);
r.use('/riot', riot);

export default r;
