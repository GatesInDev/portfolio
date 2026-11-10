# Markdown dependencies

Vendored ESM distributions, served locally without a CDN at runtime:

- marked 18.2.0: `marked/lib/marked.esm.js` (MIT, see marked.LICENSE).
- DOMPurify 3.4.17: `dompurify/dist/purify.es.mjs` (see purify.LICENSE).

To update, install the desired npm versions, copy these distributions and licenses, and run `npm test`. Sanitize rendered Markdown before inserting it into the document.
