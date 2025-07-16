import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { ArticleInteractionProvider } from './contexts/ArticleInteractionContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ArticleInteractionProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  <Header 
                    darkMode={darkMode} 
                    toggleDarkMode={toggleDarkMode}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                  <HomePage 
                    darkMode={darkMode}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </>
              } 
            />
            <Route 
              path="/article/:id" 
              element={<ArticlePage />} 
            />
          </Routes>
        </div>
      </Router>
    </ArticleInteractionProvider>
  );
}

export default App;