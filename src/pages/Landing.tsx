
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Users, Shield, LineChart, MessageSquare, Target, Briefcase, PieChart, CreditCard, TrendingUp, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-premium">
      {/* Header */}
      <header className="py-6 px-8 border-b border-premium-dark-700/30 backdrop-blur-sm bg-premium-dark-900/50 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="#vision" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Vision
            </Link>
            <Link to="#categories" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Categories
            </Link>
            <Link to="#segments" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Who We Serve
            </Link>
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link to="/auth/register" className="btn-premium text-sm py-2 px-4">
              Sign Up
            </Link>
          </nav>
          <div className="md:hidden flex items-center">
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground mr-4">
              Sign In
            </Link>
            <Link to="/auth/register" className="btn-premium text-sm py-2 px-4">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-premium-dark-800/30 backdrop-blur-[100px] z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium">
                <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
                <span>Financial decisions simplified</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                <span className="bg-gradient-gold bg-clip-text text-transparent">Facebook</span> for your everyday <span className="bg-gradient-gold bg-clip-text text-transparent">financial decisions</span>
              </h1>
              <p className="text-lg text-muted-foreground md:pr-10">
                A community platform empowering users on their financial journeys, from taxation to investments, personal finance to debt management.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild className="btn-premium px-6 py-6 rounded-lg animate-hover-rise">
                  <Link to="/auth/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="btn-outline px-6 py-6 rounded-lg animate-hover-rise">
                  <Link to="#vision">
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="glass-accent rounded-2xl p-6 shadow-premium transform translate-x-8 animate-fade-in">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-premium-gold"></div>
                  <div className="text-sm font-medium">Financial Intelligence</div>
                </div>
                <div className="space-y-3">
                  <div className="glass rounded-lg p-3 animate-hover-rise">
                    <div className="text-xs text-premium-gold mb-1">Trending Insight</div>
                    <div className="text-sm font-medium mb-1">Best tax saving options for young professionals in 2023</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Users className="h-3 w-3 mr-1" />
                      <span>2.3k people discussing</span>
                    </div>
                  </div>
                  <div className="glass rounded-lg p-3 animate-hover-rise">
                    <div className="text-xs text-premium-gold mb-1">Market Update</div>
                    <div className="text-sm font-medium mb-1">SIP returns outperform fixed deposits by 3x this quarter</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>Rising trend in mutual funds</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-accent rounded-2xl p-6 shadow-premium transform -translate-x-8 translate-y-4 animate-fade-in delay-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-premium-gold"></div>
                  <div className="text-sm font-medium">Community Experts</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 glass rounded-lg p-3 animate-hover-rise">
                    <div className="h-10 w-10 rounded-full bg-premium-dark-700 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-premium-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">SEBI Certified Advisor</div>
                      <div className="text-xs text-muted-foreground">Specializes in equity markets</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 glass rounded-lg p-3 animate-hover-rise">
                    <div className="h-10 w-10 rounded-full bg-premium-dark-700 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-premium-gold" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Tax Consultant</div>
                      <div className="text-xs text-muted-foreground">Expert in personal taxation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision */}
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

      {/* Categories */}
      <section id="categories" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-premium-dark-900/30 backdrop-blur-[30px] z-0"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium mb-4">
              <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
              <span>Financial Categories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-gold bg-clip-text text-transparent">Complete financial ecosystem</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Investor Paisa covers all your financial needs across credit and debit management.
            </p>
          </div>

          <Tabs defaultValue="credit" className="w-full">
            <TabsList className="grid grid-cols-2 h-auto p-1 mb-8">
              <TabsTrigger value="credit" className="py-3 data-[state=active]:bg-premium-dark-700/60 data-[state=active]:text-premium-gold">
                <TrendingUp className="h-4 w-4 mr-2" />
                Credit
              </TabsTrigger>
              <TabsTrigger value="debit" className="py-3 data-[state=active]:bg-premium-dark-700/60 data-[state=active]:text-premium-gold">
                <PieChart className="h-4 w-4 mr-2" />
                Debit
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="credit" className="border border-premium-dark-700/30 rounded-lg p-6 bg-premium-dark-800/30 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-lg bg-premium-dark-700 flex items-center justify-center mr-4">
                      <Target className="h-6 w-6 text-premium-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Passive Income</h3>
                      <p className="text-muted-foreground">
                        Set short and long-term financial goals, and plan the right investments to realize them. Optimize your portfolio for growth and stability.
                      </p>
                      <ul className="space-y-2 mt-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Goal-based investment strategies</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Portfolio diversification</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Passive income generation tools</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-lg bg-premium-dark-700 flex items-center justify-center mr-4">
                      <Briefcase className="h-6 w-6 text-premium-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Active Income</h3>
                      <p className="text-muted-foreground">
                        Maintain consistent active income and achieve growth by connecting with the right people who share your values and similar future goals.
                      </p>
                      <ul className="space-y-2 mt-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Career growth strategies</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Networking opportunities</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Side hustle optimization</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="debit" className="border border-premium-dark-700/30 rounded-lg p-6 bg-premium-dark-800/30 backdrop-blur-sm">
              <div className="grid grid-cols-1 gap-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-lg bg-premium-dark-700 flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-premium-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Taxation</h3>
                      <p className="text-muted-foreground">
                        Ensure compliance with latest and ever-changing local taxation guidelines and avoid tax filing hustle.
                      </p>
                      <ul className="space-y-2 mt-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Tax planning strategies</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Compliance updates</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-lg bg-premium-dark-700 flex items-center justify-center mr-4">
                      <CreditCard className="h-6 w-6 text-premium-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Personal Finance</h3>
                      <p className="text-muted-foreground">
                        Save money by building better behaviors, using the right financial tools, and establishing financial discipline.
                      </p>
                      <ul className="space-y-2 mt-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Budgeting techniques</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Credit optimization</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-lg bg-premium-dark-700 flex items-center justify-center mr-4">
                      <LineChart className="h-6 w-6 text-premium-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Debt Management</h3>
                      <p className="text-muted-foreground">
                        Get the best value for debt undertaken across channels and debt mediums when goals aren't being met in the expected timeline.
                      </p>
                      <ul className="space-y-2 mt-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Debt consolidation</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Interest optimization</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="h-12 w-12 rounded-lg bg-premium-dark-700 flex items-center justify-center mr-4">
                      <Shield className="h-6 w-6 text-premium-gold" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Risk Management</h3>
                      <p className="text-muted-foreground">
                        Understand individual risks and ensure the right coverage, reducing risk with appropriate products and strategies.
                      </p>
                      <ul className="space-y-2 mt-3">
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Insurance optimization</span>
                        </li>
                        <li className="flex items-center">
                          <ChevronRight className="h-4 w-4 text-premium-gold mr-2" />
                          <span>Emergency planning</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Who We Serve */}
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

      {/* CTA */}
      <section className="py-20 px-4 bg-premium-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-premium-gold/20 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-premium-gold/20 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center rounded-full border border-premium-gold/30 px-4 py-1.5 text-sm font-medium mb-6">
            <span className="block h-2 w-2 rounded-full bg-premium-gold mr-2"></span>
            <span>Join Our Community</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-gold bg-clip-text text-transparent">Ready to make better financial decisions?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join our community today and connect with thousands of users and experts who are on the same financial journey as you.
          </p>
          <Button asChild className="btn-premium px-8 py-6 rounded-lg animate-hover-rise">
            <Link to="/auth/register">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-premium-dark-700/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-gold bg-clip-text text-transparent">Investor Paisa</h3>
              <p className="text-sm text-muted-foreground mb-4">
                A community platform empowering users on their financial journeys.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">My Feed</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Discover</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Inbox</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Passive Income</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Active Income</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Taxation</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Personal Finance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-premium-dark-700/30 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Investor Paisa. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-muted-foreground hover:text-premium-gold transition-colors">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-premium-gold transition-colors">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-premium-gold transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
