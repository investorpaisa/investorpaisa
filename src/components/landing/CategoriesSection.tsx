
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, PieChart, Target, Briefcase, LineChart, Shield, CreditCard, ChevronRight } from 'lucide-react';

const CategoriesSection = () => {
  return (
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
  );
};

export default CategoriesSection;
