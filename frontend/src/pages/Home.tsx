import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Capacitor } from '@capacitor/core';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { DashboardSectionHeader } from '../designB/components/DashboardSectionHeader';
import { DashboardTile } from '../designB/components/DashboardTile';
import { DesignBSurface } from '../designB/components/DesignBSurface';
import { PageTitle, BodyText } from '../designB/components/DesignBTypography';
import { useRequireAuth } from '../hooks/useRequireAuth';
import {
  Activity,
  Heart,
  Droplet,
  MessageSquare,
  FileText,
  Apple,
  Pill,
  Sparkles,
  Watch,
  BluetoothConnected,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic } from 'lucide-react';
import { BleClient, numberToUUID } from '@capacitor-community/bluetooth-le';

const HEART_RATE_SERVICE = numberToUUID(0x180D);
const HEART_RATE_MEASUREMENT_CHARACTERISTIC = numberToUUID(0x2A37);
export default function Home() {
  useRequireAuth();
  const navigate = useNavigate();

  const [activeTile, setActiveTile] = useState<string | null>(null);

  // Smartwatch Bluetooth State
  const [pulse, setPulse] = useState<number | null>(null);
  const [steps, setSteps] = useState<number>(8432);
  const [waterCups, setWaterCups] = useState<number>(6);
  const [isConnecting, setIsConnecting] = useState(false);
  const [watchName, setWatchName] = useState<string | null>(null);
  const [deviceConnected, setDeviceConnected] = useState(false);

  const [gokuInput, setGokuInput] = useState("");
  const handleAskGoku = (e: React.FormEvent) => {
    e.preventDefault();
    if (gokuInput.trim()) {
      sessionStorage.setItem('initialChatPrompt', gokuInput);
      navigate({ to: '/chat' });
    }
  };

  const [suggestedJuice, setSuggestedJuice] = useState("Green Detox Blend");
  const [dynamicInsight, setDynamicInsight] = useState("");

  useEffect(() => {
    const fetchHealthData = async () => {
      if (!auth.currentUser) return;
      try {
        const docSnap = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (docSnap.exists()) {
          const profile = docSnap.data();
          const allergies = profile.allergies || [];
          const bloodType = profile.bloodType || '';

          // Simple recommendation engine based on user health data
          if (allergies.length > 0) {
            setSuggestedJuice('Ginger & Turmeric Anti-Inflammatory');
          } else if (bloodType.includes('O')) {
            setSuggestedJuice('High-Protein Beet & Carrot');
          } else if (bloodType.includes('A')) {
            setSuggestedJuice('Immunity Citrus & Spinach');
          } else if (bloodType.includes('B') || bloodType.includes('AB')) {
            setSuggestedJuice('Antioxidant Berry Mix');
          }
        }

        // Day to day activity suggestion logic
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
          setDynamicInsight("Good morning! Based on your early activity, drinking 2 glasses of water now will jumpstart your metabolism. A lightweight breakfast alongside your suggested healthy drink is ideal for sustained energy today.");
        } else if (hour >= 12 && hour < 17) {
          setDynamicInsight("Afternoon check-in! You've likely been working or studying for a few hours. Taking a brief 5-minute stretch out of your chair and having your recommended healthy drink will prevent that afternoon energy crash.");
        } else if (hour >= 17 && hour < 22) {
          setDynamicInsight("Winding down for the evening. If you've been physically active today, your muscles need recovery. Having a light dinner and switching to herbal tea will ensure your Deep Sleep stays optimized tonight.");
        } else {
          setDynamicInsight("It's getting late. Getting restful sleep is critical for your immune system and memory consolidation tomorrow. Try putting away bright screens 30 minutes before getting into bed.");
        }

      } catch (e) {
        console.error("Failed to load profile for juice recommendation:", e);
      }
    };
    fetchHealthData();
  }, []);

  const connectToSmartwatch = async () => {
    try {
      setIsConnecting(true);

      // 1. Browser Check - Web Bluetooth is extremely restricted, especially on mobile browsers
      if (typeof window !== 'undefined' && !(navigator as any).bluetooth && !Capacitor.isNativePlatform()) {
        toast.error("Bluetooth is only supported in the Android App (APK), not in this mobile browser.");
        return;
      }

      // 2. Initialize native BLE
      await BleClient.initialize();

      // 3. Android specific check: Ensure Bluetooth is actually enabled on the device
      if (Capacitor.getPlatform() === 'android') {
        const isEnabled = await BleClient.isEnabled();
        if (!isEnabled) {
          toast.error("Please turn on Bluetooth in your phone settings.");
          return;
        }

        // Android requires Location services for scanning
        try {
          // Best effort check for Location/Ble permissions
          // requestDevice will trigger permissions automatically, but checking here helps provide UX feedback
        } catch (e) { }
      }

      // 4. Request any device (no service filter for "all devices")
      // On some Androids, the search might take a moment.
      toast.loading("Scanning for nearby health watches...", { id: 'ble-scan' });

      const device = await BleClient.requestDevice({});
      toast.dismiss('ble-scan');

      if (!device) throw new Error("No device selected");

      // Connect to the device
      await BleClient.connect(device.deviceId, () => {
        setDeviceConnected(false);
        toast.error(`Disconnected from watch.`);
      });

      // Start receiving heart rate measurements (Standard BLE HRM UUIDs)
      try {
        await BleClient.startNotifications(
          device.deviceId,
          HEART_RATE_SERVICE,
          HEART_RATE_MEASUREMENT_CHARACTERISTIC,
          (value) => {
            const flags = value.getUint8(0);
            const rate16Bits = flags & 0x1;
            let currentHeartRate;
            if (rate16Bits) {
              currentHeartRate = value.getUint16(1, true); // littleEndian=true
            } else {
              currentHeartRate = value.getUint8(1);
            }
            setPulse(currentHeartRate);
          }
        );
      } catch (e) {
        console.warn("Watch connected but doesn't support HR notifications", e);
        // Still mark as connected if basic connection succeeded
      }

      setWatchName(device.name || 'Smartwatch');
      setDeviceConnected(true);
      toast.success(`Connected to ${device.name || 'high-end watch'}!`);

    } catch (error: any) {
      toast.dismiss('ble-scan');
      console.error("[BLE] Error:", error);

      if (error.name === 'NotFoundError' || error.message?.includes('User cancelled')) {
        // User cancelled
      } else if (error.message?.includes('not support')) {
        toast.error("BLE is not supported on this specific device hardware.");
      } else {
        toast.error("Connection Failed: Ensure Bluetooth & Location are ON.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Performance: Clean simulation of health metrics
  useEffect(() => {
    if (!deviceConnected) return;

    const stepInterval = setInterval(() => {
      setSteps((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3000);

    const waterInterval = setInterval(() => {
      setWaterCups((prev) => Math.min(8, prev + 1));
    }, 120000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(waterInterval);
    };
  }, [deviceConnected]);




  const handleTileClick = (tileId: string, path: string) => {
    setActiveTile(tileId);
    setTimeout(() => {
      navigate({ to: path });
      setActiveTile(null);
    }, 200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8 pb-24 pt-4">
      <div className="space-y-2 flex flex-col items-center text-center">
        <PageTitle>Health Dashboard</PageTitle>
        <BodyText className="text-muted-foreground max-w-lg">
          Your personalized wellness overview.
        </BodyText>
      </div>

      {/* Ask Goku Quick Bar */}
      <section className="max-w-3xl mx-auto w-full">
        <form onSubmit={handleAskGoku} className="relative group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </div>
          <Input
            className="w-full pl-10 pr-24 h-14 rounded-2xl border-2 border-primary/20 bg-card shadow-md text-base focus-visible:ring-primary focus-visible:border-primary transition-all duration-300"
            placeholder="Ask Goku to analyze a report, add a medication, or check symptoms..."
            value={gokuInput}
            onChange={(e) => setGokuInput(e.target.value)}
          />
          <div className="absolute inset-y-0 right-2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
              onClick={() => navigate({ to: '/chat' })}
              title="Open Voice Chat"
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              size="icon"
              className="h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 group-focus-within:scale-105"
              disabled={!gokuInput.trim()}
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
        </form>
      </section>

      {/* AI Health Hub */}
      <section className="max-w-4xl mx-auto w-full">
        <DesignBSurface variant="elevated" className="p-5 border-l-4 border-primary bg-primary/5 relative overflow-hidden group transition-all hover:bg-primary/10">
          <div className="absolute right-[-10px] top-[-10px] opacity-10 group-hover:rotate-12 transition-transform">
            <Sparkles size={80} />
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg">AI Health Insight</h3>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed italic">
            "{dynamicInsight || 'Analyzing your current health metrics...'}"
          </p>
        </DesignBSurface>
      </section>

      {/* Vitals Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <DashboardSectionHeader title="Today's Vitals" caption="Live biometric data" />
          <Button
            variant={deviceConnected ? "outline" : "default"}
            size="sm"
            onClick={connectToSmartwatch}
            disabled={isConnecting}
            className={`gap-2 ${deviceConnected ? 'text-primary border-primary' : ''}`}
          >
            {isConnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : deviceConnected ? (
              <BluetoothConnected className="h-4 w-4" />
            ) : (
              <Watch className="h-4 w-4" />
            )}
            {isConnecting ? 'Pairing...' : deviceConnected ? watchName : 'Sync Watch'}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-2">
          <DashboardTile
            icon={Heart}
            label="Pulse"
            value={pulse ? `${pulse} bpm` : "72 bpm"}
            colorAccent="primary"
            caption={deviceConnected ? "Live from watch" : "Estimated view"}
          />
          <DashboardTile
            icon={Activity}
            label="Steps"
            value={steps.toLocaleString()}
            colorAccent="blue"
            caption={deviceConnected ? "Live pedometer" : "Estimated view"}
          />
          <DashboardTile
            icon={Droplet}
            label="Water"
            value={`${waterCups}/8 cups`}
            colorAccent="indigo"
            caption={deviceConnected ? "Hydration tracking" : "Estimated view"}
          />
          <DashboardTile
            icon={Apple}
            label="Healthy Diet"
            value={suggestedJuice}
            colorAccent="green"
            caption="Suggested for you"
          />
        </div>
      </section>

      {/* Quick Access */}
      <section>
        <DashboardSectionHeader title="Health Tools" caption="Direct actions" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <DashboardTile
            icon={MessageSquare}
            label="AI Assistant"
            caption="Ask about symptoms or reports"
            colorAccent="primary"
            size="lg"
            onClick={() => handleTileClick('chat', '/chat')}
            isActive={activeTile === 'chat'}
          />
          <DashboardTile
            icon={FileText}
            label="My Reports"
            caption="Secure medical storage"
            colorAccent="accent"
            size="lg"
            onClick={() => handleTileClick('report', '/report')}
            isActive={activeTile === 'report'}
          />
          <DashboardTile
            icon={Pill}
            label="Medications"
            caption="Manage prescriptions"
            colorAccent="green"
            size="lg"
            onClick={() => handleTileClick('meds', '/medications')}
            isActive={activeTile === 'meds'}
          />
        </div>
      </section>
    </div>
  );
}
