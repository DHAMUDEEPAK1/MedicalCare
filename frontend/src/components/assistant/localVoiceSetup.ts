import { Filesystem, Directory } from '@capacitor/filesystem';
import { toast } from 'sonner';

/**
 * Local Voice Setup - Stores user preference for voice characteristics
 */
export async function setupLocalVoicePreferences(pitch: number = 0.5, rate: number = 1.0) {
    try {
        const voicePrefs = {
            pitch: pitch,
            rate: rate,
            timestamp: Date.now()
        };

        await Filesystem.writeFile({
            path: 'goku_voice_prefs.json',
            data: JSON.stringify(voicePrefs),
            directory: Directory.Data,
        });

        toast.success('Voice preferences saved!');
        return true;
    } catch (error) {
        console.error('[Goku Voice] Preferences setup failed:', error);
        toast.error('Could not save voice preferences.');
        return false;
    }
}

// Load voice preferences
export async function loadVoicePreferences() {
    try {
        const result = await Filesystem.readFile({
            path: 'goku_voice_prefs.json',
            directory: Directory.Data,
        });

        if (result.data) {
            return JSON.parse(result.data as string);
        }
    } catch (e) {
        // Return default preferences
        return { pitch: 0.5, rate: 1.0 };
    }
    return { pitch: 0.5, rate: 1.0 };
}
