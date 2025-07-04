import { useEffect, useRef } from "react";

/**
 * Custom hook for handling clicks outside of a specified element
 * @param callback Function to call when clicking outside
 * @param isActive Whether the hook should be active (optional, defaults to true)
 * @returns ref object to attach to the element
 */
export const useClickOutside = <T extends HTMLElement>(
  callback: () => void,
  isActive: boolean = true
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [callback, isActive]);

  return ref;
};
