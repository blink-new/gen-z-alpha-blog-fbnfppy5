import { X, Clock, Share2, Heart, MessageCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Article, articles, getRelatedArticles } from '../data/articles';
import { AdBanner } from './AdBanner';
import { useArticleInteraction } from '../contexts/ArticleInteractionContext';
import { useState } from 'react';
import { Textarea } from './ui/textarea';

interface ArticleModalProps {
  article: Article | null;
  isOpen: boolean;
  onClose: () => void;
  onArticleClick?: (article: Article) => void;
}

export function ArticleModal({ article, isOpen, onClose, onArticleClick }: ArticleModalProps) {
  const { getArticleInteraction, toggleLike, addComment, shareArticle } = useArticleInteraction();
  const [newComment, setNewComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  
  if (!article) return null;

  const interaction = getArticleInteraction(article.id);
  const relatedArticles = getRelatedArticles(article, articles, 4);

  const handleAddComment = () => {
    if (newComment.trim()) {
      addComment(article.id, newComment);
      setNewComment('');
    }
  };

  const handleShare = () => {
    shareArticle(article.id, article.title, article.excerpt);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          {/* Header Image */}
          <div className="relative h-64 md:h-80">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-background/80 backdrop-blur hover:bg-background"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Article Meta Overlay */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-accent text-accent-foreground">
                  {article.category}
                </Badge>
                {article.trending && (
                  <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                    Trending
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-2xl md:text-3xl font-bold text-white mb-2">
                {article.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span>{article.author}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
                <span>•</span>
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Social Actions */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <Button 
                variant={interaction.isLiked ? "default" : "outline"} 
                size="sm"
                onClick={() => toggleLike(article.id)}
              >
                <Heart className={`w-4 h-4 mr-2 ${interaction.isLiked ? 'fill-current' : ''}`} />
                {interaction.likes > 0 ? `${interaction.likes} Likes` : 'Like'}
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                {interaction.comments.length > 0 ? `${interaction.comments.length} Comments` : 'Comment'}
              </Button>
            </div>

            {/* Comments Section */}
            {showComments && (
              <div className="mb-6 pb-6 border-b">
                <h4 className="font-semibold mb-4">Comments</h4>
                
                {/* Add Comment */}
                <div className="mb-4">
                  <Textarea
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-2"
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    size="sm"
                  >
                    Post Comment
                  </Button>
                </div>

                {/* Comments List */}
                {interaction.comments.length > 0 ? (
                  <div className="space-y-4">
                    {interaction.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                        {comment.likes > 0 && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                            <Heart className="w-3 h-3" />
                            <span>{comment.likes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">No comments yet. Be the first to comment!</p>
                )}
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="space-y-4 text-foreground leading-relaxed whitespace-pre-line">
                {article.content}
                
                {/* In-content Ad */}
                <div className="my-8">
                  <AdBanner size="banner" />
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-bold mb-4">You Might Also Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedArticles.map((relatedArticle) => (
                  <div 
                    key={relatedArticle.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                    onClick={() => onArticleClick?.(relatedArticle)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            {relatedArticle.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {relatedArticle.readTime} min read
                          </span>
                        </div>
                        <h4 className="font-semibold mb-1 line-clamp-2 group-hover:text-primary transition-colors">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {relatedArticle.excerpt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}