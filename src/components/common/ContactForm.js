'use client';

import { useState } from "react";
import { Check,LoaderCircle,X  } from 'lucide-react';


export default function ContactForm({text,services,singleService}) {
    const [success,setSucess] = useState(false)
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(null)

    const HandleSubmit = async(e) =>{
        e.preventDefault();
        setLoading(true)

        try {
            const formData = new FormData(e.target)

            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    full_name: formData.get('full_name'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    message: formData.get('message'),
                }),
            })

            const data = await res.json()
            if (!data.success) throw new Error(data.error || 'Submission failed')

            setSucess(true)
            setTimeout(() => setSucess(false), 5000)
            e.target.reset()

        } catch (error) {
            setError(error.message || 'Something went wrong')
            setTimeout(() => setError(null), 3000)
        } finally {
            setLoading(false)
        }
    }
  return (
    <form action="" method="post" onSubmit={HandleSubmit}>
    <div className="flex flex-col gap-6">

        <div className="flex md:flex-row flex-col gap-6">

            <div className="flex flex-col w-full gap-2">
                    <label htmlFor="full_name" className="font-medium">Full Name</label>
                    <input type="text" name="full_name" id="full_name" className="border w-full   p-3 border-banner" placeholder="Enter Your full name" suppressHydrationWarning  required/>
            </div>

            <div className="flex flex-col w-full gap-2">
                    <label htmlFor="email" className="font-medium">Email</label>
                    <input type="email" name="email" id="email" placeholder="Enter Your Email" className="border w-full   p-3 border-banner" suppressHydrationWarning  required/>
            </div>

        </div>
            


            <div className="flex flex-col w-full gap-2">
                    <label htmlFor="phone" className="font-medium">Phone</label>
                    <input type="number" name="phone" id="phone" placeholder="Enter Phone number" className="border w-full   p-3 border-banner" suppressHydrationWarning required/>
            </div>

           
             <div className="flex flex-col w-full gap-2">
                    <label htmlFor="message" className="font-medium">Message ( optional )</label>
                    <textarea id="message"  name="message" placeholder="Enter Message" className="border h-30 w-full   p-3 border-banner" />
            </div>

            
            {loading ? (
                <button type="submit" disabled className="bg-(--color-accent) w-full flex gap-2 justify-center items-center   lg:py-3 lg:px-6 p-3 text-[#14181f] font-semibold">
                       Submitting <LoaderCircle/>
                </button>
            ) : (
                <button type="submit" className="bg-banner w-full flex gap-2 justify-center items-center cursor-pointer  lg:py-3 lg:px-6 p-3 text-white font-semibold">
                            {text ? text : "Submit"}
                            
                </button>
            )}

            {success && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white   shadow-2xl max-w-md w-full p-8 flex flex-col items-center gap-4 text-center relative">
                        
                        {/* Close button */}
                        <button
                            onClick={() => setSucess(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Icon */}
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="text-green-600 w-8 h-8" />
                        </div>

                        {/* Text */}
                        <h3 className="text-2xl font-bold text-gray-800">Form Submitted!</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Thank you for Connecting. We've received your Enquiry and one of our staff will contact you <span className="font-medium text-gray-700">shortly</span>.
                        </p>

                        {/* Close button */}
                        <button
                            onClick={() => setSucess(false)}
                            className="mt-2 w-full bg-(--color-accent) text-[#14181f] font-semibold py-3   hover:opacity-90 transition"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}

            {error &&
                <div className="flex gap-4 text-red-500 justify-center items-center text-lg font-medium"> {error}</div>
            }
       
      
        </div>
     </form>
  )
}