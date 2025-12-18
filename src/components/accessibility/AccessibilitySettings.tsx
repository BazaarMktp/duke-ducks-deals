import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Eye, Type, Sparkles, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const AccessibilitySettings = () => {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState(() => {
    const saved = localStorage.getItem('a11y-font-size');
    return saved ? parseInt(saved) : 100;
  });
  const [reduceMotion, setReduceMotion] = useState(() => {
    return localStorage.getItem('a11y-reduce-motion') === 'true';
  });
  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('a11y-high-contrast') === 'true';
  });

  // Apply font size
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
    localStorage.setItem('a11y-font-size', fontSize.toString());
  }, [fontSize]);

  // Apply reduce motion
  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
    localStorage.setItem('a11y-reduce-motion', reduceMotion.toString());
  }, [reduceMotion]);

  // Apply high contrast
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    localStorage.setItem('a11y-high-contrast', highContrast.toString());
  }, [highContrast]);

  const handleSave = () => {
    toast.success("Accessibility preferences saved");
  };

  const handleReset = () => {
    setFontSize(100);
    setReduceMotion(false);
    setHighContrast(false);
    setTheme('system');
    toast.success("Settings reset to defaults");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Accessibility & Display
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            Theme
          </Label>
          <div className="flex gap-2">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('light')}
              className="flex-1"
            >
              <Sun className="h-4 w-4 mr-2" />
              Light
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('dark')}
              className="flex-1"
            >
              <Moon className="h-4 w-4 mr-2" />
              Dark
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTheme('system')}
              className="flex-1"
            >
              Auto
            </Button>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <Label htmlFor="font-size" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            <span>Font Size: {fontSize}%</span>
          </Label>
          <Slider
            id="font-size"
            min={80}
            max={150}
            step={10}
            value={[fontSize]}
            onValueChange={(value) => setFontSize(value[0])}
            className="w-full"
            aria-label="Font size adjustment"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Smaller</span>
            <span>Default</span>
            <span>Larger</span>
          </div>
        </div>

        {/* Reduce Motion */}
        <div className="flex items-center justify-between">
          <Label htmlFor="reduce-motion" className="flex flex-col">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Reduce Motion
            </span>
            <span className="text-sm text-muted-foreground font-normal">
              Minimize animations and transitions
            </span>
          </Label>
          <Switch 
            id="reduce-motion" 
            checked={reduceMotion}
            onCheckedChange={setReduceMotion}
            aria-label="Reduce motion toggle"
          />
        </div>

        {/* High Contrast */}
        <div className="flex items-center justify-between">
          <Label htmlFor="high-contrast" className="flex flex-col">
            <span className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              High Contrast
            </span>
            <span className="text-sm text-muted-foreground font-normal">
              Increase color contrast for better visibility
            </span>
          </Label>
          <Switch 
            id="high-contrast" 
            checked={highContrast}
            onCheckedChange={setHighContrast}
            aria-label="High contrast toggle"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button onClick={handleSave} className="flex-1">
            Save Preferences
          </Button>
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilitySettings;
