import { PageTitle, SectionTitle, BodyText } from '../designB/components/DesignBTypography';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Lock, Eye, Database, Shield } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 md:py-16">
      <Button 
        variant="ghost" 
        onClick={() => navigate({ to: '/' })}
        className="mb-8 gap-2 hover:bg-primary/10 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Home
      </Button>

      <div className="space-y-12">
        <header className="space-y-4 border-b pb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <Lock className="h-8 w-8" />
          </div>
          <PageTitle>Privacy Policy</PageTitle>
          <BodyText className="text-muted-foreground text-lg">
            Last Updated: April 9, 2026
          </BodyText>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Eye className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>1. Data Transparency</SectionTitle>
          </div>
          <BodyText>
            At HealthCare, your privacy is our highest priority. This policy explains how we collect, 
            use, and protect your personal and health data. We are committed to transparency in all 
            our data practices.
          </BodyText>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Database className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>2. Information We Collect</SectionTitle>
          </div>
          <BodyText>
            We collect information that you provided directly to us, including:
          </BodyText>
          <ul className="list-disc pl-6 space-y-3 text-foreground/80">
            <li>
              <strong>Account Information:</strong> Name, email address, and authentication data.
            </li>
            <li>
              <strong>Health Data:</strong> Vital signs, symptoms, medications, and health history 
              that you explicitly enter or sync from connected devices.
            </li>
            <li>
              <strong>Interaction Data:</strong> Logs of your conversations with Goku AI to improve 
              personalized responses.
            </li>
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Shield className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>3. How We Protect Your Data</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-card border shadow-sm">
              <h4 className="font-semibold mb-2">End-to-End Encryption</h4>
              <p className="text-sm text-muted-foreground">
                Sensitive health data is encrypted both in transit and at rest using industry-standard protocols.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-card border shadow-sm">
              <h4 className="font-semibold mb-2">Private AI</h4>
              <p className="text-sm text-muted-foreground">
                Your AI consultations are processed with strict privacy controls and are not used to 
                adversely affect your insurance or employment.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Eye className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>4. Data Sharing</SectionTitle>
          </div>
          <BodyText>
            We do NOT sell your personal health information to third parties. We only share 
            information when necessary to provide the Service, comply with the law, or 
            protect our rights.
          </BodyText>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <Shield className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>5. Your Rights</SectionTitle>
          </div>
          <BodyText>
            You have the right to access, update, or delete your data at any time through your 
            profile settings. You can also request a full export of your health history.
          </BodyText>
        </section>

        <footer className="pt-12 border-t text-center">
          <BodyText className="text-muted-foreground italic">
            Privacy concerns? Contact our Data Protection Officer at privacy@yourdomain.com
          </BodyText>
        </footer>
      </div>
    </div>
  );
}
