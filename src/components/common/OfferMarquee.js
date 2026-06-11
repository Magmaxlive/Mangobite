export default function OfferMarquee({ banners }) {
  const texts = banners?.map(b => b.title).filter(Boolean)
  if (!texts?.length) return null

  const content = texts.join('   🔥   ')

  return (
    <div className="bg-primary text-white text-xs font-semibold py-1.5 overflow-hidden whitespace-nowrap">
      <div className="flex">
        <span className="animate-marquee inline-block pr-16">{content}</span>
        <span className="animate-marquee inline-block pr-16" aria-hidden="true">{content}</span>
      </div>
    </div>
  )
}
