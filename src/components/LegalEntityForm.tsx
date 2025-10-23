import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Building2, Send, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const legalEntitySchema = z.object({
  companyName: z.string()
    .trim()
    .min(2, { message: "Название компании должно быть не менее 2 символов" })
    .max(200, { message: "Название компании не должно превышать 200 символов" }),
  
  inn: z.string()
    .trim()
    .regex(/^\d{10}$|^\d{12}$/, { message: "ИНН должен содержать 10 или 12 цифр" }),
  
  contactPerson: z.string()
    .trim()
    .min(2, { message: "ФИО должно быть не менее 2 символов" })
    .max(100, { message: "ФИО не должно превышать 100 символов" }),
  
  email: z.string()
    .trim()
    .email({ message: "Введите корректный email адрес" })
    .max(255, { message: "Email не должен превышать 255 символов" }),
  
  phone: z.string()
    .trim()
    .regex(/^(\+7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/, 
      { message: "Введите корректный номер телефона" }),
  
  telegram: z.string()
    .trim()
    .regex(/^@[a-zA-Z0-9_]{5,32}$/, { message: "Введите корректный Telegram (@username)" })
    .optional()
    .or(z.literal("")),
  
  monthlyVolume: z.string()
    .trim()
    .regex(/^\d+$/, { message: "Введите число" })
    .refine(val => parseInt(val) > 0, { message: "Объем должен быть больше 0" }),
  
  comment: z.string()
    .trim()
    .max(1000, { message: "Комментарий не должен превышать 1000 символов" })
    .optional()
    .or(z.literal("")),
});

type LegalEntityFormData = z.infer<typeof legalEntitySchema>;

export const LegalEntityForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<LegalEntityFormData>({
    resolver: zodResolver(legalEntitySchema),
    defaultValues: {
      companyName: "",
      inn: "",
      contactPerson: "",
      email: "",
      phone: "",
      telegram: "",
      monthlyVolume: "",
      comment: "",
    },
  });

  const onSubmit = async (data: LegalEntityFormData) => {
    try {
      // Здесь будет отправка данных на сервер
      console.log("Form data:", data);
      
      // Имитация отправки
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsSubmitted(true);
      toast({
        title: "Заявка отправлена!",
        description: "Мы свяжемся с вами в ближайшее время.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте еще раз или свяжитесь с нами напрямую.",
        variant: "destructive",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="inline-block mb-6"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto" />
        </motion.div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 bg-clip-text text-transparent mb-4">
          Заявка отправлена!
        </h2>
        <p className="text-muted-foreground text-lg mb-6">
          Наш менеджер свяжется с вами в течение рабочего дня
        </p>
        <Button 
          onClick={() => setIsSubmitted(false)}
          className="bg-gradient-secondary hover:shadow-secondary-glow transition-all duration-300"
        >
          Отправить еще одну заявку
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto"
    >
      <Card className="bg-gradient-glass backdrop-blur-xl border-border/50 shadow-3d overflow-hidden">
        <motion.div variants={itemVariants}>
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center justify-center gap-3 text-2xl sm:text-3xl">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Building2 className="w-8 h-8 text-primary" />
              </motion.div>
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Заявка для юридических лиц
              </span>
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Получите персональные условия и спецпредложения
            </p>
          </CardHeader>
        </motion.div>

        <CardContent className="p-4 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Название компании *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="ООО «Ваша компания»"
                            className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="inn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          ИНН *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="1234567890"
                            className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="contactPerson"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          ФИО контактного лица *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Иванов Иван Иванович"
                            className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Email *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="company@example.com"
                            className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Телефон *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="+7 (999) 123-45-67"
                            className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormField
                    control={form.control}
                    name="telegram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground font-medium">
                          Telegram
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="@username"
                            className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-12"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="monthlyVolume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Месячный объем операций (в рублях) *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="1000000"
                          className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 h-12"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Дополнительная информация
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Расскажите о специфике вашего бизнеса, особых требованиях или вопросах..."
                          className="bg-muted/50 border-border/50 hover:border-primary/50 focus:border-primary transition-all duration-300 min-h-[120px] resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div 
                variants={itemVariants}
                className="pt-4"
              >
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="w-full h-14 text-lg font-semibold bg-gradient-primary hover:shadow-glow disabled:opacity-50 transition-all duration-300"
                >
                  <motion.div
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {form.formState.isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    {form.formState.isSubmitting ? "Отправка..." : "Отправить заявку"}
                  </motion.div>
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};