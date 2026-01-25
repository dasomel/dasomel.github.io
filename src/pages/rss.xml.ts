import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async (context) => {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  return rss({
    title: 'dasomel',
    description: '활동 소식 및 인사이트',
    site: context.site!,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        link: `/posts/${post.slug}/`,
      })),
    customData: `<language>ko-KR</language>`,
  });
};
