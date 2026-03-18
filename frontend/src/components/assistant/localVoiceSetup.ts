import { Filesystem, Directory } from '@capacitor/filesystem';
import { toast } from 'sonner';

/**
 * Local Voice Setup Script (Offline Neural Identity)
 * Replaces add_voice.py (ElevenLabs) with a completely local file-based solution
 */
export async function setupLocalVoice(audioFile: File) {
    try {
        console.log('[Goku Voice] Starting local voice setup for:', audioFile.name);

        // 1. Read the audio file bits
        const arrayBuffer = await audioFile.arrayBuffer();
        const base64 = bufToBase64(arrayBuffer);

        // 2. Save it to the native filesystem on the device (completely offline)
        await Filesystem.writeFile({
            path: 'goku_custom_voice.wav',
            data: base64,
            directory: Directory.Data,
        });

        toast.success(`Voice set successfully! Goku will now use your recorded voice profile.`);
        return true;
    } catch (error) {
        console.error('[Goku Voice] Setup failed:', error);
        toast.error('Could not save custom voice locally.');
        return false;
    }
}

function bufToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
