import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JSDOM } from 'jsdom';
const dom = new JSDOM('<!doctype html>', { url: 'https://portfolio.example/#project-PDV' });
globalThis.window = dom.window;
globalThis.document = dom.window.document;
const { renderReadme } = await import('../js/readme.js');
const catalog = JSON.parse(await readFile(new URL('../js/github-projects.json', import.meta.url)));

test('real project READMEs render headings, code, tables and repository images', () => {
    for (const item of catalog) {
        const article = renderReadme(item);
        assert.ok(article.querySelector('h1'));
        assert.ok(article.querySelector('pre > code'));
        assert.ok(article.querySelector('.readme-table table'));
        assert.ok(article.querySelectorAll('img').length);
        for (const image of article.querySelectorAll('img')) {
            assert.ok(image.src.startsWith('https://raw.githubusercontent.com/GatesInDev/'));
        }
    }
});
test('relative resources honor the README branch and directory', () => {
    const article = renderReadme({ readme: '[Guide](guide.md) ![UI](../img/ui.png)', readmeUrl: 'https://github.com/a/b/blob/develop/docs/README.md', readmeRawUrl: 'https://raw.githubusercontent.com/a/b/develop/docs/README.md' });
    assert.equal(article.querySelector('a').href, 'https://github.com/a/b/blob/develop/docs/guide.md');
    assert.equal(article.querySelector('img').src, 'https://raw.githubusercontent.com/a/b/develop/img/ui.png');
});
test('untrusted README HTML cannot execute scripts or inject page styles', () => {
    const article = renderReadme({ repoUrl: 'https://github.com/a/b', readme: '<script>alert(1)</script><style>body{display:none}</style><img src="https://example.com/a.png" onerror="alert(1)"><a href="javascript:alert(1)">bad</a><iframe src="https://example.com"></iframe><input type="text">' });
    assert.equal(article.querySelector('script,style,iframe,[onerror],input'), null);
    assert.equal(article.querySelector('a').hasAttribute('href'), false);
});
test('section links scroll locally without changing the portfolio route', () => {
    const article = renderReadme({ repoUrl: 'https://github.com/a/b', readme: '[Go](#instalação)\n\n## Instalação' });
    let scrolled = false;
    article.querySelector('h2').scrollIntoView = () => { scrolled = true; };
    const event = new dom.window.MouseEvent('click', { bubbles: true, cancelable: true });
    article.querySelector('a').dispatchEvent(event);
    assert.ok(event.defaultPrevented);
    assert.ok(scrolled);
    assert.equal(dom.window.location.hash, '#project-PDV');
});
