"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type ProgressProps = React.ComponentProps<typeof ProgressPrimitive.Root> & {
    indicatorClassName?: string;
    indicatorShadow?: string;
    indicatorActiveShadow?: string;
};

const Progress = React.forwardRef<
    React.ElementRef<typeof ProgressPrimitive.Root>,
    ProgressProps
>(({ className, value, indicatorClassName, indicatorShadow, indicatorActiveShadow, ...props }, ref) => {
    const activeGlow = indicatorActiveShadow || indicatorShadow;

    const shadowKeyframes = [activeGlow, indicatorShadow].filter(
        (shadow): shadow is string => typeof shadow === 'string'
    );

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn("bg-primary/20 relative h-2 w-full overflow-hidden", className)}
            {...props}
        >
            <motion.div
                className={cn("h-full w-full flex-1", indicatorClassName)}
                style={{ originX: 0 }}
                // KORREKTUR: Der Startwert wird fest auf '0%' gesetzt.
                initial={{ width: "0%" }}
                animate={{
                    width: `${value}%`,
                    boxShadow: shadowKeyframes,
                }}
                transition={{
                    width: { type: "spring", stiffness: 70, damping: 25 }, // Leicht angepasst für ein sanfteres Gefühl
                    boxShadow: { duration: 1.5, ease: "easeInOut" },
                }}
            />
        </ProgressPrimitive.Root>
    );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };