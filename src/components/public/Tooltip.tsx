"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  offset?: number;
}

export default function Tooltip({ children, content, position = "top", delay = 0.1, offset = 12 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Initial animation offsets based on position
  const initialAnim = {
    top: { y: 10, x: "-50%" },
    bottom: { y: -10, x: "-50%" },
    left: { x: 10, y: "-50%" },
    right: { x: -10, y: "-50%" },
  };

  const targetAnim = {
    top: { y: 0, x: "-50%" },
    bottom: { y: 0, x: "-50%" },
    left: { x: 0, y: "-50%" },
    right: { x: 0, y: "-50%" },
  };

  // Arrow positioning classes for the 45deg rotation borders
  const arrowClasses = {
    top: "border-b border-r",
    bottom: "border-t border-l",
    left: "border-t border-r",
    right: "border-b border-l",
  };

  // Compute exact positioning for the wrapper to hook cleanly to the boundary of the target element
  const getWrapperStyle = () => {
    const spacing = `${offset}px`;
    switch (position) {
      case "top": return { bottom: "100%", left: "50%", marginBottom: spacing };
      case "bottom": return { top: "100%", left: "50%", marginTop: spacing };
      case "left": return { right: "100%", top: "50%", marginRight: spacing };
      case "right": return { left: "100%", top: "50%", marginLeft: spacing };
    }
  };

  // Compute 1px-perfect positioning for the 10x10 rotated square pointer
  const getArrowStyle = () => {
    const size = "10px";
    const half = "5px"; // Exactly half of 10px to center it dead-on
    const style = { width: size, height: size };
    switch (position) {
      case "top": return { ...style, bottom: `-${half}`, left: `calc(50% - ${half})` };
      case "bottom": return { ...style, top: `-${half}`, left: `calc(50% - ${half})` };
      case "left": return { ...style, right: `-${half}`, top: `calc(50% - ${half})` };
      case "right": return { ...style, left: `-${half}`, top: `calc(50% - ${half})` };
    }
  };

  return (
    <div
      className="relative inline-flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, ...initialAnim[position] }}
            animate={{ opacity: 1, scale: 1, ...targetAnim[position] }}
            exit={{ opacity: 0, scale: 0.9, ...initialAnim[position] }}
            transition={{ type: "spring", stiffness: 450, damping: 25, delay }}
            style={getWrapperStyle()}
            className="absolute z-[100] px-3 py-1.5 text-xs font-bold font-mono tracking-wider whitespace-nowrap rounded border border-accent/40 bg-surface/95 backdrop-blur-md text-accent shadow-[0_0_20px_rgba(34,211,238,0.3)] pointer-events-none"
          >
            {content}
            {/* Arrow/Triangle Pointer */}
            <div
              className={`absolute bg-surface border-accent/40 rotate-45 ${arrowClasses[position]}`}
              style={{ ...getArrowStyle(), borderWidth: 0, borderBottomWidth: position === 'top' || position === 'right' ? '1px' : '0px', borderRightWidth: position === 'top' || position === 'left' ? '1px' : '0px', borderTopWidth: position === 'bottom' || position === 'left' ? '1px' : '0px', borderLeftWidth: position === 'bottom' || position === 'right' ? '1px' : '0px' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
