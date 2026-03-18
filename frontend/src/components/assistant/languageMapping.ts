export const INDIAN_LANGUAGES = [
    { name: 'English', code: 'en-US' },
    { name: 'Hindi', code: 'hi-IN' },
    { name: 'Bengali', code: 'bn-IN' },
    { name: 'Telugu', code: 'te-IN' },
    { name: 'Marathi', code: 'mr-IN' },
    { name: 'Tamil', code: 'ta-IN' },
    { name: 'Urdu', code: 'ur-IN' },
    { name: 'Gujarati', code: 'gu-IN' },
    { name: 'Malayalam', code: 'ml-IN' },
    { name: 'Kannada', code: 'kn-IN' },
    { name: 'Odia', code: 'or-IN' },
    { name: 'Punjabi', code: 'pa-IN' },
    { name: 'Assamese', code: 'as-IN' },
    { name: 'Maithili', code: 'mai-IN' },
    { name: 'Sanskrit', code: 'sa-IN' },
    { name: 'Konkani', code: 'kok-IN' },
    { name: 'Manipuri', code: 'mni-IN' },
    { name: 'Nepali', code: 'ne-NP' },
    { name: 'Sindhi', code: 'sd-IN' },
    { name: 'Dogri', code: 'doi-IN' },
    { name: 'Kashmiri', code: 'ks-IN' },
    { name: 'Bodo', code: 'brx-IN' },
    { name: 'Santali', code: 'sat-IN' }
];

export function getLanguageName(code: string): string {
    return INDIAN_LANGUAGES.find(l => l.code === code)?.name || 'English';
}
