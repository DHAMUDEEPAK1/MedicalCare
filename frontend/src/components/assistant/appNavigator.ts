export class AppNavigator {
    NAVIGATION_COMMANDS: Record<string, { route: string, regex: RegExp }> = {
        "dashboard": { route: "/home", regex: /\b(go to|open|show|navigate to|take me to)\s+(dashboard|home)\b/i },
        "medications": { route: "/medications", regex: /\b(go to|open|show|navigate to|take me to)\s+(medications|meds|pills)\b/i },
        "profile": { route: "/profile", regex: /\b(go to|open|show|navigate to|take me to)\s+profile\b/i },
        "appointments": { route: "/appointments", regex: /\b(go to|open|show|navigate to|take me to)\s+appointments\b/i },
        "reports": { route: "/report", regex: /\b(go to|open|show|navigate to|take me to)\s+(reports|files)\b/i },
        "settings": { route: "/settings", regex: /\b(go to|open|show|navigate to|take me to)\s+settings\b/i },
        "symptoms": { route: "/symptoms", regex: /\b(go to|open|navigate to|take me to)\s+symptoms\b/i },
        "conditions": { route: "/conditions", regex: /\b(go to|open|navigate to|take me to)\s+conditions\b/i },
        "emergency": { route: "/emergency", regex: /\b(go to|open|navigate to|take me to)\s+emergency\b/i }
    };

    processCommand(command: string): any {
        for (const [key, dest] of Object.entries(this.NAVIGATION_COMMANDS)) {
            if (dest.regex.test(command)) {
                return {
                    action: "NAVIGATE",
                    route: dest.route,
                    message: `Navigating to ${key.charAt(0).toUpperCase() + key.slice(1)}`
                };
            }
        }
        return { action: "NONE", message: "Command not recognized" };
    }
}
