
export default function SectionHeading(props) {
  return (
    <div className={`flex flex-col gap-6 ${props.class || 'justify-center items-center text-center'}`}>
      <h3 className={`uppercase text-xs tracking-wide font-semibold ${props.minorHeadingColor || 'text-secondary'}`}>{props.minorHeading}</h3>
        {props.mainHeading &&
          <div className="flex items-center justify-center gap-3">
            <svg width="50" height="16" viewBox="0 0 50 16" fill="none" className={`flex-shrink-0 ${props.mainHeadingColor || 'text-primary'}`}>
              <path d="M0,8 Q6,0 12,8 Q18,16 24,8 Q30,0 36,8 Q42,16 48,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h2 className={`tablet:text-4xl text-3xl font-black font-nunito ${props.mainHeadingColor || 'text-primary'} text-pretty ${props.mainHeadingalign || 'text-center'} capitalize`}>{props.mainHeading}</h2>
            <svg width="50" height="16" viewBox="0 0 50 16" fill="none" className={`flex-shrink-0 ${props.mainHeadingColor || 'text-primary'}`}>
              <path d="M0,8 Q6,0 12,8 Q18,16 24,8 Q30,0 36,8 Q42,16 48,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        }

        {props.paragraph &&
              <div className={`text-base space-y-2 font-normal  text-pretty max-w-4xl ${props.paragraphColor || 'text-(--color-text)'}`}>{props.paragraph}</div>

        }
    </div>
  )
}