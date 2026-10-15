import { Router } from 'express';
import pinterest from '../../../integrations/pinterest/routes.js';
import discord from '../../../integrations/discord/routes.js';
import openai from '../../../integrations/openai/routes.js';
import riot from '../../../integrations/riot/routes.js';
import osu from '../../../integrations/osu/routes.js';
import osuLinking from '../../../integrations/osu-linking/runtime.js';
import roblox from '../../../integrations/roblox/runtime.js';
import steam from '../../../integrations/steam/runtime.js';

const r = Router();

r.use('/pinterest', pinterest);
r.use('/discord', discord);
r.use('/openai', openai);
r.use('/riot', riot);
r.use('/osu', osuLinking);
r.use('/osu', osu);
r.use('/roblox', roblox);
r.use('/steam', steam);

export default r;
