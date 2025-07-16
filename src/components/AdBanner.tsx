import { Card } from './ui/card';

interface AdBannerProps {
  size: 'banner' | 'sidebar' | 'square';
  className?: string;
}

export function AdBanner({ size, className = '' }: AdBannerProps) {
  const getAdContent = () => {
    switch (size) {
      case 'banner':
        return {
          width: 'w-full',
          height: 'h-24',
          text: 'Your Ad Here - 728x90',
          bgColor: 'bg-gradient-to-r from-primary/10 to-accent/10'
        };
      case 'sidebar':
        return {
          width: 'w-full',
          height: 'h-64',
          text: 'Sidebar Ad - 300x250',
          bgColor: 'bg-gradient-to-b from-accent/10 to-primary/10'
        };
      case 'square':
        return {
          width: 'w-full',
          height: 'h-48',
          text: 'Square Ad - 250x250',
          bgColor: 'bg-gradient-to-br from-primary/10 to-accent/10'
        };
    }
  };

  const ad = getAdContent();

  return (
    <Card className={`${ad.width} ${ad.height} ${ad.bgColor} ${className}`}>
      <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-lg">
        <div className="text-center">
          <div className="text-muted-foreground font-medium mb-1">
            Advertisement
          </div>
          <div className="text-sm text-muted-foreground/70">
            {ad.text}
          </div>
        </div>
      </div>
    </Card>
  );
}