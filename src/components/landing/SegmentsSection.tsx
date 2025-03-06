
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';

const SegmentsSection = () => {
  return (
    <section id="segments" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-premium-dark-800/40 backdrop-blur-[50px] z-0"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium mb-4">
            <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
            <span>Who We Serve</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-gold bg-clip-text text-transparent">Something for everyone</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our platform is designed to meet the needs of diverse financial journeys.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-premium border-none bg-premium-dark-800/60 shadow-premium hover:shadow-premium-hover animate-hover-rise overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <div className="badge-premium">Segment 1</div>
            </div>
            <CardHeader>
              <CardTitle>Young Professionals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ages 22-35 with graduate education</p>
                <p className="text-sm text-muted-foreground">Income: 5-30 LPA</p>
                <p className="text-sm text-muted-foreground">Location: Tier 2 & 3 cities</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-premium-gold mb-2">Goals & Needs</h4>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Ambitious & looking to grow wealth</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Saving basics, budgeting, investment for first major purchases</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Limited investment knowledge, seeking credible advice</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-none bg-premium-dark-800/60 shadow-premium hover:shadow-premium-hover animate-hover-rise overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <div className="badge-premium">Segment 2</div>
            </div>
            <CardHeader>
              <CardTitle>Young Influencers</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ages 22-35 with graduate education</p>
                <p className="text-sm text-muted-foreground">Income: 5-30 LPA</p>
                <p className="text-sm text-muted-foreground">Location: Tier 2 & 3 cities</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-premium-gold mb-2">Goals & Needs</h4>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Self-proclaimed experts building personal brands</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Need for personal brand & growing follower base</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Challenge in discoverability and monetization</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium border-none bg-premium-dark-800/60 shadow-premium hover:shadow-premium-hover animate-hover-rise overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <div className="badge-premium">Segment 3</div>
            </div>
            <CardHeader>
              <CardTitle>Certified Experts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ages 35-50 with professional certifications</p>
                <p className="text-sm text-muted-foreground">Income: 30 LPA+</p>
                <p className="text-sm text-muted-foreground">Location: Tier 2 & 3 cities</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-premium-gold mb-2">Goals & Needs</h4>
                <ul className="space-y-1">
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>SEBI/ICAI/IRDAI certified experts looking to scale services</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Help with Go-To-Market & taking business online</span>
                  </li>
                  <li className="text-sm flex items-start">
                    <ChevronRight className="h-4 w-4 text-premium-gold mr-1 mt-0.5 shrink-0" />
                    <span>Challenged by content creation & brand building</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SegmentsSection;
