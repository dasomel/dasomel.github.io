import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT=process.cwd();
const output=path.join(ROOT,'src','data','oss-open-issues.json');
const token=process.env.GITHUB_TOKEN;
const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'dasomel-blog-oss-open-issue-refresh',...(token?{Authorization:`Bearer ${token}`}:{})};
const repos=['dasomel/narwhal','dasomel/narwhal-portal','dasomel/nfs-quota-agent','dasomel/ldapium','dasomel/kube-ready-box','dasomel/clusterdeck','dasomel/beluga','dasomel/beluga-manager','dasomel/kubemetal','dasomel/openforge'];
const result={};
for (const repo of repos) {
  const response=await fetch(`https://api.github.com/repos/${repo}/issues?state=open&per_page=100&sort=updated&direction=desc`,{headers});
  if (!response.ok) {
    console.warn(`Open issue refresh skipped for ${repo}: ${response.status}`);
    result[repo]=[];
    continue;
  }
  const issues=await response.json();
  result[repo]=(Array.isArray(issues)?issues:[])
    .filter((issue)=>!issue.pull_request)
    .map((issue)=>({
      repo,number:issue.number,title:issue.title,url:issue.html_url,updatedAt:issue.updated_at,
      labels:(issue.labels??[]).map((label)=>typeof label==='string'?label:label.name).filter(Boolean),
    }));
}
await fs.writeFile(output,`${JSON.stringify(result,null,2)}\n`,'utf8');
console.log(`Refreshed open issue candidates for ${repos.length} OSS repositories.`);
