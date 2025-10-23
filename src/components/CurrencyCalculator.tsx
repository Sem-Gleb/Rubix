import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { convertCurrency } from "@/lib/currency-api";
import { ArrowRightLeft, Calculator, TrendingUp, Sparkles, Zap } from "lucide-react";
import type { CurrencyRate } from "@/pages/Index";

interface CurrencyCalculatorProps {
  rates: CurrencyRate[];
  loading: boolean;
}

export const CurrencyCalculator = ({ rates, loading }: CurrencyCalculatorProps) => {
  const [amount, setAmount] = useState<string>("1");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [result, setResult] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!loading && rates.length > 0) {
      const rate = rates.find(r => r.code === fromCurrency)?.rate || 1;
      const numAmount = parseFloat(amount) || 0;
      setResult(convertCurrency(numAmount, rate));
    }
  }, [amount, fromCurrency, rates, loading]);

  const handleSwap = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setAmount(result.toString());
      setIsAnimating(false);
    }, 300);
  };

  const handleQuickAmount = (quickAmount: number) => {
    setAmount(quickAmount.toString());
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const resultVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        bounce: 0.4,
        duration: 0.6,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full"
    >
      <Card className="bg-gradient-glass backdrop-blur-xl border-border/50 shadow-elegant overflow-hidden relative group">
        {/* Декоративные элементы - уменьшены */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-5 rounded-full blur-xl group-hover:opacity-10 transition-opacity duration-500" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-secondary opacity-5 rounded-full blur-lg group-hover:opacity-10 transition-opacity duration-500" />
        
        <motion.div variants={itemVariants}>
          <CardHeader className="text-center pb-6 relative">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl sm:text-3xl">
              <motion.div
                animate={{ 
                  rotate: [0, 3, -3, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  repeatDelay: 5,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <Calculator className="w-8 h-8 text-primary" />
              </motion.div>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Валютный калькулятор
              </span>
            </CardTitle>
            <motion.p 
              className="text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Конвертируйте валюты с актуальными курсами
            </motion.p>
          </CardHeader>
        </motion.div>
        
        <CardContent className="space-y-6 sm:space-y-8 p-4 sm:p-8">
          {/* Выбор валюты и сумма */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Из валюты
              </label>
              <Select value={fromCurrency} onValueChange={setFromCurrency} disabled={loading}>
                <SelectTrigger className="bg-muted/50 border-border/50 hover:border-primary/50 transition-all duration-300 h-14 text-base">
                  <SelectValue placeholder="Выберите валюту" />
                </SelectTrigger>
                <SelectContent className="bg-popover/90 backdrop-blur-xl border-border/50">
                  {rates.map((rate) => (
                    <SelectItem key={rate.code} value={rate.code} className="hover:bg-muted/50 py-3">
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className="text-2xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          {rate.flag}
                        </motion.span>
                        <div>
                          <span className="font-semibold">{rate.code}</span>
                          <span className="text-muted-foreground ml-2">- {rate.name}</span>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-3">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-secondary" />
                Сумма
              </label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Введите сумму"
                className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-14 text-base"
                disabled={loading}
              />
            </motion.div>
          </div>

          {/* Кнопка обмена */}
          <motion.div 
            variants={itemVariants}
            className="flex justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Button
                onClick={handleSwap}
                variant="outline"
                size="icon"
                className="bg-muted/30 hover:bg-primary/20 border-primary/30 hover:border-primary hover:shadow-neon-primary transition-all duration-500 w-14 h-14 rounded-full"
                disabled={loading}
              >
                <motion.div
                  animate={isAnimating ? { rotate: 360 } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRightLeft className="w-6 h-6" />
                </motion.div>
              </Button>
            </motion.div>
          </motion.div>

          {/* Результат */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <span className="text-2xl">🇷🇺</span>
              Результат в рублях
            </label>
            <AnimatePresence mode="wait">
              <motion.div
                key={result}
                variants={resultVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-gradient-to-r from-secondary/10 to-primary/10 border-2 border-secondary/30 rounded-2xl p-6 sm:p-8 text-center hover:border-secondary/50 transition-all duration-300 relative overflow-hidden"
              >
                {/* Фоновый эффект */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {loading ? (
                  <motion.div 
                    className="animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="h-12 bg-muted/50 rounded-xl w-48 mx-auto"></div>
                  </motion.div>
                ) : (
                  <div className="space-y-3 relative z-10">
                    <motion.div 
                      className="text-3xl sm:text-5xl font-bold bg-gradient-secondary bg-clip-text text-transparent"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
                    >
                      {result.toLocaleString('ru-RU', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} ₽
                    </motion.div>
                    <motion.div 
                      className="text-sm text-muted-foreground flex items-center justify-center gap-2"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <TrendingUp className="w-4 h-4" />
                      Курс: {rates.find(r => r.code === fromCurrency)?.rate || 0} ₽
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Быстрые суммы */}
          <motion.div variants={itemVariants} className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">
              Быстрый выбор
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[1, 10, 100, 1000].map((quickAmount, index) => (
                <motion.div
                  key={quickAmount}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="w-full bg-muted/30 hover:bg-accent/20 border-accent/30 hover:border-accent hover:shadow-accent-glow transition-all duration-300 h-12"
                    disabled={loading}
                  >
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="font-semibold"
                    >
                      {quickAmount.toLocaleString()}
                    </motion.span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};