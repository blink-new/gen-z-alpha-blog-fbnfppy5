import { useState } from 'react';
import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Header({ darkMode, toggleDarkMode, selectedCategory, onCategoryChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              EveryPages
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onCategoryChange('All')}
              className={`transition-colors font-medium ${
                selectedCategory === 'All' ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => onCategoryChange('Tech')}
              className={`transition-colors ${
                selectedCategory === 'Tech' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Tech
            </button>
            <button 
              onClick={() => onCategoryChange('Gaming')}
              className={`transition-colors ${
                selectedCategory === 'Gaming' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Gaming
            </button>
            <button 
              onClick={() => onCategoryChange('Lifestyle')}
              className={`transition-colors ${
                selectedCategory === 'Lifestyle' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Lifestyle
            </button>
            <button 
              onClick={() => onCategoryChange('Memes')}
              className={`transition-colors ${
                selectedCategory === 'Memes' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              Memes
            </button>
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden sm:flex relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="h-9 w-9"
            >
              {darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <button 
                  onClick={() => {
                    onCategoryChange('All');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left transition-colors font-medium py-2 ${
                    selectedCategory === 'All' ? 'text-primary' : 'text-foreground hover:text-primary'
                  }`}
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    onCategoryChange('Tech');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left transition-colors py-2 ${
                    selectedCategory === 'Tech' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Tech
                </button>
                <button 
                  onClick={() => {
                    onCategoryChange('Gaming');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left transition-colors py-2 ${
                    selectedCategory === 'Gaming' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Gaming
                </button>
                <button 
                  onClick={() => {
                    onCategoryChange('Lifestyle');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left transition-colors py-2 ${
                    selectedCategory === 'Lifestyle' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Lifestyle
                </button>
                <button 
                  onClick={() => {
                    onCategoryChange('Memes');
                    setIsMenuOpen(false);
                  }}
                  className={`text-left transition-colors py-2 ${
                    selectedCategory === 'Memes' ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  Memes
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}