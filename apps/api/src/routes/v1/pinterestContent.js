import { Router } from 'express';
import { fail } from '../../shared/apiResponse.js';
import { buildPinterestContentResponse } from '../../services/pinterest/buildPinterestContentPayload.js';
import { buildPinterestContentV2Response } from '../../services/pinterest/buildPinterestContentPayloadV2.js';
import { listPinterestContentTopicIds } from '../../services/pinterest/pinterestContentTopics.js';

const r = Router();

/**
 * SEO + creative payloads for Pinterest / DALL·E / n8n — backed by real TryhardNames
 * routes and the same name pools as the web generators.
 *
 * GET /api/v1/pinterest/content
 * Query: topic?, limit?, random?, usernameCount?
 */
r.get('/content', (req, res) => {
  const query = {
    topic: req.query.topic,
    limit: req.query.limit,
    random: req.query.random,
    usernameCount: req.query.usernameCount,
  };

  const body = buildPinterestContentResponse(query);
  if (body.ok === false) {
    return res.status(400).json(fail(body.error, {
      hint: body.hint,
      topics: body.topics,
    }));
  }

  return res.status(200).json(body);
});

/**
 * Generated Pinterest campaigns backed by Name Engine V2.
 *
 * GET /api/v1/pinterest/content-v2
 * Query: topic?, random?, count?, usernameCount?, visualFamily?, intent?
 */
r.get('/content-v2', (req, res) => {
  const query = {
    topic: req.query.topic,
    random: req.query.random,
    count: req.query.count,
    usernameCount: req.query.usernameCount,
    visualFamily: req.query.visualFamily,
    intent: req.query.intent,
  };

  const body = buildPinterestContentV2Response(query);
  if (body.ok === false) {
    return res.status(400).json(fail(body.error, {
      hint: body.hint,
      topics: body.topics,
      visualFamilies: body.visualFamilies,
    }));
  }

  return res.status(200).json(body);
});

r.get('/content/topics', (_req, res) => {
  res.status(200).json({
    ok: true,
    topics: listPinterestContentTopicIds(),
  });
});

export default r;
