import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import GaneshaChat from '@/components/GaneshaChat';

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
    // Smooth scroll to chat section
    setTimeout(() => {
      const chatElement = document.getElementById('ganesha-chat');
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags */}
      <title>Ganesha Guiding Light - Divine Wisdom & Spiritual Guidance</title>
      <meta name="description" content="Seek divine guidance from Lord Ganesha. Get spiritual wisdom, remove obstacles, and find peace through ancient teachings for modern life." />
      
      <main>
        {/* Hero Section */}
        <HeroSection onStartChat={handleStartChat} />
        
        {/* Chat Section */}
        {showChat && (
          <section id="ganesha-chat" className="py-16 px-6 bg-gradient-to-b from-background to-primary/5">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-foreground mb-4">
                  Sacred Conversation
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Open your heart and mind to receive divine guidance. 
                  Lord Ganesha listens with compassion and responds with wisdom.
                </p>
              </div>
              
              <GaneshaChat />
              
              {/* Additional Blessings */}
              <div className="mt-16 text-center">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                  <div className="p-6 bg-card rounded-xl border border-primary/10 shadow-lg">
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">🙏 Daily Blessings</h3>
                    <p className="text-muted-foreground">
                      "May this day bring you closer to your highest self, remove all obstacles from your path, 
                      and fill your heart with divine joy."
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-xl border border-primary/10 shadow-lg">
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">🕉️ Sacred Mantra</h3>
                    <p className="text-muted-foreground">
                      "Om Gan Ganapataye Namah - I bow to the remover of obstacles and the giver of wisdom. 
                      Chant with devotion for inner peace."
                    </p>
                  </div>
                  <div className="p-6 bg-card rounded-xl border border-primary/10 shadow-lg">
                    <h3 className="text-xl font-semibold text-card-foreground mb-3">✨ Divine Promise</h3>
                    <p className="text-muted-foreground">
                      "No sincere seeker leaves empty-handed. Every question finds its answer, 
                      every heart finds its peace through divine grace."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-r from-primary/5 to-secondary/5 border-t border-primary/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground">
            🕉️ May Lord Ganesha's blessings be with you always • Created with devotion and respect 🙏
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This is a spiritual guidance platform. For serious matters, please consult appropriate professionals.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
