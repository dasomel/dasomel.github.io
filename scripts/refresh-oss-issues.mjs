import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT=process.cwd();
const output=path.join(ROOT,'src','data','oss-issue-meta.json');
const token=process.env.GITHUB_TOKEN;
const headers={Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'dasomel-blog-oss-issue-refresh',...(token?{Authorization:`Bearer ${token}`}:{})};

const refs=[
  ['dasomel/narwhal',41],['dasomel/narwhal',161],['dasomel/narwhal',162],['dasomel/narwhal',169],
  ['dasomel/kube-ready-box',28],['dasomel/nfs-quota-agent',16],['dasomel/nfs-quota-agent',81],
  ['dasomel/ldapium',36],['dasomel/beluga',100],['dasomel/kubemetal',35],
];

const result={};
for (const [repo,number] of refs) {
  const response=await fetch(`https://api.github.com/repos/${repo}/issues/${number}`,{headers});
  if (!response.ok) {
    console.warn(`Skipping ${repo}#${number}: ${response.status}`);
    continue;
  }
  const issue=await response.json();
  if (issue.pull_request) continue;
  const key=`${repo}#${number}`;
  result[key]={
    repo,number,title:issue.title,state:issue.state,stateReason:issue.state_reason??undefined,
    url:issue.html_url,updatedAt:issue.updated_at,closedAt:issue.closed_at??undefined,
    labels:(issue.labels??[]).map((label)=>typeof label==='string'?label:label.name).filter(Boolean),
  };
}
await fs.writeFile(output,`${JSON.stringify(result,null,2)}\n`,'utf8');
console.log(`Refreshed ${Object.keys(result).length} OSS tracker issues.`);
