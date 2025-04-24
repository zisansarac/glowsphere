import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Button } from './ui/button';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

    useEffect(() => {
  console.log('Mevcut tema:', theme);
     }, [theme]);

  return (
    <div key={theme} className="absolute top-4 right-4">
      <Button 
        onClick={toggleTheme} 
        variant="default" 
        size="sm"
        className="p-2 text-white bg-primary hover: bg-primary-700g"
      >
        {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
