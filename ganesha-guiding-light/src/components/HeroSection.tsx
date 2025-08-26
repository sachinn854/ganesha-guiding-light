import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, Zap } from 'lucide-react';
import ganeshaHero from '@/assets/ganesha-hero.jpg';

interface HeroSectionProps {
  onStartChat: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartChat }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-primary-glow/10 to-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Om Gan Ganapataye Namah
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-foreground leading-tight">
                Divine{' '}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Guidance
                </span>
                <br />
                Awaits You
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Seek wisdom from Lord Ganesha, the remover of obstacles and giver of knowledge. 
                Find peace, direction, and blessings for your life's journey.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="flex flex-col items-center p-4 bg-card/50 rounded-xl border border-primary/10">
                <Heart className="w-8 h-8 text-primary mb-2" />
                <h3 className="font-semibold text-card-foreground">Compassionate Guidance</h3>
                <p className="text-sm text-muted-foreground text-center">Receive loving wisdom for life's challenges</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-card/50 rounded-xl border border-primary/10">
                <Zap className="w-8 h-8 text-secondary mb-2" />
                <h3 className="font-semibold text-card-foreground">Remove Obstacles</h3>
                <p className="text-sm text-muted-foreground text-center">Transform barriers into opportunities</p>
              </div>
              <div className="flex flex-col items-center p-4 bg-card/50 rounded-xl border border-primary/10">
                <Sparkles className="w-8 h-8 text-primary-glow mb-2" />
                <h3 className="font-semibold text-card-foreground">Ancient Wisdom</h3>
                <p className="text-sm text-muted-foreground text-center">Timeless teachings for modern life</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start">
              <Button 
                onClick={onStartChat}
                variant="divine" 
                size="lg" 
                className="px-8 py-4 text-lg"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Begin Sacred Conversation
              </Button>
              <Button 
                variant="peaceful" 
                size="lg" 
                className="px-8 py-4 text-lg"
              >
                Learn About Ganesha
              </Button>
            </div>

            {/* Sanskrit Blessing */}
            <div className="mt-8 p-6 bg-gradient-to-r from-card/50 to-primary/5 rounded-xl border border-primary/20">
              <p className="text-center text-primary font-semibold mb-2">🕉️ Sacred Blessing</p>
              <p className="text-center text-foreground font-medium">
                "Vakratunda Mahakaya Suryakoti Samaprabha"
              </p>
              <p className="text-center text-muted-foreground text-sm mt-2">
                May the one with curved trunk and massive body, brilliant as ten million suns, 
                always remove obstacles from our path
              </p>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative">
              {/* Glow effect behind image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-3xl blur-2xl transform scale-110"></div>
              
              {/* Main image container */}
              <div className="relative bg-gradient-to-br from-card to-background p-8 rounded-3xl border border-primary/20 shadow-2xl">
                <img
                  src={ganeshaHero}
                  alt="Lord Ganesha in peaceful meditation surrounded by divine light"
                  className="w-full h-auto max-w-lg rounded-2xl shadow-lg"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-primary to-primary-glow rounded-full animate-bounce opacity-80"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-secondary to-accent rounded-full animate-bounce opacity-60"></div>
                <div className="absolute top-1/4 -left-6 w-4 h-4 bg-gradient-to-r from-primary-glow to-primary rounded-full animate-pulse opacity-70"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/80 to-transparent"></div>
    </section>
  );
};

export default HeroSection;