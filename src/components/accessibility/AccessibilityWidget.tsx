import React, { useState } from 'react';
import { Accessibility, X, Type, Eye, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAccessibility } from '@/context/AccessibilityContext';
import { useTranslation } from '@/i18n';
import { cn } from '@/lib/utils';

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const { t } = useTranslation();

  const fontSizeOptions = [
    { value: 'normal', label: 'A' },
    { value: 'large', label: 'A+' },
    { value: 'xlarge', label: 'A++' },
  ] as const;

  return (
    <>
      {/* Toggle Button */}
      <Button
        variant="default"
        size="icon"
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-elevated',
          'hover:scale-110 transition-transform duration-200',
          isOpen && 'bg-secondary'
        )}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
        aria-label={t('accessibility.widget.title')}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Accessibility className="h-6 w-6" />
        )}
      </Button>

      {/* Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          className="fixed bottom-24 right-6 z-50 w-80 glass rounded-xl shadow-elevated p-6 animate-scale-in"
          role="dialog"
          aria-labelledby="accessibility-title"
        >
          <h2 
            id="accessibility-title"
            className="text-lg font-semibold mb-4 flex items-center gap-2"
          >
            <Accessibility className="h-5 w-5 text-primary" />
            {t('accessibility.widget.title')}
          </h2>

          <div className="space-y-5">
            {/* Font Size */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Type className="h-4 w-4" />
                {t('accessibility.widget.fontSize')}
              </Label>
              <div className="flex gap-2">
                {fontSizeOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant={settings.fontSize === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updateSetting('fontSize', option.value)}
                    className="flex-1"
                    aria-pressed={settings.fontSize === option.value}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="high-contrast"
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <Eye className="h-4 w-4" />
                {t('accessibility.widget.contrast')}
              </Label>
              <Switch
                id="high-contrast"
                checked={settings.highContrast}
                onCheckedChange={(checked) => updateSetting('highContrast', checked)}
              />
            </div>

            {/* Reduced Motion */}
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="reduced-motion"
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <Pause className="h-4 w-4" />
                {t('accessibility.widget.reducedMotion')}
              </Label>
              <Switch
                id="reduced-motion"
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSetting('reducedMotion', checked)}
              />
            </div>

            {/* Screen Reader */}
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="screen-reader"
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              >
                <Volume2 className="h-4 w-4" />
                {t('accessibility.widget.screenReader')}
              </Label>
              <Switch
                id="screen-reader"
                checked={settings.screenReaderOptimized}
                onCheckedChange={(checked) => updateSetting('screenReaderOptimized', checked)}
              />
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSettings}
            className="w-full mt-4 text-muted-foreground"
          >
            Reset
          </Button>
        </div>
      )}
    </>
  );
}
