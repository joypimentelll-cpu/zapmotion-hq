import React, { useState } from 'react';
import { ChevronRight, Bot, Cpu, Workflow, Shield, MousePointer, Sparkles, Heart, RefreshCw } from 'lucide-react';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

interface Topic {
  icon: React.ElementType;
  titleKey: string;
  descriptionKey: string;
}

interface Module {
  id: string;
  titleKey: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  topics: Topic[];
}

const modules: Module[] = [
  {
    id: 'automation',
    titleKey: 'training.module1.title',
    icon: Bot,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    topics: [
      { icon: Cpu, titleKey: 'training.module1.topics.rpa.title', descriptionKey: 'training.module1.topics.rpa.description' },
      { icon: Workflow, titleKey: 'training.module1.topics.ipaas.title', descriptionKey: 'training.module1.topics.ipaas.description' },
      { icon: RefreshCw, titleKey: 'training.module1.topics.tools.title', descriptionKey: 'training.module1.topics.tools.description' },
      { icon: Shield, titleKey: 'training.module1.topics.practices.title', descriptionKey: 'training.module1.topics.practices.description' },
    ],
  },
  {
    id: 'microinteractions',
    titleKey: 'training.module2.title',
    icon: MousePointer,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    topics: [
      { icon: Sparkles, titleKey: 'training.module2.topics.pillars.title', descriptionKey: 'training.module2.topics.pillars.description' },
      { icon: Heart, titleKey: 'training.module2.topics.examples.title', descriptionKey: 'training.module2.topics.examples.description' },
      { icon: Shield, titleKey: 'training.module2.topics.practices.title', descriptionKey: 'training.module2.topics.practices.description' },
    ],
  },
];

export default function TrainingPage() {
  const { t } = useTranslation();
  const [expandedModule, setExpandedModule] = useState<string | null>('automation');

  return (
    <div className="py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {t('training.title')}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="glass rounded-2xl overflow-hidden shadow-card animate-fade-up"
              style={{ animationDelay: `${moduleIndex * 100}ms` }}
            >
              {/* Module Header */}
              <button
                onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                className={cn(
                  'w-full flex items-center justify-between p-6 text-left transition-colors',
                  'hover:bg-muted/50 focus-visible:bg-muted/50'
                )}
                aria-expanded={expandedModule === module.id}
                aria-controls={`module-content-${module.id}`}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('p-3 rounded-xl', module.bgColor)}>
                    <module.icon className={cn('h-6 w-6', module.color)} />
                  </div>
                  <h2 className="text-xl font-semibold">
                    {t(module.titleKey)}
                  </h2>
                </div>
                <ChevronRight
                  className={cn(
                    'h-5 w-5 text-muted-foreground transition-transform duration-300',
                    expandedModule === module.id && 'rotate-90'
                  )}
                />
              </button>

              {/* Module Content */}
              <div
                id={`module-content-${module.id}`}
                className={cn(
                  'grid transition-all duration-300 ease-in-out',
                  expandedModule === module.id
                    ? 'grid-rows-[1fr] opacity-100'
                    : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="p-6 pt-0 space-y-4">
                    {module.topics.map((topic, topicIndex) => (
                      <div
                        key={topicIndex}
                        className={cn(
                          'flex items-start gap-4 p-4 rounded-xl bg-muted/30',
                          'transition-all duration-300 hover:bg-muted/50',
                          'animate-slide-in-right'
                        )}
                        style={{ animationDelay: `${topicIndex * 100}ms` }}
                      >
                        <div className={cn('p-2 rounded-lg', module.bgColor)}>
                          <topic.icon className={cn('h-5 w-5', module.color)} />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">
                            {t(topic.titleKey)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {t(topic.descriptionKey)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Pillars Detail Section */}
        <div className="mt-16 glass rounded-2xl p-8 shadow-card animate-fade-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-2xl font-bold text-center mb-8">
            Os 4 Pilares das Microinterações
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { 
                title: 'Gatilho (Trigger)', 
                description: 'O que inicia a microinteração. Pode ser uma ação do usuário ou uma condição do sistema.',
                color: 'border-primary'
              },
              { 
                title: 'Regras (Rules)', 
                description: 'Define o que acontece quando a microinteração é ativada. O comportamento e lógica.',
                color: 'border-secondary'
              },
              { 
                title: 'Feedback', 
                description: 'A resposta visual, sonora ou tátil que comunica o resultado da ação ao usuário.',
                color: 'border-warning'
              },
              { 
                title: 'Loops & Modos', 
                description: 'Como a microinteração se comporta ao longo do tempo e em diferentes estados.',
                color: 'border-success'
              },
            ].map((pillar, index) => (
              <div 
                key={index}
                className={cn(
                  'p-6 rounded-xl bg-muted/30 border-l-4',
                  pillar.color,
                  'hover:bg-muted/50 transition-colors'
                )}
              >
                <h3 className="font-semibold mb-2">{pillar.title}</h3>
                <p className="text-sm text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
