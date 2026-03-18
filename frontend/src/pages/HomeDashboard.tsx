import { Card, CardContent } from '@/components/ui/card';
import { PageTitle, SectionTitle } from '../designB/components/DesignBTypography';
import { Activity, Heart, Pill, MessageSquare } from 'lucide-react';

export default function HomeDashboard() {

  const quickActions = [
    { icon: MessageSquare, label: 'Messages', color: 'text-accent' },
    { icon: Pill, label: 'Medications', color: 'text-chart-2' },
    { icon: Activity, label: 'Health Records', color: 'text-chart-3' },
  ];

  const vitals = [
    { label: 'Heart Rate', value: '72 bpm', icon: Heart, status: 'normal' },
    { label: 'Blood Pressure', value: '120/80', icon: Activity, status: 'normal' },
    { label: 'Weight', value: '165 lbs', icon: Activity, status: 'normal' },
  ];

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <PageTitle>Welcome Back, Alex</PageTitle>
        <p className="text-muted-foreground mt-2">Here's your health overview for today</p>
      </div>

      {/* Quick Actions */}
      <div>
        <SectionTitle className="mb-4">Quick Actions</SectionTitle>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.label}
                className="cursor-pointer hover:shadow-md transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6 space-y-2">
                  <Icon className={`h-8 w-8 ${action.color}`} />
                  <span className="text-sm font-medium text-center">{action.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Health Vitals */}
      <div>
        <SectionTitle className="mb-4">Health Vitals</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vitals.map((vital) => {
            const Icon = vital.icon;
            return (
              <Card key={vital.label}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{vital.label}</p>
                      <p className="text-2xl font-bold mt-1">{vital.value}</p>
                    </div>
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="mt-3 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded w-fit">
                    {vital.status}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <SectionTitle className="mb-4">Recent Activity</SectionTitle>
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Pill className="h-5 w-5 text-accent" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Prescription Refilled</p>
                <p className="text-sm text-muted-foreground">
                  Blood pressure medication refilled
                </p>
                <p className="text-xs text-muted-foreground mt-1">5 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
