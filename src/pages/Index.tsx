import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CurrencyCalculator } from "@/components/CurrencyCalculator";
import { CurrencyCard } from "@/components/CurrencyCard";
import { LegalEntityForm } from "@/components/LegalEntityForm";
import { Navigation } from "@/components/Navigation";
import { getCurrencyRates } from "@/lib/currency-api";

export interface CurrencyRate {
  code: string;
  name: string;
  rate: number;
  flag: string;
}

const Index = () => {
  const [rates, setRates] = useState<CurrencyRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<"calculator" | "form">("calculator");
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const currencyRates = await getCurrencyRates();
        setRates(currencyRates);
      } catch (error) {
        console.error("Ошибка загрузки курсов валют:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  // Отслеживание взаимодействия пользователя для оптимизации анимаций
  useEffect(() => {
    const handleUserInteraction = () => {
      setIsUserInteracting(true);
      const timer = setTimeout(() => setIsUserInteracting(false), 5000);
      return () => clearTimeout(timer);
    };

    const events = ['mousemove', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  const backgroundVariants = {
    calculator: {
      background: "radial-gradient(circle at 20% 80%, hsla(270,100%,65%,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsla(260,100%,60%,0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, hsla(280,100%,70%,0.05) 0%, transparent 50%)",
      transition: { duration: 1, ease: "easeInOut" as const }
    },
    form: {
      background: "radial-gradient(circle at 60% 20%, hsla(280,100%,70%,0.1) 0%, transparent 50%), radial-gradient(circle at 20% 60%, hsla(270,100%,65%,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, hsla(260,100%,60%,0.05) 0%, transparent 50%)",
      transition: { duration: 1, ease: "easeInOut" as const }
    }
  };

  // Мемоизированные частицы для оптимизации
  const floatingParticles = useMemo(() => {
    const particleCount = window.innerWidth < 768 ? 15 : window.innerWidth < 1024 ? 20 : 30;
    return [...Array(particleCount)].map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-dark relative overflow-hidden optimize-animations">
      {/* Анимированный фон */}
      <motion.div 
        className="absolute inset-0"
        variants={backgroundVariants}
        animate={activeSection}
        initial="calculator"
      />
      
      {/* Адаптивные плавающие частицы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20 gpu-accelerated"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
            }}
            animate={isUserInteracting ? {
              y: [0, -20, 0],
              x: [0, 10, -10, 0],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            } : {
              opacity: 0.1,
            }}
            transition={{
              duration: particle.duration,
              repeat: isUserInteracting ? Infinity : 0,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Заголовок с улучшенной адаптивностью */}
        <header className="text-center pt-8 sm:pt-12 pb-6 sm:pb-8 px-4">
          <motion.h1 
            className="text-4xl sm:text-6xl md:text-7xl font-bold mb-2 sm:mb-4 relative gpu-accelerated"
            initial={{ opacity: 0, y: -30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, rotateY: -90 }}
                animate={{ 
                opacity: 1, 
                rotateY: 0,
                backgroundPosition: isUserInteracting ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.1 },
                rotateY: { duration: 0.6, delay: 0.1 },
                backgroundPosition: {
                  duration: 3,
                  repeat: isUserInteracting ? Infinity : 0,
                  ease: "linear",
                }
              }}
              style={{
                background: "linear-gradient(135deg, hsl(270 100% 65%), hsl(280 100% 75%), hsl(270 100% 85%))",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px hsl(270 100% 65% / 0.5))",
              }}
            >
              R
            </motion.span>
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                backgroundPosition: isUserInteracting ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%",
                scale: isUserInteracting ? [1, 1.05, 1] : 1,
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.2 },
                rotateY: { duration: 0.6, delay: 0.2 },
                backgroundPosition: {
                  duration: 3,
                  repeat: isUserInteracting ? Infinity : 0,
                  ease: "linear",
                  delay: 0.2,
                },
                scale: {
                  duration: 2,
                  repeat: isUserInteracting ? Infinity : 0,
                  ease: "easeInOut",
                  delay: 0.2,
                }
              }}
              style={{
                background: "linear-gradient(135deg, hsl(260 100% 60%), hsl(270 100% 70%), hsl(260 100% 80%))",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px hsl(260 100% 60% / 0.5))",
              }}
            >
              U
            </motion.span>
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                rotate: [0, 2, -2, 0],
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.3 },
                rotateY: { duration: 0.6, delay: 0.3 },
                backgroundPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.4,
                },
                rotate: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.4,
                }
              }}
              style={{
                background: "linear-gradient(135deg, hsl(280 100% 70%), hsl(290 100% 80%), hsl(280 100% 90%))",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px hsl(280 100% 70% / 0.5))",
              }}
            >
              B
            </motion.span>
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                y: [0, -5, 0],
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.4 },
                rotateY: { duration: 0.6, delay: 0.4 },
                backgroundPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.6,
                },
                y: {
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6,
                }
              }}
              style={{
                background: "linear-gradient(135deg, hsl(270 100% 65%), hsl(280 100% 75%), hsl(270 100% 85%))",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px hsl(270 100% 65% / 0.5))",
              }}
            >
              I
            </motion.span>
            <motion.span
              className="relative inline-block"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ 
                opacity: 1, 
                rotateY: 0,
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                opacity: { duration: 0.6, delay: 0.5 },
                rotateY: { duration: 0.6, delay: 0.5 },
                backgroundPosition: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 0.8,
                },
                scale: {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.8,
                }
              }}
              style={{
                background: "linear-gradient(135deg, hsl(260 100% 60%), hsl(270 100% 70%), hsl(260 100% 80%))",
                backgroundSize: "300% 300%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 10px hsl(260 100% 60% / 0.5))",
              }}
            >
              X
            </motion.span>
            
            {/* Декоративные элементы */}
            <motion.div
              className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full blur-sm"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-secondary/20 rounded-full blur-sm"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
          </motion.h1>
          <motion.p 
            className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            Конвертируйте валюты и подавайте заявки на спецусловия
          </motion.p>
        </header>

        {/* Навигация */}
        <div className="px-4">
          <Navigation 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>

        {/* Основной контент */}
        <div className="container mx-auto px-4 pb-8 sm:pb-12">
          <AnimatePresence mode="wait">
            {activeSection === "calculator" ? (
              <motion.div
                key="calculator"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto"
              >
                {/* Калькулятор - адаптивная сетка */}
                <div className="xl:col-span-2">
                  <CurrencyCalculator rates={rates} loading={loading} />
                </div>

                {/* Карточки валют - скрываются на мобильных устройствах */}
                <div className="space-y-4 hidden md:block">
                  <motion.h3 
                    className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6 text-center xl:text-left"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Популярные валюты
                  </motion.h3>
                  {loading ? (
                    <div className="space-y-4">
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="h-16 sm:h-20 bg-card/50 rounded-lg"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      {rates.slice(0, 6).map((rate, index) => (
                        <CurrencyCard
                          key={rate.code}
                          currency={rate}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Мобильная версия карточек валют */}
                <div className="md:hidden xl:col-span-3">
                  <motion.h3 
                    className="text-xl font-bold text-foreground mb-4 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Популярные валюты
                  </motion.h3>
                  {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {rates.slice(0, 4).map((rate, index) => (
                        <CurrencyCard
                          key={rate.code}
                          currency={rate}
                          index={index}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="max-w-5xl mx-auto"
              >
                <LegalEntityForm />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Index;