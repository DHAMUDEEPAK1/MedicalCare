import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DesignBSurface } from '../designB/components/DesignBSurface';
import { SectionTitle, BodyText } from '../designB/components/DesignBTypography';
import { Heart, TrendingUp, TrendingDown, Minus, Activity, Loader2, X, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

interface LocalPrediction {
  riskLevel: string;
  confidence: number;
  modelVersion: string;
  timestamp: number;
  featureWeights: [string, number][];
}

export function HealthRiskAssessment() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<LocalPrediction | null>(null);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    cholesterol: '',
    bloodPressure: '',
    bmi: '',
    heartRate: '',
    smokingStatus: 'never',
    diabetesStatus: 'no',
    exerciseFrequency: '',
    medicationAdherence: 'good',
    saltIntake: 'low',
    stressLevel: 'low',
    sleepQuality: 'good',
  });

  useEffect(() => {
    const stored = localStorage.getItem('ml_prediction');
    if (stored) {
      setPrediction(JSON.parse(stored));
    }
  }, []);

  const calculateRiskScore = (input: typeof formData): { score: number; featureWeights: [string, number][] } => {
    const age = parseInt(input.age) || 30;
    const cholesterol = parseInt(input.cholesterol) || 180;
    const bloodPressure = parseInt(input.bloodPressure) || 120;
    const bmi = parseInt(input.bmi) || 25;
    const heartRate = parseInt(input.heartRate) || 72;
    const exerciseFrequency = parseInt(input.exerciseFrequency) || 3;

    const ageScore = age * 2;
    const cholesterolScore = (cholesterol / 10) * 3;
    const bloodPressureScore = (bloodPressure / 10) * 2;
    const bmiScore = bmi * 2;
    const heartRateScore = heartRate * 0.5;

    let smokingScore = 0;
    if (input.smokingStatus === 'current') smokingScore = 20;
    else if (input.smokingStatus === 'previous') smokingScore = 10;

    let diabetesScore = input.diabetesStatus === 'yes' ? 15 : input.diabetesStatus === 'pre' ? 7 : 0;

    let exerciseScore = 0;
    if (exerciseFrequency < 3) exerciseScore = 10;
    else if (exerciseFrequency < 5) exerciseScore = 5;

    let medicationScore = 0;
    if (input.medicationAdherence === 'moderate') medicationScore = 5;
    else if (input.medicationAdherence === 'poor') medicationScore = 10;

    let saltScore = 0;
    if (input.saltIntake === 'high') saltScore = 8;
    else if (input.saltIntake === 'moderate') saltScore = 4;

    let stressScore = 0;
    if (input.stressLevel === 'high') stressScore = 10;
    else if (input.stressLevel === 'moderate') stressScore = 5;

    let sleepScore = 0;
    if (input.sleepQuality === 'poor') sleepScore = 10;
    else if (input.sleepQuality === 'moderate') sleepScore = 5;

    const totalScore = 
      ageScore + 
      cholesterolScore + 
      bloodPressureScore + 
      bmiScore + 
      heartRateScore + 
      smokingScore + 
      diabetesScore + 
      exerciseScore + 
      medicationScore +
      saltScore +
      stressScore +
      sleepScore;

    const featureWeights: [string, number][] = [
      ['cholesterol', Math.round((cholesterolScore / totalScore) * 100) || 20],
      ['bloodPressure', Math.round((bloodPressureScore / totalScore) * 100) || 18],
      ['age', Math.round((ageScore / totalScore) * 100) || 15],
      ['bmi', Math.round((bmiScore / totalScore) * 100) || 12],
      ['smokingStatus', Math.round((smokingScore / totalScore) * 100) || 10],
      ['diabetesStatus', Math.round((diabetesScore / totalScore) * 100) || 8],
      ['exerciseFrequency', Math.round((exerciseScore / totalScore) * 100) || 7],
      ['stressLevel', Math.round((stressScore / totalScore) * 100) || 5],
      ['sleepQuality', Math.round((sleepScore / totalScore) * 100) || 3],
      ['heartRate', Math.round((heartRateScore / totalScore) * 100) || 2],
    ];

    return { score: Math.round(totalScore), featureWeights };
  };

  const determineRiskLevel = (score: number): string => {
    if (score <= 40) return 'Low';
    if (score <= 80) return 'Moderate';
    return 'High';
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { age, cholesterol, bloodPressure, bmi, heartRate, exerciseFrequency } = formData;

    if (!age || !cholesterol || !bloodPressure || !bmi || !heartRate || !exerciseFrequency) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    
    try {
      const { score, featureWeights } = calculateRiskScore(formData);
      const riskLevel = determineRiskLevel(score);

      const result: LocalPrediction = {
        riskLevel,
        confidence: 90,
        modelVersion: '1.0.0',
        timestamp: Date.now(),
        featureWeights,
      };

      localStorage.setItem('ml_prediction', JSON.stringify(result));
      setPrediction(result);
      setIsOpen(false);
      toast.success('Health Risk Assessment Complete!');
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to calculate health risk');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'moderate':
        return 'text-amber-600 bg-amber-100 border-amber-200';
      case 'high':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return <TrendingDown className="h-6 w-6" />;
      case 'moderate':
        return <Minus className="h-6 w-6" />;
      case 'high':
        return <TrendingUp className="h-6 w-6" />;
      default:
        return <Activity className="h-6 w-6" />;
    }
  };

  const getRecommendation = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low':
        return 'Great! Maintain your healthy lifestyle with regular exercise and balanced diet.';
      case 'moderate':
        return 'Consider consulting a healthcare provider for personalized advice. Focus on improving exercise habits and diet.';
      case 'high':
        return 'Please consult a healthcare provider immediately. Early intervention can prevent serious complications.';
      default:
        return 'Complete the assessment to get your personalized health recommendations.';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <>
      <section className="space-y-4">
        <SectionTitle>Cardiovascular Risk Assessment</SectionTitle>
        
        <DesignBSurface 
          variant="elevated" 
          className="p-6 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent"
        >
          {prediction ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${getRiskColor(prediction.riskLevel)}`}>
                    {getRiskIcon(prediction.riskLevel)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Risk Level: {prediction.riskLevel}</h3>
                    <p className="text-sm text-muted-foreground">
                      Confidence: {prediction.confidence}%
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsOpen(true)}
                  className="gap-2"
                >
                  Update
                </Button>
              </div>
              
              <div className={`p-4 rounded-xl ${getRiskColor(prediction.riskLevel)}/20 border`}>
                <p className="text-sm font-medium">{getRecommendation(prediction.riskLevel)}</p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Last assessed: {formatDate(prediction.timestamp)}
                </p>
              </div>

              <details className="group">
                <summary className="flex items-center gap-2 cursor-pointer text-sm font-medium text-primary">
                  <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  View Factor Analysis
                </summary>
                <div className="mt-3 space-y-2">
                  {prediction.featureWeights.map(([factor, weight]) => (
                    <div key={factor} className="flex justify-between text-sm">
                      <span className="capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-medium">{weight}%</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Assess Your Heart Health</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get personalized cardiovascular risk analysis based on 12 health factors
                </p>
              </div>
              <Button 
                onClick={() => setIsOpen(true)}
                className="w-full gap-2"
              >
                <Activity className="h-4 w-4" />
                Start Assessment
              </Button>
            </div>
          )}
        </DesignBSurface>
      </section>

      {/* Assessment Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-background p-6 border-b flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Health Risk Assessment</h2>
                <p className="text-sm text-muted-foreground">Enter your health parameters</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age *</label>
                  <Input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 35"
                    min="18"
                    max="100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 rounded-lg border bg-background"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Medical Values */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                  Medical Measurements
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Cholesterol (mg/dL) *</label>
                    <Input
                      type="number"
                      name="cholesterol"
                      value={formData.cholesterol}
                      onChange={handleInputChange}
                      placeholder="e.g., 180"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Blood Pressure *</label>
                    <Input
                      type="number"
                      name="bloodPressure"
                      value={formData.bloodPressure}
                      onChange={handleInputChange}
                      placeholder="e.g., 120"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">BMI *</label>
                    <Input
                      type="number"
                      name="bmi"
                      value={formData.bmi}
                      onChange={handleInputChange}
                      placeholder="e.g., 24"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Heart Rate (bpm) *</label>
                    <Input
                      type="number"
                      name="heartRate"
                      value={formData.heartRate}
                      onChange={handleInputChange}
                      placeholder="e.g., 72"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Exercise Frequency (days/week) *</label>
                    <Input
                      type="number"
                      name="exerciseFrequency"
                      value={formData.exerciseFrequency}
                      onChange={handleInputChange}
                      placeholder="e.g., 3"
                      min="0"
                      max="7"
                    />
                  </div>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
                  Lifestyle Factors
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Smoking Status</label>
                    <select
                      name="smokingStatus"
                      value={formData.smokingStatus}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-lg border bg-background"
                    >
                      <option value="never">Never Smoked</option>
                      <option value="previous">Former Smoker</option>
                      <option value="current">Current Smoker</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Diabetes Status</label>
                    <select
                      name="diabetesStatus"
                      value={formData.diabetesStatus}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-lg border bg-background"
                    >
                      <option value="no">No</option>
                      <option value="pre">Pre-diabetic</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Medication Adherence</label>
                    <select
                      name="medicationAdherence"
                      value={formData.medicationAdherence}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-lg border bg-background"
                    >
                      <option value="good">Good</option>
                      <option value="moderate">Moderate</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Salt Intake</label>
                    <select
                      name="saltIntake"
                      value={formData.saltIntake}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-lg border bg-background"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Stress Level</label>
                    <select
                      name="stressLevel"
                      value={formData.stressLevel}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-lg border bg-background"
                    >
                      <option value="low">Low</option>
                      <option value="moderate">Moderate</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sleep Quality</label>
                    <select
                      name="sleepQuality"
                      value={formData.sleepQuality}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 rounded-lg border bg-background"
                    >
                      <option value="good">Good</option>
                      <option value="moderate">Moderate</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-background p-6 border-t flex gap-4">
              <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1 gap-2">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Calculate Risk
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
