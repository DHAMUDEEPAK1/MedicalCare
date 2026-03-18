import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PageTitle, BodyText } from '../designB/components/DesignBTypography';
import { ArrowRight } from 'lucide-react';
import { useAuthSession } from '../hooks/useAuthSession';

export default function Welcome() {
  const navigate = useNavigate();
  const { continueAsGuest } = useAuthSession();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Logo */}
        <img
          src="/assets/generated/healthcare-logo.dim_512x512.png"
          alt="HealthCare Logo"
          className="h-24 w-24"
        />

        {/* Hero Image */}
        <div className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-lg">
          <img
            src="/assets/generated/healthcare-hero.dim_1600x900.png"
            alt="Healthcare Hero"
            className="w-full h-auto"
          />
        </div>

        {/* Content */}
        <div className="space-y-4 max-w-xl">
          <PageTitle>Welcome to HealthCare</PageTitle>
          <BodyText className="text-muted-foreground">
            Your trusted partner in health and wellness. Connect with top healthcare professionals,
            and take control of your health journey—all in one place.
          </BodyText>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-8">
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="text-4xl">🩺</div>
            <h3 className="font-semibold">Expert Doctors</h3>
            <p className="text-sm text-muted-foreground text-center">
              Access to qualified healthcare professionals
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="text-4xl">📊</div>
            <h3 className="font-semibold">Health Insights</h3>
            <p className="text-sm text-muted-foreground text-center">
              Personalized health data tracking
            </p>
          </div>
          <div className="flex flex-col items-center space-y-2 p-4">
            <div className="text-4xl">💊</div>
            <h3 className="font-semibold">Health Tracking</h3>
            <p className="text-sm text-muted-foreground text-center">
              Monitor your health progress over time
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/signin' })}
            className="gap-2"
          >
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              continueAsGuest();
              navigate({ to: '/home' });
            }}
          >
            Explore as Guest
          </Button>
        </div>
      </div>
    </div>
  );
}
