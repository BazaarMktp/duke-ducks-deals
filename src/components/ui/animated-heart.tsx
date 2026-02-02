
import { Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedHeartProps {
  isFavorite: boolean;
  onClick: () => void;
  size?: number;
  className?: string;
}

const AnimatedHeart = ({ isFavorite, onClick, size = 14, className }: AnimatedHeartProps) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "relative flex items-center justify-center transition-colors",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isFavorite ? "filled" : "empty"}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 15
          }}
        >
          <Heart 
            size={size} 
            className={cn(
              "transition-colors",
              isFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground"
            )} 
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Burst effect on favorite */}
      <AnimatePresence>
        {isFavorite && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-full h-full rounded-full bg-red-500/30" />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Particle burst effect */}
      <AnimatePresence>
        {isFavorite && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 20
                }}
                transition={{ duration: 0.4 }}
                className="absolute w-1 h-1 bg-red-500 rounded-full pointer-events-none"
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </button>
  );
};

export default AnimatedHeart;
