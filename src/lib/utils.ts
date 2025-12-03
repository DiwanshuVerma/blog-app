import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, "")  // remove non-word chars
    .replace(/\s+/g, "-");    // replace spaces with hyphens
}

// How to use AWS! --> how-to-use-aws

