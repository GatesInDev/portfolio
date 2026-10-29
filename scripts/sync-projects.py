"""Build the public portfolio catalog using only repositories with topic portfolio."""
import os,json,urllib.request,urllib.parse,base64,html,pathlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
def get(path):
    request=urllib.request.Request('https://api.github.com/'+path,headers={'Accept':'application/vnd.github+json','Authorization':'Bearer '+os.environ['GH_TOKEN']})
    with urllib.request.urlopen(request,timeout=30) as response:return json.load(response)
repos=[]
for page in range(1,100):
    batch=get(f'users/GatesInDev/repos?per_page=100&page={page}')
    repos.extend(batch)
    if len(batch)<100:break
projects=[]
for r in repos:
    if r['private'] or r['archived'] or 'portfolio' not in r.get('topics',[]):continue
    base='repos/'+r['full_name'];readme='';images=[]
    try:
        doc=get(base+'/readme');readme=base64.b64decode(doc['content']).decode('utf8')
    except urllib.error.HTTPError as error:
        if error.code!=404:raise
    try:
        images=[f for f in get(base+'/contents/.portfolio') if f['type']=='file' and f['name'].lower().endswith(('.png','.jpg','.jpeg','.webp','.gif'))]
    except urllib.error.HTTPError as error:
        if error.code!=404:raise
    images.sort(key=lambda f:(not f['name'].startswith('cover.'),f['name']))
    projects.append(dict(id=r['name'],title=html.escape(r['name']),description=html.escape(r['description'] or 'Projeto no GitHub'),fullDescription=html.escape(r['description'] or ''),readme=readme,tags=[r['language']] if r['language'] else [],category='other',image=images[0]['download_url'] if images else '',gallery=[f['download_url'] for f in images],repoUrl=r['html_url'],demoUrl=r['homepage'] if (r['homepage'] or '').startswith('https://') else None))
(ROOT/'js/github-projects.json').write_text(json.dumps(projects,ensure_ascii=False,indent=2)+'\n')
print(f'Synchronized {len(projects)} public projects')
