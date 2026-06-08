import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PageBanner({ title,minorTitle,size, bannerBg, Textclass,description, breadCrumbs = [] }) {
  return (
    <div
      className={`relative pt-38 pb-18 tablet:pt-38 pb-18 px-8 bg-banner ${bannerBg || 'bg-banner'} bg-cover bg-no-repeat bg-center overflow-hidden`}
    >
      <Image
        src="/images/leaf_left.png"
        alt=""
        width={300}
        height={300}
        className="absolute left-0 top-0 w-36 md:w-52 lg:w-72 opacity-90 pointer-events-none select-none z-0"
      />
      <Image
        src="/images/leaf_right.png"
        alt=""
        width={300}
        height={300}
        className="absolute right-0 top-0 w-36 md:w-52 lg:w-72 opacity-90 pointer-events-none select-none z-0"
      />

      <div className="relative z-10 flex flex-col gap-6 text-center justify-center items-center max-w-7xl mx-auto">

        {/* Title */}
        <h5 className="uppercase text-grayText text-xs tracking-widest">
            {minorTitle}
        </h5>
        <h1 className={` font-black capitalize text-white leading-tight ${Textclass || 'uppercase'} ${size || 'max-w-xl text-4xl lg:text-6xl'}`}>
          {title}
        </h1>

        <p className={`text-sm font-normal capitalize max-w-xl text-grayText leading-tight `}>
          {description}
        </p>

        {/* Decorative line */}
        <div className="flex items-center gap-3">
          <div className="h-px w-10 bg-secondary/30 rounded-full" />
          <div className="h-1.5 w-1.5 rounded-full bg-secondary" />
          <div className="h-px w-10 bg-secondary/30 rounded-full" />
        </div>

        {/* Breadcrumb */}
        <div className="flex flex-wrap gap-2 items-center justify-center capitalize text-grayText text-sm">
          <Link className="hover:underline hover:text-secondary underline-offset-4 flex items-center gap-2" href="/">
            Home <ChevronRight size={16} />
          </Link>
          {breadCrumbs.map((i, index) => (
            <div className="flex gap-2 items-center" key={index}>
              {i.href ? (
                <Link className="hover:underline hover:text-secondary underline-offset-4 max-w-[200px] truncate" href={i.href}>
                  {i.label}
                </Link>
              ) : (
                <p className="max-w-[200px] truncate">{i.label}</p>
              )}
              {index !== breadCrumbs.length - 1 && <ChevronRight size={16} />}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}