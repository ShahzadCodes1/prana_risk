// Downloads the Higgsfield-generated photos into ./raw (run once: node scripts/fetch-photos.mjs)
import { mkdir, writeFile } from 'node:fs/promises';
import https from 'node:https';
import dns from 'node:dns';

// Some networks' DNS can't resolve the image CDN, so look it up through public resolvers instead.
const resolver = new dns.Resolver();
resolver.setServers(['1.1.1.1', '8.8.8.8', '9.9.9.9']);
const lookup = (host, opts, cb) =>
  resolver.resolve4(host, (err, addrs) => {
    if (err || !addrs?.length) return dns.lookup(host, opts, cb); // fall back to the system resolver
    if (opts && opts.all) cb(null, addrs.map((address) => ({ address, family: 4 })));
    else cb(null, addrs[0], 4);
  });

function get(url, tries = 3) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { lookup, timeout: 30000 }, (res) => {
        if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      })
      .on('timeout', function () { this.destroy(new Error('timeout')); })
      .on('error', reject);
  }).catch((e) => (tries > 1 ? get(url, tries - 1) : Promise.reject(e)));
}

const BASE = 'https://d8j0ntlcm91z4.cloudfront.net/user_3KvNsgniQ2R2aabdZz5MxZdmRhE/';
const PHOTOS = {
  'hero-wide': 'hf_20261106_202459_507a5eea-3c19-42f9-bff4-11463a57b419.jpeg',
  'hero-tall': 'hf_20261106_202459_9a7da6f7-bcc3-4864-90f3-ec515c8bbf59.jpeg',
  'mission': 'hf_20261106_202549_619b627c-8604-408c-8d4b-b13234cb9f62.jpeg',
  'cov-personal': 'hf_20261106_202550_08fa2c4f-5dd2-4150-be71-fc9821300b81.jpeg',
  'cov-business': 'hf_20261106_202549_70344465-bd97-461b-9084-87a426d4e0fd.jpeg',
  'cov-life': 'hf_20261106_202547_45945a8b-0699-4872-8c38-af201b8896ec.jpeg',
  'cov-health': 'hf_20261106_202547_0783d0ec-ae6e-4152-92fb-25e5acd7fe73.jpeg',
  'prod-condo': 'hf_20261106_202548_d81a1acc-cea6-4e05-a888-9d8d6eae50c1.jpeg',
  'prod-coop': 'hf_20261106_202549_dd2b88b4-4fe8-40ad-bbfd-7c0e384df9ea.jpeg',
  'prod-brownstone': 'hf_20261106_202546_ccdef9cc-0dda-49bf-9f5a-4fbe31a0bd0d.jpeg',
  'prod-home': 'hf_20261106_202548_148f824b-12f9-4862-ac58-427e41be6d54.jpeg',
  'prod-cyber': 'hf_20261106_202547_69efaeb9-dd96-49e0-a8b0-cbf356068d9b.jpeg',
  'prod-eo': 'hf_20261106_202546_4b209de8-6917-4071-a638-39bb3e0345d7.jpeg',
  'prod-life': 'hf_20261106_202547_c74c75a1-6f37-4f19-9f1e-2ec04556eb9e.jpeg',
  'contact': 'hf_20261106_202553_61fc2023-f09a-4a44-a9d4-158a258c69f7.jpeg',
};

await mkdir('raw', { recursive: true });
for (const [name, file] of Object.entries(PHOTOS)) {
  const buf = await get(BASE + file).catch((e) => { throw new Error(`${name}: ${e.message}`); });
  await writeFile(`raw/${name}.jpg`, buf);
  console.log('saved raw/' + name + '.jpg');
}
console.log('Done: ' + Object.keys(PHOTOS).length + ' photos in the raw folder.');
