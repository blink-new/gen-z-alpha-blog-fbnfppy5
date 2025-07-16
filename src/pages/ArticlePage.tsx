import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, Share2, Heart, MessageCircle, ArrowLeft, TrendingUp, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent } from '../components/ui/card';
import { Article, articles, getRelatedArticles } from '../data/articles';
import { AdBanner } from '../components/AdBanner';
import { Header } from '../components/Header';
import { useArticleInteraction } from '../contexts/ArticleInteractionContext';

export function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [newComment, setNewComment] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const { getArticleInteraction, toggleLike, addComment, shareArticle } = useArticleInteraction();

  useEffect(() => {
    if (id) {
      const foundArticle = articles.find(a => a.id === id);
      if (foundArticle) {
        setArticle(foundArticle);
      } else {
        navigate('/');
      }
    }
  }, [id, navigate]);

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

  const handleLike = () => {
    if (id) {
      toggleLike(id);
    }
  };

  const handleShare = async () => {
    if (article && id) {
      await shareArticle(id, article.title, article.excerpt);
    }
  };

  const handleCommentSubmit = () => {
    if (id && newComment.trim()) {
      addComment(id, newComment);
      setNewComment('');
    }
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Article not found</h2>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const relatedArticles = getRelatedArticles(article, articles, 4);
  const interaction = id ? getArticleInteraction(id) : { likes: 0, isLiked: false, comments: [] };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        selectedCategory="All"
        onCategoryChange={() => {}}
      />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Articles
        </Button>

        {/* Article Header */}
        <article className="mb-12">
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-accent text-accent-foreground">
                  {article.category}
                </Badge>
                {article.trending && (
                  <Badge className="bg-primary text-primary-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Trending
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>{article.author}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
                <span>•</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Social Actions */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b">
            <Button 
              variant={interaction.isLiked ? "default" : "outline"} 
              size="sm"
              onClick={handleLike}
              className={interaction.isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""}
            >
              <Heart className={`w-4 h-4 mr-2 ${interaction.isLiked ? 'fill-current' : ''}`} />
              {interaction.likes} {interaction.isLiked ? 'Liked' : 'Like'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={() => document.getElementById('comments')?.scrollIntoView({ behavior: 'smooth' })}>
              <MessageCircle className="w-4 h-4 mr-2" />
              {interaction.comments.length} Comments
            </Button>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {article.excerpt}
            </p>
            
            <div className="space-y-6 text-foreground leading-relaxed">
              {article.content.split('\n\n').map((paragraph, index) => (
                <div key={index}>
                  <p className="mb-4">{paragraph}</p>
                  {/* Insert ad after 3rd paragraph */}
                  {index === 2 && (
                    <div className="my-8">
                      <AdBanner size="banner" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">TAGS</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <section id="comments" className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Comments ({interaction.comments.length})</h2>
          
          {/* Add Comment */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Join the conversation</h3>
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="mb-4"
                rows={3}
              />
              <Button onClick={handleCommentSubmit} disabled={!newComment.trim()}>
                Post Comment
              </Button>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {interaction.comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">{comment.author}</span>
                        <span className="text-sm text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-foreground mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          <Heart className="w-4 h-4 mr-1" />
                          {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                          Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section>
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedArticles.map((relatedArticle) => (
              <Link 
                key={relatedArticle.id}
                to={`/article/${relatedArticle.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {relatedArticle.trending && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-accent text-accent-foreground font-medium">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Trending
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                        {relatedArticle.category}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Clock className="w-4 h-4" />
                      <span>{relatedArticle.readTime} min read</span>
                      <span>•</span>
                      <span>{relatedArticle.author}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    
                    <p className="text-muted-foreground line-clamp-3 leading-relaxed">
                      {relatedArticle.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Sidebar Ad */}
        <div className="mt-12">
          <AdBanner size="banner" />
        </div>
      </main>
    </div>
  );
}