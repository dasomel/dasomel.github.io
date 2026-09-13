import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT=process.cwd();
const output=path.join(ROOT,'src','data','oss-adoption-discovery.json');
const token=process.env.GITHUB_TOKEN;
const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'dasomel-blog-adoption-discovery',...(token?{Authorization:`Bearer ${token}`}:{})};

const projects=[
  ['narwhal','dasomel/narwhal'],['narwhal-portal','dasomel/narwhal-portal'],
  ['nfs-quota-agent','dasomel/nfs-quota-agent'],['ldapium','dasomel/ldapium'],
  ['kube-ready-box','dasomel/kube-ready-box'],['clusterdeck','dasomel/clusterdeck'],
  ['beluga','dasomel/beluga'],['beluga-manager','dasomel/beluga-manager'],
  ['kubemetal','dasomel/kubemetal'],['openforge','dasomel/openforge'],
];

if (!token) {
  console.warn('GITHUB_TOKEN unavailable; keeping adoption discovery empty.');
  await fs.writeFile(output,'[]\n','utf8');
  process.exit(0);
}

const candidates=[];
for (const [project,repo] of projects) {
  const needle=`github.com/${repo}`;
  const query=encodeURIComponent(`"${needle}" in:file`);
  const response=await fetch(`https://api.github.com/search/code?q=${query}&per_page=5`,{headers});
  if (!response.ok) {
    console.warn(`Adoption search skipped for ${repo}: ${response.status}`);
    continue;
  }
  const body=await response.json();
  for (const item of body.items??[]) {
    const externalRepo=item.repository?.full_name;
    const externalOwner=item.repository?.owner?.login;
    if (!externalRepo || !externalOwner || externalOwner.toLowerCase()==='dasomel') continue;
    candidates.push({
      project,
      kind:'downstream-integration',
      status:'candidate',
      label:`${externalRepo} · ${item.path}`,
      sourceUrl:item.html_url,
      discoveredAt:new Date().toISOString(),
      note:`Automated exact repository-URL mention for ${repo}; requires human review before promotion.`,
      discovery:'github-code-search',
    });
  }
}
const unique=[...new Map(candidates.map((item)=>[item.sourceUrl,item])).values()]
  .sort((a,b)=>a.project.localeCompare(b.project)||a.label.localeCompare(b.label));
await fs.writeFile(output,`${JSON.stringify(unique,null,2)}\n`,'utf8');
console.log(`Discovered ${unique.length} external adoption candidates.`);
