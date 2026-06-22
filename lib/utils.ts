import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// ponytail: cn utility — tailwind-merge + clsx, standard pattern

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
