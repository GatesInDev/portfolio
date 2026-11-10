import base64
import importlib.util
import json
import unittest
from unittest.mock import patch
from pathlib import Path

spec = importlib.util.spec_from_file_location('sync', Path(__file__).parents[1] / 'scripts/sync-projects.py')
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)

class CatalogTests(unittest.TestCase):
    repo = dict(name='PDV', full_name='GatesInDev/PDV', html_url='https://github.com/GatesInDev/PDV', language='C#', description=None, homepage='https://demo.example')

    def build(self, meta):
        def optional(path, default):
            if path.endswith('/readme'):
                return {'content': base64.b64encode(b'# Project').decode()}
            if path.endswith('/project.json'):
                return {'content': base64.b64encode(json.dumps(meta).encode()).decode()} if meta is not None else None
            return [{'name': name, 'type': 'file', 'download_url': 'https://raw.example/' + name} for name in ['01-screen.webp','cover.webp']]
        with patch.object(sync, 'optional', side_effect=optional):
            return sync.build_project(self.repo)

    def test_cover_first_and_metadata(self):
        p = self.build({'title':'PDV <Desktop>', 'cover':'cover.webp', 'gallery':['01-screen.webp'], 'category':'dotnet','featured':True,'tags':['C#','WPF']})
        self.assertEqual(p['gallery'][0],p['image'])
        self.assertEqual(p['title'],'PDV &lt;Desktop&gt;')
        self.assertEqual(p['tags'],['C#','WPF'])
        self.assertTrue(p['featured'])

    def test_missing_metadata_does_not_overwrite_editorial_fields(self):
        p=self.build(None)
        self.assertNotIn('category',p)
        self.assertNotIn('featured',p)
        self.assertEqual(p['description'],'')
        self.assertEqual(p['readme'],'# Project')

    def test_explicit_null_demo_hides_paused_website(self):
        self.assertIsNone(self.build({'demoUrl':None})['demoUrl'])

    def test_missing_image_fails(self):
        with self.assertRaises(ValueError): self.build({'gallery':['missing.png']})

    def test_unsafe_demo_is_not_linked(self):
        self.assertIsNone(self.build({'demoUrl':'javascript:alert(1)'})['demoUrl'])

    def test_invalid_tags_fail(self):
        with self.assertRaises(ValueError): self.build({'tags':'C#'})

if __name__=='__main__': unittest.main()
