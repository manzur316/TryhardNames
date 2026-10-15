import React from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { PassThrough } from 'node:stream';
import { Buffer } from 'node:buffer';
import App from './App.jsx';

// Run sequentially: react-helmet's server collector is global.
export function renderPage(location) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks = [];
    let failure;
    const timeout = setTimeout(() => {
      stream.abort();
      reject(new Error('Prerender timed out: ' + location));
    }, 30_000);
    output.on('data', chunk => chunks.push(chunk));
    output.on('error', reject);
    output.on('end', () => {
      clearTimeout(timeout);
      const head = Helmet.renderStatic();
      if (failure) return reject(failure);
      resolve({
        body: Buffer.concat(chunks).toString('utf8'),
        head: head.title.toString() + head.meta.toString() + head.link.toString() + head.script.toString(),
      });
    });
    const stream = renderToPipeableStream(<App router={StaticRouter} location={location} />, {
      onAllReady() { stream.pipe(output); },
      onError(error) { failure = error; },
      onShellError(error) {
        clearTimeout(timeout);
        Helmet.renderStatic();
        reject(error);
      },
    });
  });
}
