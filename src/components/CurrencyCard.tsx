import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { memo, useMemo } from "react";
import type { CurrencyRate } from "@/pages/Index";

interface CurrencyCardProps {
  currency: CurrencyRate;
  index: number;
}

export const CurrencyCard = memo(({ currency, index }: CurrencyCardProps) => {
  // Мемоизируем случайные значения для стабильности
  const { isPositive, changePercent } = useMemo(() => ({
    isPositive: Math.random() > 0.5,
    changePercent: (Math.random() * 3).toFixed(2),
  }), [currency.code]); // Пересчитываем только при изменении валюты

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      rotateX: -10,
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateX: 0,
      transition: {
        type: "spring" as const,
        bounce: 0.4,
        duration: 0.6,
        delay: index * 0.1,
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.03,
      y: -5,
      boxShadow: "0 20px 40px -12px rgba(139, 92, 246, 0.3)",
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="relative group perspective-1000 gpu-accelerated"
    >
      <Card 
        className="bg-gradient-glass backdrop-blur-sm border-border/40 hover:border-primary/50 transition-all duration-500 cursor-pointer relative overflow-hidden"
      >
        {/* Блик эффект */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 3 }}
        />
        
        {/* Декоративные частицы - исправлен overflow */}
        <div className="absolute top-3 right-3 sm:top-2 sm:right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <Zap className="w-4 h-3 sm:w-5 sm:h-4 text-yellow-500" />
          </motion.div>
        </div>

        <CardContent className="p-3 sm:p-5 relative z-10 pr-8 sm:pr-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <motion.div 
                className="text-lg sm:text-2xl flex-shrink-0"
                animate={{ 
                  y: [0, -3, 0],
                  rotate: [0, 5, -9, 0],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  delay: index * 0.2,
                  ease: "easeInOut",
                }}
              >
                {currency.flag}
              </motion.div>
              <div className="min-w-0 flex-1">
                <motion.div 
                  className="font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors duration-300 truncate"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {currency.code}
                </motion.div>
                <motion.div 
                  className="text-xs text-muted-foreground truncate"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                >
                  {currency.name}
                </motion.div>
              </div>
            </div>
            
            <div className="text-right flex-shrink-0">
              <motion.div 
                className="font-bold text-sm sm:text-lg text-foreground group-hover:text-primary transition-colors duration-300"
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.4 }}
              >
                {currency.rate.toFixed(2)} ₽
              </motion.div>
              <motion.div 
                className={`text-xs flex items-center gap-1 justify-end ${
                  isPositive ? 'text-green-400' : 'text-red-400'
                }`}
                initial={{ x: 10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
              >
                <motion.div
                  animate={{ y: isPositive ? [-0.5, 0.5, -0.5] : [0.5, -0.5, 0.5] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                </motion.div>
                <motion.span
                  animate={{ 
                    color: isPositive 
                      ? ['#4ade80', '#22c55e', '#4ade80'] 
                      : ['#f87171', '#ef4444', '#f87171']
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {isPositive ? '+' : '-'}{changePercent}%
                </motion.span>
              </motion.div>
            </div>
          </div>
        </CardContent>

        {/* Подсветка снизу */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          initial={{ scaleX: 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.3 }}
        />
      </Card>
    </motion.div>
  );
});