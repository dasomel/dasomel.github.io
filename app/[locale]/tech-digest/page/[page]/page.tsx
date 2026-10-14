import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import TechDigestView, { digestPageCount } from '../../TechDigestView';

// Page 1 is /tech-digest/ itself, so only pages 2..N are generated here.
export const dynamicParams=false;
export function generateStaticParams(){const params:{locale:string;page:string}[]=[];routing.locales.forEach(locale=>{const pages=digestPageCount(locale as 'ko'|'en');for(let n=2;n<=pages;n++)params.push({locale,page:String(n)})});return params}
export async function generateMetadata({params}:{params:Promise<{locale:string;page:string}>}){const{locale,page}=await params;const t=await getTranslations({locale,namespace:'tech_digest'});return{title:`${t('title')} · ${locale==='en'?`Page ${page}`:`${page}페이지`}`,description:t('subtitle')}}

export default async function TechDigestPagedPage({params}:{params:Promise<{locale:string;page:string}>}){
  const{locale,page}=await params;const lang=locale as 'ko'|'en';const n=Number(page);
  if(!Number.isInteger(n)||n<2||n>digestPageCount(lang))notFound();
  return <TechDigestView lang={lang} page={n}/>
}
