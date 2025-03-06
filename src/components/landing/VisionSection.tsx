
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users } from 'lucide-react';

const VisionSection = () => {
  return (
    <section id="vision" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-premium-dark-800/50 backdrop-blur-[50px] z-0"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium mb-4">
            <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
            <span>Our Vision</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-gold bg-clip-text text-transparent">Building trust through community</h2>
          <p className="text-lg text-muted-foreground">
            With trust as the foundation, we want to build a community platform which can help people in their everyday financial decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Card className="card-premium border-none bg-premium-dark-800/60 shadow-premium hover:shadow-premium-hover animate-hover-rise overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-premium-dark-700 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5 text-premium-gold" />
                </div>
                <span>Intelligence Layer</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We provide real-time insights by connecting you with trending discussions from other users, and by analyzing market data through fundamental and technical analysis.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-premium-gold mb-1">Trend Analysis</div>
                  <div className="text-sm">Discover market movements</div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-premium-gold mb-1">Smart Alerts</div>
                  <div className="text-sm">Personalized notifications</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-premium border-none bg-premium-dark-800/60 shadow-premium hover:shadow-premium-hover animate-hover-rise overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-premium-dark-700 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-premium-gold" />
                </div>
                <span>Trusted Circle</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Build your financial network with like-minded individuals and experts. Grow together financially and intellectually with people who share your values and goals.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-premium-gold mb-1">Peer Learning</div>
                  <div className="text-sm">Learn from experiences</div>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="text-xs text-premium-gold mb-1">Expert Access</div>
                  <div className="text-sm">Connect with professionals</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
