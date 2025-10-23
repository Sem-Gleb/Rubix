import { motion } from "framer-motion";
import { Calculator, FileText, TrendingUp } from "lucide-react";

interface NavigationProps {
  activeSection: "calculator" | "form";
  onSectionChange: (section: "calculator" | "form") => void;
}

export const Navigation = ({ activeSection, onSectionChange }: NavigationProps) => {
  const navItems = [
    { id: "calculator" as const, label: "Калькулятор", icon: Calculator },
    { id: "form" as const, label: "Заявка для юрлиц", icon: FileText },
  ];

  return (
    <motion.nav 
      className="flex justify-center mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="bg-gradient-glass backdrop-blur-xl rounded-2xl p-2 border border-border/50 shadow-elegant">
        <div className="flex gap-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`
                  relative px-6 py-3 rounded-xl font-medium transition-all duration-300
                  flex items-center gap-2 text-sm sm:text-base
                  ${isActive 
                    ? 'text-primary-foreground shadow-neon-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-primary rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
};