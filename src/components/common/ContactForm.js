'use client';

import { useState } from "react";
import { Check, LoaderCircle, X } from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+64', label: '🇳🇿 +64' },
  { code: '+61', label: '🇦🇺 +61' },
  { code: '+91', label: '🇮🇳 +91' },
  { code: '+1',  label: '🇺🇸 +1' },
  { code: '+44', label: '🇬🇧 +44' },
  { code: '+65', label: '🇸🇬 +65' },
  { code: '+60', label: '🇲🇾 +60' },
  { code: '+971',label: '🇦🇪 +971' },
  { code: '+92', label: '🇵🇰 +92' },
  { code: '+880',label: '🇧🇩 +880' },
]

// Digit-length rules per dial code
const PHONE_RULES = {
  '+64':  { min: 7,  max: 10 },
  '+61':  { min: 9,  max: 9  },
  '+91':  { min: 10, max: 10 },
  '+1':   { min: 10, max: 10 },
  '+44':  { min: 10, max: 10 },
  '+65':  { min: 8,  max: 8  },
  '+60':  { min: 9,  max: 11 },
  '+971': { min: 9,  max: 9  },
  '+92':  { min: 10, max: 10 },
  '+880': { min: 10, max: 11 },
}

function validatePhone(dialCode, number) {
  const digits = number.replace(/\D/g, '')
  const rule = PHONE_RULES[dialCode] ?? { min: 6, max: 15 }
  if (!digits) return 'Phone number is required'
  if (digits.length < rule.min || digits.length > rule.max)
    return `Enter ${rule.min === rule.max ? rule.min : `${rule.min}–${rule.max}`} digits for ${dialCode}`
  return null
}

export default function ContactForm({ text }) {
  const [dialCode, setDialCode]     = useState('+64')
  const [phoneNum, setPhoneNum]     = useState('')
  const [phoneError, setPhoneError] = useState(null)
  const [success, setSucess]        = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/[^\d\s\-()]/g, '')
    setPhoneNum(val)
    if (phoneError) setPhoneError(validatePhone(dialCode, val))
  }

  const HandleSubmit = async (e) => {
    e.preventDefault()

    const pErr = validatePhone(dialCode, phoneNum)
    if (pErr) { setPhoneError(pErr); return }

    setLoading(true)
    try {
      const formData = new FormData(e.target)
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.get('full_name'),
          email:     formData.get('email'),
          phone:     `${dialCode} ${phoneNum.trim()}`,
          message:   formData.get('message'),
        }),
      })

      const data = await res.json()
      if (!data.success) throw new Error(data.error || 'Submission failed')

      setSucess(true)
      setTimeout(() => setSucess(false), 5000)
      e.target.reset()
      setPhoneNum('')
      setPhoneError(null)

    } catch (err) {
      setError(err.message || 'Something went wrong')
      setTimeout(() => setError(null), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form method="post" onSubmit={HandleSubmit}>
      <div className="flex flex-col gap-6">

        <div className="flex md:flex-row flex-col gap-6">
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="full_name" className="font-medium">Full Name</label>
            <input type="text" name="full_name" id="full_name"
              className="border w-full p-3 border-banner"
              placeholder="Enter your full name" required />
          </div>
          <div className="flex flex-col w-full gap-2">
            <label htmlFor="email" className="font-medium">Email</label>
            <input type="email" name="email" id="email"
              className="border w-full p-3 border-banner"
              placeholder="Enter your email" required />
          </div>
        </div>

        {/* Phone with country code */}
        <div className="flex flex-col w-full gap-2">
          <label className="font-medium">Phone</label>
          <div className={`flex border ${phoneError ? 'border-red-500' : 'border-banner'}`}>
            <select
              value={dialCode}
              onChange={(e) => { setDialCode(e.target.value); setPhoneError(null) }}
              className="bg-gray-50 border-r border-banner p-3 text-sm focus:outline-none cursor-pointer"
            >
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
            </select>
            <input
              type="tel"
              value={phoneNum}
              onChange={handlePhoneChange}
              onBlur={() => setPhoneError(validatePhone(dialCode, phoneNum))}
              className="flex-1 p-3 focus:outline-none"
              placeholder="Phone number"
            />
          </div>
          {phoneError && <p className="text-red-500 text-xs mt-1">{phoneError}</p>}
        </div>

        <div className="flex flex-col w-full gap-2">
          <label htmlFor="message" className="font-medium">Message <span className="text-gray-400 font-normal">(optional)</span></label>
          <textarea id="message" name="message"
            className="border h-30 w-full p-3 border-banner"
            placeholder="Enter message" />
        </div>

        {loading ? (
          <button type="submit" disabled
            className="bg-(--color-accent) w-full flex gap-2 justify-center items-center lg:py-3 lg:px-6 p-3 text-[#14181f] font-semibold">
            Submitting <LoaderCircle />
          </button>
        ) : (
          <button type="submit"
            className="bg-banner hover:bg-secondary w-full flex gap-2 justify-center uppercase items-center cursor-pointer lg:py-3 lg:px-6 p-3 text-white font-semibold">
            {text ?? 'Submit'}
          </button>
        )}

        {success && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white shadow-2xl max-w-md w-full p-8 flex flex-col items-center gap-4 text-center relative">
              <button onClick={() => setSucess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                <X className="w-5 h-5" />
              </button>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="text-green-600 w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Form Submitted!</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Thank you for connecting. We've received your enquiry and one of our staff will contact you <span className="font-medium text-gray-700">shortly</span>.
              </p>
              <button onClick={() => setSucess(false)}
                className="mt-2 w-full bg-(--color-accent) text-[#14181f] font-semibold py-3 hover:opacity-90 transition">
                Done
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex gap-4 text-red-500 justify-center items-center text-lg font-medium">{error}</div>
        )}

      </div>
    </form>
  )
}
