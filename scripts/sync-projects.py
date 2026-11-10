"""Build the catalog from public, explicitly selected GitHub repositories."""
import base64
import html
import json
import os
from pathlib import Path
import urllib.error
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
EXTENSIONS = ('.png', '.jpg', '.jpeg', '.webp', '.gif')
CATEGORIES = {'dotnet', 'java', 'infra', 'web', 'linux', 'other'}


def get(path):
    headers = {'Accept': 'application/vnd.github+json'}
    if os.environ.get('GH_TOKEN'):
        headers['Authorization'] = 'Bearer ' + os.environ['GH_TOKEN']
    request = urllib.request.Request('https://api.github.com/' + path, headers=headers)
    with urllib.request.urlopen(request, timeout=30) as response:
        return json.load(response)


def optional(path, default):
    try:
        return get(path)
    except urllib.error.HTTPError as error:
        if error.code != 404:
            raise
        return default


def build_project(repo):
    base = 'repos/' + repo['full_name']
    doc = optional(base + '/readme', None)
    readme = base64.b64decode(doc['content']).decode('utf8') if doc else ''
    files = optional(base + '/contents/.portfolio', [])
    images = {f['name']: f['download_url'] for f in files
              if f['type'] == 'file' and f['name'].lower().endswith(EXTENSIONS)}
    manifest = optional(base + '/contents/.portfolio/project.json', None)
    meta = json.loads(base64.b64decode(manifest['content']).decode('utf8')) if manifest else {}
    if not isinstance(meta, dict):
        raise ValueError(f"{repo['name']}: project.json must be an object")
    ordered = meta.get('gallery', sorted(images, key=lambda name: (not name.startswith('cover.'), name)))
    cover = meta.get('cover', ordered[0] if ordered else None)
    if not isinstance(ordered, list) or any(not isinstance(name, str) or name not in images for name in ordered):
        raise ValueError(f"{repo['name']}: gallery references missing images")
    if cover is not None and cover not in images:
        raise ValueError(f"{repo['name']}: cover references a missing image")
    ordered = ([cover] if cover else []) + [name for name in ordered if name != cover]
    text = lambda value: html.escape(value or '', quote=True)
    description = meta.get('description', repo.get('description')) or ''
    project = dict(id=repo['name'], title=text(meta.get('title', repo['name'])),
                   description=text(description), fullDescription=text(meta.get('fullDescription', description)),
                   readme=readme, readmeUrl=doc.get('html_url') if doc else None,
                   readmeRawUrl=doc.get('download_url') if doc else None, tags=[text(repo['language'])] if repo.get('language') else [],
                   image=images.get(cover, ''), gallery=[images[name] for name in ordered],
                   repoUrl=repo['html_url'])
    for field in ('tags', 'features'):
        if field in meta:
            if not isinstance(meta[field], list) or not all(isinstance(x, str) for x in meta[field]):
                raise ValueError(f'{field} must be an array of strings')
            project[field] = [text(x) for x in meta[field]]
    if 'category' in meta:
        if meta['category'] not in CATEGORIES:
            raise ValueError('Unknown category')
        project['category'] = meta['category']
    if 'featured' in meta:
        if not isinstance(meta['featured'], bool):
            raise ValueError('featured must be boolean')
        project['featured'] = meta['featured']
    demo = meta.get('demoUrl', repo.get('homepage'))
    if 'demoUrl' in meta or demo:
        project['demoUrl'] = demo if isinstance(demo, str) and demo.startswith('https://') else None
    return project


def main():
    selected = set(json.loads((ROOT / 'scripts/project-repositories.json').read_text()))
    projects = []
    for page in range(1, 100):
        batch = get(f'users/GatesInDev/repos?per_page=100&page={page}')
        for repo in batch:
            if repo['private'] or repo['archived']:
                continue
            if repo['name'] in selected or 'portfolio' in repo.get('topics', []):
                projects.append(build_project(repo))
        if len(batch) < 100:
            break
    # Only replace the catalog after every request and manifest has succeeded.
    target = ROOT / 'js/github-projects.json'
    temporary = target.with_suffix('.tmp')
    temporary.write_text(json.dumps(projects, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(target)
    print(f'Synchronized {len(projects)} public projects')


if __name__ == '__main__':
    main()
