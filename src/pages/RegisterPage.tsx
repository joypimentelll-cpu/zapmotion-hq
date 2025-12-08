import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Loader2, Calendar, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useTranslation } from '@/i18n';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const registrationSchema = z.object({
  fullName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('E-mail inválido').refine(
    (email) => !email.includes('gmail.com') && !email.includes('hotmail.com') && !email.includes('yahoo.com'),
    'Use seu e-mail corporativo'
  ),
  employeeId: z.string().min(1, 'Matrícula é obrigatória').max(20),
  department: z.string().min(1, 'Selecione um departamento'),
  familiarityLevel: z.string().min(1, 'Selecione seu nível'),
  needsAccessibility: z.boolean(),
  accessibilityDetails: z.string().optional(),
  observations: z.string().max(500).optional(),
  participationDate: z.date({
    required_error: 'Selecione uma data',
  }),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      needsAccessibility: false,
    },
  });

  const needsAccessibility = watch('needsAccessibility');
  const participationDate = watch('participationDate');

  const departments = [
    { value: 'ti', label: t('register.form.departments.ti') },
    { value: 'rh', label: t('register.form.departments.rh') },
    { value: 'marketing', label: t('register.form.departments.marketing') },
    { value: 'comercial', label: t('register.form.departments.comercial') },
    { value: 'financeiro', label: t('register.form.departments.financeiro') },
    { value: 'outro', label: t('register.form.departments.outro') },
  ];

  const familiarityLevels = [
    { value: 'low', label: t('register.form.familiarity.low') },
    { value: 'medium', label: t('register.form.familiarity.medium') },
    { value: 'high', label: t('register.form.familiarity.high') },
  ];

  const availableDates = [
    new Date(2024, 11, 15),
    new Date(2024, 11, 20),
    new Date(2025, 0, 10),
    new Date(2025, 0, 15),
    new Date(2025, 0, 22),
    new Date(2025, 1, 5),
  ];

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Registration data:', data);
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    toast({
      title: t('register.success.title'),
      description: t('register.success.message'),
    });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 mb-6">
            <Check className="h-12 w-12 text-success success-check" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('register.success.title')}</h1>
          <p className="text-muted-foreground mb-6">{t('register.success.message')}</p>
          <Button onClick={() => setIsSuccess(false)} variant="outline">
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('register.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('register.subtitle')}
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mt-6" />
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit(onSubmit)} 
          className="glass rounded-2xl p-6 md:p-8 shadow-card animate-fade-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2 input-focus">
              <Label htmlFor="fullName" className="flex items-center gap-1">
                {t('register.form.fullName')}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder={t('register.form.fullNamePlaceholder')}
                {...register('fullName')}
                className={cn(errors.fullName && 'border-destructive focus-visible:ring-destructive error-shake')}
                aria-invalid={!!errors.fullName}
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
              />
              {errors.fullName && (
                <p id="fullName-error" className="text-sm text-destructive" role="alert">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2 input-focus">
              <Label htmlFor="email" className="flex items-center gap-1">
                {t('register.form.email')}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t('register.form.emailPlaceholder')}
                {...register('email')}
                className={cn(errors.email && 'border-destructive focus-visible:ring-destructive error-shake')}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Employee ID */}
            <div className="space-y-2 input-focus">
              <Label htmlFor="employeeId" className="flex items-center gap-1">
                {t('register.form.employeeId')}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="employeeId"
                placeholder={t('register.form.employeeIdPlaceholder')}
                {...register('employeeId')}
                className={cn(errors.employeeId && 'border-destructive focus-visible:ring-destructive error-shake')}
                aria-invalid={!!errors.employeeId}
              />
              {errors.employeeId && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.employeeId.message}
                </p>
              )}
            </div>

            {/* Department & Familiarity Row */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Department */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  {t('register.form.department')}
                  <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('department', value)}>
                  <SelectTrigger className={cn(errors.department && 'border-destructive')}>
                    <SelectValue placeholder={t('register.form.departmentPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.value} value={dept.value}>
                        {dept.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.department && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.department.message}
                  </p>
                )}
              </div>

              {/* Familiarity Level */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  {t('register.form.familiarityLevel')}
                  <span className="text-destructive">*</span>
                </Label>
                <Select onValueChange={(value) => setValue('familiarityLevel', value)}>
                  <SelectTrigger className={cn(errors.familiarityLevel && 'border-destructive')}>
                    <SelectValue placeholder={t('register.form.familiarityPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {familiarityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.familiarityLevel && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.familiarityLevel.message}
                  </p>
                )}
              </div>
            </div>

            {/* Participation Date */}
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                {t('register.form.participationDate')}
                <span className="text-destructive">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !participationDate && 'text-muted-foreground',
                      errors.participationDate && 'border-destructive'
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {participationDate ? (
                      format(participationDate, 'PPP')
                    ) : (
                      <span>{t('register.form.participationDatePlaceholder')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={participationDate}
                    onSelect={(date) => date && setValue('participationDate', date)}
                    disabled={(date) => 
                      !availableDates.some(d => 
                        d.toDateString() === date.toDateString()
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.participationDate && (
                <p className="text-sm text-destructive" role="alert">
                  {errors.participationDate.message}
                </p>
              )}
            </div>

            {/* Accessibility */}
            <div className="space-y-4 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <Label htmlFor="accessibility" className="cursor-pointer">
                  {t('register.form.accessibility')}
                </Label>
                <Switch
                  id="accessibility"
                  checked={needsAccessibility}
                  onCheckedChange={(checked) => setValue('needsAccessibility', checked)}
                />
              </div>
              
              {needsAccessibility && (
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="accessibilityDetails">
                    {t('register.form.accessibilityDetails')}
                  </Label>
                  <Textarea
                    id="accessibilityDetails"
                    placeholder={t('register.form.accessibilityPlaceholder')}
                    {...register('accessibilityDetails')}
                    rows={3}
                  />
                </div>
              )}
            </div>

            {/* Observations */}
            <div className="space-y-2">
              <Label htmlFor="observations">
                {t('register.form.observations')}
                <span className="text-muted-foreground ml-2">({t('common.optional')})</span>
              </Label>
              <Textarea
                id="observations"
                placeholder={t('register.form.observationsPlaceholder')}
                {...register('observations')}
                rows={3}
              />
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('common.submit')
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
