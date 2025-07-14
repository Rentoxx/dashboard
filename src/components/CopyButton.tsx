"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyButton({ textToCopy }: { textToCopy: string }) {
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(textToCopy);
        setHasCopied(true);
        setTimeout(() => {
            setHasCopied(false);
        }, 2000); // Reset after 2 seconds
    };

    return (
        <button onClick={handleCopy} className="p-1 text-gray-400 hover:text-mint transition-colors">
            {hasCopied ? (
                <Check size={16} className="text-mint" />
            ) : (
                <Copy size={16} />
            )}
        </button>
    );
}