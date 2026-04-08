import { PageTitle, SectionTitle, BodyText } from '../designB/components/DesignBTypography';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ChevronLeft, Scale, FileText, ShieldCheck } from 'lucide-react';

export default function Terms() {
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
            <Scale className="h-8 w-8" />
          </div>
          <PageTitle>Terms of Service</PageTitle>
          <BodyText className="text-muted-foreground text-lg">
            Last Updated: April 9, 2026
          </BodyText>
        </header>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>1. Introduction</SectionTitle>
          </div>
          <BodyText>
            Welcome to HealthCare. These Terms of Service ("Terms") govern your use of our website, 
            mobile applications, and health tracking services (collectively, the "Services"). 
            By accessing or using our Services, you agree to be bound by these Terms and our 
            Privacy Policy.
          </BodyText>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <ShieldCheck className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>2. Medical Disclaimer</SectionTitle>
          </div>
          <div className="p-6 rounded-2xl bg-destructive/5 border border-destructive/10">
            <BodyText className="font-medium text-destructive-foreground">
              HealthCare provides tools for health tracking and information sharing only. 
              The AI assistant (Goku) and other features are NOT a substitute for professional 
              medical advice, diagnosis, or treatment. Always seek the advice of your physician 
              or other qualified health provider with any questions you may have regarding a 
              medical condition.
            </BodyText>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>3. User Accounts</SectionTitle>
          </div>
          <BodyText>
            To use certain features of the Service, you may be required to register for an account. 
            You must provide accurate and complete information and keep your account password secure. 
            You are responsible for all activity that occurs under your account.
          </BodyText>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>4. Use of Services</SectionTitle>
          </div>
          <BodyText>
            You agree to use the Services only for lawful purposes and in accordance with these Terms. 
            You may not:
          </BodyText>
          <ul className="list-disc pl-6 space-y-2 text-foreground/80">
            <li>Use the Services in any way that violates applicable laws.</li>
            <li>Attempt to interfere with or disrupt the integrity or performance of the Services.</li>
            <li>Use any robot, spider, or other automatic device to access the Services.</li>
          </ul>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-secondary">
              <FileText className="h-5 w-5 text-secondary-foreground" />
            </div>
            <SectionTitle>5. Limitation of Liability</SectionTitle>
          </div>
          <BodyText>
            To the maximum extent permitted by law, HealthCare shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
            whether incurred directly or indirectly.
          </BodyText>
        </section>

        <footer className="pt-12 border-t text-center">
          <BodyText className="text-muted-foreground italic">
            Questions? Contact us at legal@yourdomain.com
          </BodyText>
        </footer>
      </div>
    </div>
  );
}
