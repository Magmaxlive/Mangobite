'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './HeroSlider.module.css'
import { lilitaOne } from '@/lib/fonts'

const SLIDES = [
  {
    title: 'Banganapalli',
    image: '/images/bangapalii.png',
    backgroundType: 'split',
    bgTop: '#1e1e1e',
    bgBottom: '#FF9308',
    ctaText: 'Order Now',
    ctaLink: '/shop',
  },
  {
    title: 'Alphonso',
    image: '/images/Alphonso-mango-1.png',
    backgroundType: 'split',
    bgTop: '#1e1e1e',
    bgBottom: '#22a355',
    ctaText: 'Order Now',
    ctaLink: '/shop',
  },
  {
    title: 'Kesar',
    image: '/images/kesar-1.png',
    backgroundType: 'split',
    bgTop: '#1e1e1e',
    bgBottom: '#e8a000',
    ctaText: 'Order Now',
    ctaLink: '/shop',
  },
]

const AUTOPLAY_DELAY = 5000
const TRANSITION_MS  = 820   // must match CSS animation duration + small buffer
const LEAF = '/images/leaf4.png'

export default function HeroSlider() {
  const [current,  setCurrent]  = useState(0)
  const [previous, setPrevious] = useState(null)
  const [direction, setDirection] = useState(1)  // 1 = forward, -1 = backward

  const currentRef    = useRef(0)
  const timerRef      = useRef(null)
  const clearPrevRef  = useRef(null)
  const touchStartX   = useRef(0)
  const contentRefs   = useRef([])

  // Restart all content animations on the newly active slide via DOM reflow —
  // identical to the void-offsetWidth trick the original Shopify code uses.
  useLayoutEffect(() => {
    const el = contentRefs.current[current]
    if (!el) return
    el.classList.remove(styles.contentActive)
    void el.offsetWidth
    el.classList.add(styles.contentActive)
  }, [current])

  function goTo(raw, dir = 1) {
    const next = ((raw % SLIDES.length) + SLIDES.length) % SLIDES.length
    if (next === currentRef.current) return

    // Cancel any pending "clear previous" from a rapid nav
    clearTimeout(clearPrevRef.current)

    setDirection(dir)
    setPrevious(currentRef.current)
    currentRef.current = next
    setCurrent(next)

    // Remove the leaving-slide state after the transition finishes
    clearPrevRef.current = setTimeout(() => setPrevious(null), TRANSITION_MS)
  }

  function startAuto() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => goTo(currentRef.current + 1, 1), AUTOPLAY_DELAY)
  }

  function stopAuto() {
    clearInterval(timerRef.current)
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    startAuto()
    return () => { stopAuto(); clearTimeout(clearPrevRef.current) }
  }, [])

  // Build CSS class string for each slide
  function slideClasses(i) {
    const isActive  = i === current
    const isLeaving = i === previous

    if (isActive) {
      // No enter animation on the very first render (previous is null)
      const enterCls = previous !== null
        ? (direction === 1 ? styles.enterNext : styles.enterPrev)
        : ''
      return `${styles.slide} ${styles.slideActive} ${styles.slideEntering} ${enterCls}`
    }
    if (isLeaving) {
      const exitCls = direction === 1 ? styles.exitNext : styles.exitPrev
      return `${styles.slide} ${styles.slideLeaving} ${exitCls}`
    }
    return styles.slide
  }

  return (
    <section
      className={styles.hero}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
      aria-label="Hero slider"
    >
      {SLIDES.map((slide, i) => (
        <div
          key={i}
          className={`${slideClasses(i)} ${
            slide.backgroundType === 'split' ? styles.slideSplit : styles.slideSolid
          }`}
          style={{
            '--slide-bg-top':    slide.bgTop,
            '--slide-bg-bottom': slide.bgBottom,
            '--slide-bg-solid':  slide.bgSolid,
          }}
          onTouchStart={e => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            const diff = touchStartX.current - e.changedTouches[0].clientX
            if (Math.abs(diff) > 50) {
              stopAuto()
              diff > 0
                ? goTo(currentRef.current + 1,  1)
                : goTo(currentRef.current - 1, -1)
              startAuto()
            }
          }}
        >
          {/* Content — ref lets useLayoutEffect toggle contentActive class */}
          <div ref={el => { contentRefs.current[i] = el }} className={styles.content}>
            {/* Leaves — nth-child(1..4) must stay as first 4 children */}
            {[1, 2, 3, 4].map(n => (
              <div key={n} className={`${styles.leaf} ${styles['leaf' + n]}`}>
                <Image src={LEAF} alt="" width={80} height={80} />
              </div>
            ))}

            <h2 className={`${styles.title} ${lilitaOne.className}`}>
              {slide.title}
            </h2>

            <div className={styles.imageCircle}>
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{ objectFit: 'contain' }}
                priority={i === 0}
              />
            </div>

            {slide.ctaText && (
              <Link href={slide.ctaLink} className={styles.cta}>
                {slide.ctaText}
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      <button
        className={`${styles.arrow} ${styles.arrowPrev}`}
        onClick={() => { stopAuto(); goTo(currentRef.current - 1, -1); startAuto() }}
        aria-label="Previous slide"
      >&#8592;</button>
      <button
        className={`${styles.arrow} ${styles.arrowNext}`}
        onClick={() => { stopAuto(); goTo(currentRef.current + 1, 1); startAuto() }}
        aria-label="Next slide"
      >&#8594;</button>

      {/* Dots */}
      <div className={styles.dots}>
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => {
              stopAuto()
              goTo(i, i > currentRef.current ? 1 : -1)
              startAuto()
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
