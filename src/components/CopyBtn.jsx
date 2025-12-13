
import { CopyCheck, Share2 } from 'lucide-react';
import { useState } from 'react'
import { toast } from 'react-toastify';

const CopyBtn = () => {

      const [copied, setCopied] = useState(false);
    
    const handleCopy = async () => {

        
        try {
            const link = window.location.href;

            await navigator.clipboard.writeText(link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            setCopied(false);
            console.log(error?.message);
            toast.error('Failed to Copy')
        }
    }

  return (
      <button
          onClick={()=>handleCopy()}
        className="ml-4 p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 group cursor-pointer"
    >

          {copied ? (
            <CopyCheck 
                className={`w-6 h-6 transition-colors duration-200 text-green-400`} 
            /> 
          ) : (
            <Share2 
                className={`w-6 h-6 transition-colors duration-200 `} 
            /> 
        )} 

    </button>
  )
}

export default CopyBtn