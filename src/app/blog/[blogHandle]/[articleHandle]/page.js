import { getArticle, getArticles } from '@/lib/shopify'
import { notFound } from 'next/navigation'
import PageBanner from '@/components/common/PageBanner'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const revalidate = 60

export async function generateStaticParams() {
  const articles = await getArticles()
  return articles.map(a => ({ blogHandle: a.blog.handle, articleHandle: a.handle }))
}

export async function generateMetadata({ params }) {
  const { blogHandle, articleHandle } = await params
  const article = await getArticle(blogHandle, articleHandle)
  if (!article) return {}
  return { title: `${article.title} — Mangobite` }
}

export default async function ArticlePage({ params }) {
  const { blogHandle, articleHandle } = await params
  const article = await getArticle(blogHandle, articleHandle)
  if (!article) notFound()

  const fmt = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col">
      <PageBanner
        minorTitle="blog"
        title={article.title}
        Textclass="capitalize"
        description={fmt(article.publishedAt)}
        breadCrumbs={[{ label: 'blog', href: '/blog' }, { label: article.title }]}
        size='max-w-7xl lg:text-4xl text-2xl'
      />

      <div className="py-14 px-8 max-w-7xl mx-auto w-full">
        <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-banner transition mb-8">
          <ChevronLeft size={16} /> Back to Blog
        </Link>

        {/* Hero image */}
        {article.image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-10">
            <Image
              src={article.image.url}
              alt={article.image.altText || article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-400">
          {article.author?.name && <span>By <strong className="text-banner">{article.author.name}</strong></span>}
          <span>·</span>
          <span>{fmt(article.publishedAt)}</span>
          {article.tags?.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wide text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-gray-700 text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: article.contentHtml }}
        />
      </div>
    </div>
  )
}
