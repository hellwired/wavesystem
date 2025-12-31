import * as React from "react"
import { Check } from "lucide-react"

// Simplified Checkbox without Radix
export const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
    ({ className, ...props }, ref) => (
        <label className="relative flex items-center justify-center w-4 h-4 cursor-pointer">
            <input
                type="checkbox"
                className="peer appearance-none w-4 h-4 border border-input rounded-sm bg-transparent checked:bg-primary checked:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                ref={ref}
                {...props}
            />
            <Check className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" />
        </label>
    )
)
Checkbox.displayName = "Checkbox"
