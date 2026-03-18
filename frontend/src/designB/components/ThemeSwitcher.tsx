import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useDesignB } from '../themeContext';

export function ThemeSwitcher() {
  const { theme, setTheme } = useDesignB();

  return (
    <div className="flex items-center gap-3">
      <Switch
        id="design-theme"
        checked={theme === 'designB'}
        onCheckedChange={(checked) => setTheme(checked ? 'designB' : 'default')}
      />
      <Label htmlFor="design-theme" className="text-sm font-medium cursor-pointer">
        Design B
      </Label>
    </div>
  );
}
