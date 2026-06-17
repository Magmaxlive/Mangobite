export const revalidate = 3600

import { getArticles } from '@/lib/shopify'
import PageBanner from '@/components/common/PageBanner'
import Image from 'next/image'
import Link from 'next/link'

export default async function BlogPage() {
  const articles = await getArticles()

  const fmt = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col">
      <PageBanner
        minorTitle="from our kitchen"
        title="Blogs"
        description="Tips, recipes and stories about mangoes."
        breadCrumbs={[{ label: 'blog' }]}
      />

      <div className="py-14 px-8 max-w-7xl mx-auto w-full">
        {articles.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <Link
                key={article.id}
                href={`/blog/${article.blog.handle}/${article.handle}`}
                className="flex flex-col border border-gray-300 rounded-md overflow-hidden hover:border-banner hover:shadow-md transition-all duration-300 group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  {article.image ? (
                    <Image
                      src={article.image.url}
                      alt={article.image.altText || article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent text-4xl font-black">
                      M
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 gap-3 p-5">
                  {article.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <h2 className="text-base font-bold text-banner leading-snug group-hover:text-secondary transition line-clamp-2">
                    {article.title}
                  </h2>
                  {article.excerpt && (
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-100 mt-auto">
                    <span>{article.author?.name}</span>
                    <span>{fmt(article.publishedAt)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
