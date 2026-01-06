
import React from 'react'
import { useState } from 'react'

const CopyableText = ({ text }) => {

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error) {
            console.log('failed to copy ', error.message);
        }
    }
    return (
        <span onClick={handleCopy} className="relative hover:underline cursor-pointer">
            {String(text).slice(0, 10)}...

            {copied && (
                <span className="absolute -top-6 left-0 text-xs bg-black dark:bg-white text-white dark:text-gray-800 px-2 py-1 rounded">
                    Copied!
                </span>
            )}
        </span>
    );
}

export default CopyableText