/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, ReactNode } from 'react';

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
}

export interface ArticleInteraction {
  likes: number;
  isLiked: boolean;
  comments: Comment[];
}

interface ArticleInteractionContextType {
  getArticleInteraction: (articleId: string) => ArticleInteraction;
  toggleLike: (articleId: string) => void;
  addComment: (articleId: string, content: string) => void;
  shareArticle: (articleId: string, title: string, excerpt: string) => Promise<void>;
}

const ArticleInteractionContext = createContext<ArticleInteractionContextType | undefined>(undefined);

export function useArticleInteraction() {
  const context = useContext(ArticleInteractionContext);
  if (!context) {
    throw new Error('useArticleInteraction must be used within an ArticleInteractionProvider');
  }
  return context;
}

interface ArticleInteractionProviderProps {
  children: ReactNode;
}

export function ArticleInteractionProvider({ children }: ArticleInteractionProviderProps) {
  const [interactions, setInteractions] = useState<Record<string, ArticleInteraction>>({});

  const getArticleInteraction = (articleId: string): ArticleInteraction => {
    if (!interactions[articleId]) {
      // Initialize with default values and some sample comments
      const defaultInteraction: ArticleInteraction = {
        likes: Math.floor(Math.random() * 500) + 50,
        isLiked: false,
        comments: [
          {
            id: '1',
            author: 'TechEnthusiast',
            content: 'This is such a great article! Really opened my eyes to this topic.',
            timestamp: '2 hours ago',
            likes: 12
          },
          {
            id: '2',
            author: 'DigitalNomad',
            content: 'Love the perspective here. Definitely sharing this with my friends!',
            timestamp: '4 hours ago',
            likes: 8
          },
          {
            id: '3',
            author: 'CreativeMinds',
            content: 'The examples you used really helped me understand this better. Thanks!',
            timestamp: '1 day ago',
            likes: 15
          }
        ]
      };
      
      setInteractions(prev => ({
        ...prev,
        [articleId]: defaultInteraction
      }));
      
      return defaultInteraction;
    }
    
    return interactions[articleId];
  };

  const toggleLike = (articleId: string) => {
    setInteractions(prev => {
      const current = prev[articleId] || getArticleInteraction(articleId);
      return {
        ...prev,
        [articleId]: {
          ...current,
          isLiked: !current.isLiked,
          likes: current.isLiked ? current.likes - 1 : current.likes + 1
        }
      };
    });
  };

  const addComment = (articleId: string, content: string) => {
    if (!content.trim()) return;
    
    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'You',
      content: content.trim(),
      timestamp: 'Just now',
      likes: 0
    };

    setInteractions(prev => {
      const current = prev[articleId] || getArticleInteraction(articleId);
      return {
        ...prev,
        [articleId]: {
          ...current,
          comments: [newComment, ...current.comments]
        }
      };
    });
  };

  const shareArticle = async (articleId: string, title: string, excerpt: string) => {
    const url = `${window.location.origin}/article/${articleId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred, fallback to clipboard
        await navigator.clipboard.writeText(url);
        // You could show a toast notification here
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <ArticleInteractionContext.Provider value={{
      getArticleInteraction,
      toggleLike,
      addComment,
      shareArticle
    }}>
      {children}
    </ArticleInteractionContext.Provider>
  );
}