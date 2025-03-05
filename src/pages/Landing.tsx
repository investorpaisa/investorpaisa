
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronRight, Users, Wallet, Shield, LineChart, MessageSquare, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/30">
      {/* Header */}
      <header className="py-6 px-8 border-b backdrop-blur-sm bg-background/50 sticky top-0 z-10">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-ip-blue">Investor Paisa</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="#community" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Community
            </Link>
            <Link to="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Link to="/auth/register" className="text-sm bg-ip-teal text-white px-4 py-2 rounded-md hover:bg-ip-teal-600 transition-colors">
              Sign Up
            </Link>
          </nav>
          <div className="md:hidden flex items-center">
            <Link to="/auth/login" className="text-sm text-muted-foreground hover:text-foreground mr-4">
              Sign In
            </Link>
            <Link to="/auth/register" className="text-sm bg-ip-teal text-white px-4 py-2 rounded-md hover:bg-ip-teal-600 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 md:space-y-8 animate-fade-in">
              <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium">
                <span className="block h-2 w-2 rounded-full bg-ip-teal mr-2"></span>
                <span>Community platform for financial decisions</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight title-animation">
                <span>Facebook</span> <span>for</span> <span>your</span> <span>everyday</span> <span>financial</span> <span>decisions</span>
              </h1>
              <p className="text-lg text-muted-foreground md:pr-10">
                Join a thriving community where people help each other make better financial decisions, from taxation to investments, personal finance to debt management.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Button asChild className="bg-ip-blue hover:bg-ip-blue-800 text-white font-medium px-6 py-6 rounded-lg animate-hover-rise">
                  <Link to="/auth/register">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-ip-blue/20 px-6 py-6 rounded-lg animate-hover-rise">
                  <Link to="#features">
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden md:block">
              <div className="glass rounded-2xl p-6 shadow-lg transform translate-x-8 animate-fade-in">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-ip-teal"></div>
                  <div className="text-sm font-medium">Trending Posts</div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="glass rounded-lg p-3 animate-hover-rise">
                      <div className="text-xs text-ip-teal mb-1">Investments</div>
                      <div className="text-sm font-medium mb-1">How to start your SIP journey in 2023</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        <span>2.3k people discussing</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass rounded-2xl p-6 shadow-lg transform -translate-x-8 translate-y-4 animate-fade-in delay-100">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-3 w-3 rounded-full bg-ip-teal"></div>
                  <div className="text-sm font-medium">Financial Experts</div>
                </div>
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center space-x-3 glass rounded-lg p-3 animate-hover-rise">
                      <div className="h-10 w-10 rounded-full bg-ip-blue-100 flex items-center justify-center">
                        <Info className="h-5 w-5 text-ip-blue" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Financial Expert {i}</div>
                        <div className="text-xs text-muted-foreground">SEBI Certified Advisor</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <span className="block h-2 w-2 rounded-full bg-ip-teal mr-2"></span>
              <span>Key Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Four pillars of Investor Paisa</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our platform is built around four core pillars to give you the best experience in managing your financial decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-smooth animate-hover-rise">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-ip-blue-50 flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-ip-blue" />
                </div>
                <CardTitle>My Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Personalized feed of content based on your preferences and financial goals.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-smooth animate-hover-rise">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-ip-blue-50 flex items-center justify-center mb-4">
                  <Compass className="h-6 w-6 text-ip-blue" />
                </div>
                <CardTitle>Discover Market</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Explore new trending content and ongoing discussions across various financial categories.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-smooth animate-hover-rise">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-ip-blue-50 flex items-center justify-center mb-4">
                  <MessageSquare className="h-6 w-6 text-ip-blue" />
                </div>
                <CardTitle>Services & Inbox</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Connect with influencers and experts for personalized services based on your needs.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-smooth animate-hover-rise">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-ip-blue-50 flex items-center justify-center mb-4">
                  <User className="h-6 w-6 text-ip-blue" />
                </div>
                <CardTitle>Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Manage your profile, highlights, and account settings to tailor your experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full border px-4 py-1.5 text-sm font-medium mb-4">
              <span className="block h-2 w-2 rounded-full bg-ip-teal mr-2"></span>
              <span>Financial Categories</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need for your financial journey</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Investor Paisa covers all aspects of your financial needs, from taxation to investments.
            </p>
          </div>

          <Tabs defaultValue="taxation" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 h-auto p-1 mb-8">
              <TabsTrigger value="taxation" className="py-3">
                <Shield className="h-4 w-4 mr-2" />
                Taxation
              </TabsTrigger>
              <TabsTrigger value="personal" className="py-3">
                <Wallet className="h-4 w-4 mr-2" />
                Personal Finance
              </TabsTrigger>
              <TabsTrigger value="investments" className="py-3">
                <LineChart className="h-4 w-4 mr-2" />
                Investments
              </TabsTrigger>
              <TabsTrigger value="debt" className="py-3">
                <Info className="h-4 w-4 mr-2" />
                Debt Management
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="taxation" className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Taxation Guidance</h3>
                  <p className="text-muted-foreground mb-6">
                    Navigate the complex world of taxation with expert advice, stay compliant with latest guidelines, and avoid the tax filing hustle.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Latest taxation updates and changes</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Tax-saving investment options</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Guidance for tax filing and compliance</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block">
                  <div className="bg-ip-blue-50 rounded-lg h-full flex items-center justify-center p-6">
                    <Shield className="h-24 w-24 text-ip-blue/20" />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="personal" className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Personal Finance</h3>
                  <p className="text-muted-foreground mb-6">
                    Build better financial behaviors, use the right financial tools, and establish financial discipline through awareness.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Budgeting tips and strategies</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Credit/debit card optimization</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Best value for money during expenditure</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block">
                  <div className="bg-ip-blue-50 rounded-lg h-full flex items-center justify-center p-6">
                    <Wallet className="h-24 w-24 text-ip-blue/20" />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="investments" className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Investment Planning</h3>
                  <p className="text-muted-foreground mb-6">
                    Set short and long-term financial goals and develop effective plans to achieve them through smart investments.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Goal-based investment planning</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Investment strategies for different life stages</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Risk assessment and portfolio diversification</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block">
                  <div className="bg-ip-blue-50 rounded-lg h-full flex items-center justify-center p-6">
                    <LineChart className="h-24 w-24 text-ip-blue/20" />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="debt" className="border rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Debt Management</h3>
                  <p className="text-muted-foreground mb-6">
                    Get the best value for debt undertaken across various channels and mediums when goals aren't being met in the expected timeline.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Debt consolidation strategies</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Managing various loan options</span>
                    </li>
                    <li className="flex items-center">
                      <ChevronRight className="h-4 w-4 text-ip-teal mr-2" />
                      <span>Credit improvement and debt reduction plans</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden md:block">
                  <div className="bg-ip-blue-50 rounded-lg h-full flex items-center justify-center p-6">
                    <Info className="h-24 w-24 text-ip-blue/20" />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-ip-blue-900 text-white">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to make better financial decisions?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-3xl mx-auto">
            Join our community today and connect with thousands of users and experts who are on the same financial journey as you.
          </p>
          <Button asChild className="bg-ip-teal hover:bg-ip-teal-600 text-white font-medium px-8 py-6 rounded-lg animate-hover-rise">
            <Link to="/auth/register">
              Get Started Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-white border-t">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Investor Paisa</h3>
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
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Taxation</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Personal Finance</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Investments</Link></li>
                <li><Link to="#" className="text-muted-foreground hover:text-foreground">Debt Management</Link></li>
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
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Investor Paisa. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-ip-blue hover:text-ip-blue-700">
                <span className="sr-only">Twitter</span>
                {/* Twitter icon placeholder */}
                <div className="h-5 w-5 bg-ip-blue-100 rounded-full"></div>
              </Link>
              <Link to="#" className="text-ip-blue hover:text-ip-blue-700">
                <span className="sr-only">Instagram</span>
                {/* Instagram icon placeholder */}
                <div className="h-5 w-5 bg-ip-blue-100 rounded-full"></div>
              </Link>
              <Link to="#" className="text-ip-blue hover:text-ip-blue-700">
                <span className="sr-only">LinkedIn</span>
                {/* LinkedIn icon placeholder */}
                <div className="h-5 w-5 bg-ip-blue-100 rounded-full"></div>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
