import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import TechDigestView from './TechDigestView';

export function generateStaticParams(){return routing.locales.map(locale=>({locale}))}
export async function generateMetadata({params}:{params:Promise<{locale:string}>}){const{locale}=await params;const t=await getTranslations({locale,namespace:'tech_digest'});return{title:t('title'),description:t('subtitle')}}

export default async function TechDigestPage({params}:{params:Promise<{locale:string}>}){
  const{locale}=await params;
  return <TechDigestView lang={locale as 'ko'|'en'} page={1}/>
}
