
import React from 'react';
import { PremiumButton } from './button';
import { PremiumCard, PremiumCardContent, PremiumCardDescription, PremiumCardFooter, PremiumCardHeader, PremiumCardTitle } from './card';
import { PremiumBadge } from './badge';
import { PremiumAvatar, PremiumAvatarFallback, PremiumAvatarImage } from './avatar';
import { ArrowRight, Check, Star, TrendingUp } from 'lucide-react';

export function PremiumUIShowcase() {
  return (
    <div className="space-y-10 p-6">
      <section className="space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">Premium Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <PremiumButton>Default Button</PremiumButton>
          <PremiumButton variant="outline">Outline Button</PremiumButton>
          <PremiumButton variant="ghost">Ghost Button</PremiumButton>
          <PremiumButton variant="link">Link Button</PremiumButton>
          <PremiumButton variant="glass">Glass Button</PremiumButton>
          <PremiumButton size="sm">Small Button</PremiumButton>
          <PremiumButton size="lg">Large Button</PremiumButton>
          <PremiumButton>
            <ArrowRight className="h-4 w-4" />
            With Icon
          </PremiumButton>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">Premium Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PremiumCard>
            <PremiumCardHeader>
              <PremiumBadge>Default</PremiumBadge>
              <PremiumCardTitle>Default Card</PremiumCardTitle>
              <PremiumCardDescription>This is a description for the default card variant.</PremiumCardDescription>
            </PremiumCardHeader>
            <PremiumCardContent>
              <p>This is the standard card component with default styling.</p>
            </PremiumCardContent>
            <PremiumCardFooter className="justify-between">
              <span className="text-sm text-muted-foreground">Footer text</span>
              <PremiumButton size="sm">Action</PremiumButton>
            </PremiumCardFooter>
          </PremiumCard>

          <PremiumCard variant="premium">
            <PremiumCardHeader>
              <PremiumBadge variant="filled">Premium</PremiumBadge>
              <PremiumCardTitle>Premium Card</PremiumCardTitle>
              <PremiumCardDescription>This is a description for the premium card variant.</PremiumCardDescription>
            </PremiumCardHeader>
            <PremiumCardContent>
              <p>This card has premium styling with gold accents and enhanced shadows.</p>
            </PremiumCardContent>
            <PremiumCardFooter className="justify-between">
              <span className="text-sm text-muted-foreground">Premium feature</span>
              <PremiumButton size="sm">
                <Star className="h-4 w-4" />
                Upgrade
              </PremiumButton>
            </PremiumCardFooter>
          </PremiumCard>

          <PremiumCard variant="glass">
            <PremiumCardHeader>
              <PremiumBadge variant="glass">Glass</PremiumBadge>
              <PremiumCardTitle>Glass Card</PremiumCardTitle>
              <PremiumCardDescription>This is a description for the glass card variant.</PremiumCardDescription>
            </PremiumCardHeader>
            <PremiumCardContent>
              <p>This card uses a glass-morphism effect with backdrop blur.</p>
            </PremiumCardContent>
            <PremiumCardFooter className="justify-between">
              <span className="text-sm text-muted-foreground">Transparent UI</span>
              <PremiumButton variant="glass" size="sm">View</PremiumButton>
            </PremiumCardFooter>
          </PremiumCard>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">Premium Badges</h2>
        <div className="flex flex-wrap gap-4">
          <PremiumBadge>Default Badge</PremiumBadge>
          <PremiumBadge variant="outline">Outline Badge</PremiumBadge>
          <PremiumBadge variant="glass">Glass Badge</PremiumBadge>
          <PremiumBadge variant="filled">Filled Badge</PremiumBadge>
          <PremiumBadge variant="success">Success Badge</PremiumBadge>
          <PremiumBadge variant="warning">Warning Badge</PremiumBadge>
          <PremiumBadge variant="danger">Danger Badge</PremiumBadge>
          <PremiumBadge size="sm">Small Badge</PremiumBadge>
          <PremiumBadge size="lg">Large Badge</PremiumBadge>
          <PremiumBadge animation="pulse">
            <TrendingUp className="h-3 w-3" />
            Trending
          </PremiumBadge>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">Premium Avatars</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <PremiumAvatar>
            <PremiumAvatarImage src="/placeholder.svg" alt="User" />
            <PremiumAvatarFallback>JP</PremiumAvatarFallback>
          </PremiumAvatar>
          
          <PremiumAvatar variant="bordered">
            <PremiumAvatarImage src="/placeholder.svg" alt="User" />
            <PremiumAvatarFallback>IP</PremiumAvatarFallback>
          </PremiumAvatar>
          
          <PremiumAvatar variant="glowing">
            <PremiumAvatarImage src="/placeholder.svg" alt="User" />
            <PremiumAvatarFallback>VIP</PremiumAvatarFallback>
          </PremiumAvatar>
          
          <PremiumAvatar variant="glass">
            <PremiumAvatarFallback>GL</PremiumAvatarFallback>
          </PremiumAvatar>
          
          <PremiumAvatar size="xs">
            <PremiumAvatarFallback>XS</PremiumAvatarFallback>
          </PremiumAvatar>
          
          <PremiumAvatar size="sm">
            <PremiumAvatarFallback>SM</PremiumAvatarFallback>
          </PremiumAvatar>
          
          <PremiumAvatar size="lg">
            <PremiumAvatarFallback>LG</PremiumAvatarFallback>
          </PremiumAvatar>
          
          <PremiumAvatar size="xl">
            <PremiumAvatarFallback>XL</PremiumAvatarFallback>
          </PremiumAvatar>
        </div>
      </section>
    </div>
  );
}
