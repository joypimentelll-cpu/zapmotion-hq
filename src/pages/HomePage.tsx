import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Sparkles, Gamepad2, Bot, MousePointer, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/i18n';

export default function HomePage() {
  const { t } = useTranslation();

  const features = [
    {
      icon: Bot,
      title: t('home.features.automation.title'),
      description: t('home.features.automation.description'),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: MousePointer,
      title: t('home.features.microinteractions.title'),
      description: t('home.features.microinteractions.description'),
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Gamepad2,
      title: t('home.features.practice.title'),
      description: t('home.features.practice.description'),
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  const stats = [
    { value: '500+', label: 'Profissionais Treinados' },
    { value: '95%', label: 'Taxa de Aprovação' },
    { value: '4.9', label: 'Avaliação Média' },
    { value: '6', label: 'Idiomas Suportados' },
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        aria-labelledby="hero-title"
      >
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent/30 to-background" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto stagger-children">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Treinamento Corporativo 2024</span>
            </div>

            {/* Title */}
            <h1 
              id="hero-title"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
            >
              <span className="text-gradient">{t('home.hero.title')}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              {t('home.hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild variant="hero" size="xl">
                <Link to="/register">
                  {t('home.hero.cta')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl">
                <Link to="/training">
                  {t('home.hero.learnMore')}
                </Link>
              </Button>
            </div>
          </div>

          {/* Floating Elements */}
          <div className="absolute top-1/4 left-[10%] hidden lg:block animate-float">
            <div className="glass p-4 rounded-2xl shadow-soft">
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <div className="absolute top-1/3 right-[10%] hidden lg:block animate-float" style={{ animationDelay: '0.5s' }}>
            <div className="glass p-4 rounded-2xl shadow-soft">
              <Target className="h-8 w-8 text-secondary" />
            </div>
          </div>
          <div className="absolute bottom-1/4 left-[15%] hidden lg:block animate-float" style={{ animationDelay: '1s' }}>
            <div className="glass p-4 rounded-2xl shadow-soft">
              <Users className="h-8 w-8 text-warning" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-fade-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-20 md:py-32"
        aria-labelledby="features-title"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 
              id="features-title"
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              {t('home.features.title')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative glass rounded-2xl p-8 card-hover animate-fade-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-xl ${feature.bgColor} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>

                {/* Hover effect */}
                <div className="absolute inset-0 rounded-2xl ring-2 ring-primary/0 group-hover:ring-primary/20 transition-all duration-300" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para Começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Junte-se a centenas de profissionais que já estão transformando suas carreiras
          </p>
          <Button asChild variant="cta" size="xl">
            <Link to="/register">
              Fazer Inscrição
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
