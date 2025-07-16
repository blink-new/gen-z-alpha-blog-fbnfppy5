import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { CategoryFilter } from '../components/CategoryFilter';
import { AdBanner } from '../components/AdBanner';
import { articles, Article } from '../data/articles';
import { TrendingUp, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

interface HomePageProps {
  darkMode: boolean;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function HomePage({ darkMode, selectedCategory, onCategoryChange }: HomePageProps) {
  const [displayedArticles, setDisplayedArticles] = useState(6);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [advertiseModalOpen, setAdvertiseModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  const filteredArticles = selectedCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const visibleArticles = filteredArticles.slice(0, displayedArticles);
  const hasMoreArticles = displayedArticles < filteredArticles.length;

  const trendingArticles = articles.filter(article => article.trending);
  const featuredArticle = trendingArticles[0];

  const handleLoadMore = () => {
    setDisplayedArticles(prev => prev + 6);
  };

  // Reset displayed articles when category changes
  useEffect(() => {
    setDisplayedArticles(6);
  }, [selectedCategory]);

  return (
    <>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Banner Ad */}
        <div className="mb-8">
          <AdBanner size="banner" />
        </div>

        {/* Hero Section */}
        {featuredArticle && (
          <section className="mb-12">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-accent" />
              <h2 className="text-2xl font-bold">Trending Now</h2>
            </div>
            
            <Link to={`/article/${featuredArticle.id}`}>
              <div className="relative h-96 rounded-2xl overflow-hidden cursor-pointer group">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {featuredArticle.category}
                    </span>
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Trending
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                    {featuredArticle.title}
                  </h3>
                  <p className="text-white/90 text-lg mb-4 max-w-2xl">
                    {featuredArticle.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-white/80">
                    <span>{featuredArticle.author}</span>
                    <span>•</span>
                    <span>{featuredArticle.readTime} min read</span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Latest Articles</h2>
            </div>
            
            <CategoryFilter 
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
            />

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {visibleArticles.map((article) => (
                <Link key={article.id} to={`/article/${article.id}`}>
                  <ArticleCard
                    article={article}
                    onClick={() => {}}
                  />
                </Link>
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreArticles && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sidebar Ad */}
            <AdBanner size="sidebar" />

            {/* Trending Articles */}
            <div className="bg-card rounded-lg p-6 border">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Trending
              </h3>
              <div className="space-y-4">
                {trendingArticles.slice(0, 4).map((article, index) => (
                  <Link 
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="flex gap-3 cursor-pointer group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {article.readTime} min read
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Square Ad */}
            <AdBanner size="square" />

            {/* Additional ads that appear when more articles are loaded */}
            {displayedArticles > 6 && (
              <AdBanner size="sidebar" />
            )}

            {/* Newsletter Signup */}
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border">
              <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest articles and trends delivered to your inbox.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>

            {/* More ads for extended content */}
            {displayedArticles > 12 && (
              <>
                <AdBanner size="square" />
                <AdBanner size="sidebar" />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                EveryPages
              </h3>
              <p className="text-sm text-muted-foreground">
                Discover fascinating stories, insights, and trends across every topic that matters to you.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => onCategoryChange('Tech')}
                    className="hover:text-primary transition-colors"
                  >
                    Tech
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryChange('Gaming')}
                    className="hover:text-primary transition-colors"
                  >
                    Gaming
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryChange('Lifestyle')}
                    className="hover:text-primary transition-colors"
                  >
                    Lifestyle
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => onCategoryChange('Memes')}
                    className="hover:text-primary transition-colors"
                  >
                    Memes
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button 
                    onClick={() => setAboutModalOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setAdvertiseModalOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Advertise
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setPrivacyModalOpen(true)}
                    className="hover:text-primary transition-colors"
                  >
                    Privacy
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">TikTok</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">YouTube</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 EveryPages. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* About Modal */}
      <Dialog open={aboutModalOpen} onOpenChange={setAboutModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              About EveryPages
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-muted-foreground">
            <p>
              EveryPages is your go-to destination for bite-sized, engaging content that speaks to the Gen Z and Gen Alpha mindset. We believe in making complex topics accessible, fun, and shareable.
            </p>
            <p>
              Our mission is to bridge the gap between traditional media and the fast-paced digital world. We curate and create content that's not just informative, but genuinely entertaining and relevant to your daily life.
            </p>
            <p>
              From the latest tech trends to gaming culture, lifestyle tips to the hottest memes, we cover everything that matters to the digital generation. Our team of young writers and creators understand what resonates because they're part of the community they're writing for.
            </p>
            <p>
              Founded in 2024, EveryPages has quickly become a trusted source for quick reads that don't sacrifice quality for speed. We're committed to authentic storytelling and building a community where every voice matters.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advertise Modal */}
      <Dialog open={advertiseModalOpen} onOpenChange={setAdvertiseModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Advertise with EveryPages
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Reach the next generation of consumers with EveryPages. Our audience is highly engaged, digitally native, and ready to discover new brands and products.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Our Audience</h4>
                <ul className="text-sm space-y-1">
                  <li>• 65% Gen Z (18-26 years old)</li>
                  <li>• 25% Gen Alpha (13-17 years old)</li>
                  <li>• 10% Millennials (27-35 years old)</li>
                  <li>• High engagement rates</li>
                  <li>• Tech-savvy early adopters</li>
                </ul>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Ad Formats</h4>
                <ul className="text-sm space-y-1">
                  <li>• Banner ads (728x90)</li>
                  <li>• Sidebar ads (300x250)</li>
                  <li>• Square ads (250x250)</li>
                  <li>• Sponsored articles</li>
                  <li>• Newsletter sponsorships</li>
                </ul>
              </div>
            </div>

            <p>
              Our advertising solutions are designed to feel native to the EveryPages experience. We work with brands to create content that resonates with our audience while maintaining our authentic voice.
            </p>
            
            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Ready to get started?</strong> Contact our advertising team at{' '}
                <span className="text-primary font-medium">ads@everypages.com</span> or call{' '}
                <span className="text-primary font-medium">(555) 123-4567</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Modal */}
      <Dialog open={privacyModalOpen} onOpenChange={setPrivacyModalOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Privacy Policy
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
            <p className="text-xs text-muted-foreground">Last updated: January 2024</p>
            
            <section>
              <h3 className="font-semibold text-foreground mb-2">Information We Collect</h3>
              <p>
                We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">How We Use Your Information</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>To provide, maintain, and improve our services</li>
                <li>To send you newsletters and updates (with your consent)</li>
                <li>To respond to your comments and questions</li>
                <li>To analyze usage patterns and improve user experience</li>
                <li>To detect and prevent fraud and abuse</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Information Sharing</h3>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share information with trusted service providers who assist us in operating our website and conducting our business.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Cookies and Tracking</h3>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. To exercise these rights, please contact us at privacy@everypages.com.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-foreground mb-2">Changes to This Policy</h3>
              <p>
                We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <div className="bg-primary/10 p-4 rounded-lg">
              <p className="text-sm">
                <strong>Questions?</strong> Contact us at{' '}
                <span className="text-primary font-medium">privacy@everypages.com</span>
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}