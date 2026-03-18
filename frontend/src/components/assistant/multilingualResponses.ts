// Multilingual response templates for the Goku AI Assistant

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ar' | 'hi' | 'pt';

export interface LanguageTemplates {
  greeting: string;
  helpText: string;
  emergencyPrefix: string;
  notUnderstood: string;
  processingError: string;
  reportAnalysisPrompt: string;
}

export const languageTemplates: Record<SupportedLanguage, LanguageTemplates> = {
  en: {
    greeting: "Hello! I'm your Goku AI Assistant. I can help with medical questions, health advice, general knowledge (science, history, technology, and more), and understanding your medical reports. How can I help you today?",
    helpText: "I can assist you with:\n• Health & medical questions (symptoms, conditions, medications)\n• General knowledge (science, history, geography, technology)\n• Medical report analysis\n• Navigation to different sections of the app\n\nJust ask me anything!",
    emergencyPrefix: "🚨 EMERGENCY:",
    notUnderstood: "I'm not sure I understood that. Could you rephrase? I can help with health topics, general knowledge questions, or navigating the app.",
    processingError: "I encountered an error processing your request. Please try again.",
    reportAnalysisPrompt: "Please upload your medical report or paste the text for analysis.",
  },
  es: {
    greeting: "¡Hola! Soy tu Asistente de Salud e IA General. Puedo ayudarte con preguntas médicas, consejos de salud, conocimiento general (ciencia, historia, tecnología y más) y entender tus informes médicos. ¿Cómo puedo ayudarte hoy?",
    helpText: "Puedo ayudarte con:\n• Preguntas de salud y médicas\n• Conocimiento general (ciencia, historia, geografía, tecnología)\n• Análisis de informes médicos\n• Navegación por la aplicación",
    emergencyPrefix: "🚨 EMERGENCIA:",
    notUnderstood: "No estoy seguro de haber entendido eso. ¿Podrías reformularlo? Puedo ayudar con temas de salud, preguntas de conocimiento general o navegar por la aplicación.",
    processingError: "Encontré un error al procesar tu solicitud. Por favor, inténtalo de nuevo.",
    reportAnalysisPrompt: "Por favor, sube tu informe médico o pega el texto para analizarlo.",
  },
  fr: {
    greeting: "Bonjour! Je suis votre Assistant Santé et IA Générale. Je peux vous aider avec des questions médicales, des conseils de santé, des connaissances générales (science, histoire, technologie et plus) et comprendre vos rapports médicaux. Comment puis-je vous aider aujourd'hui?",
    helpText: "Je peux vous aider avec:\n• Questions de santé et médicales\n• Connaissances générales (science, histoire, géographie, technologie)\n• Analyse de rapports médicaux\n• Navigation dans l'application",
    emergencyPrefix: "🚨 URGENCE:",
    notUnderstood: "Je ne suis pas sûr d'avoir compris. Pourriez-vous reformuler? Je peux aider avec des sujets de santé, des questions de connaissances générales ou naviguer dans l'application.",
    processingError: "J'ai rencontré une erreur lors du traitement de votre demande. Veuillez réessayer.",
    reportAnalysisPrompt: "Veuillez télécharger votre rapport médical ou coller le texte pour analyse.",
  },
  de: {
    greeting: "Hallo! Ich bin Ihr Gesundheits- und Allgemein-KI-Assistent. Ich kann Ihnen bei medizinischen Fragen, Gesundheitsratschlägen, allgemeinem Wissen (Wissenschaft, Geschichte, Technologie und mehr) und dem Verständnis Ihrer medizinischen Berichte helfen. Wie kann ich Ihnen heute helfen?",
    helpText: "Ich kann Ihnen helfen mit:\n• Gesundheits- und medizinischen Fragen\n• Allgemeinwissen (Wissenschaft, Geschichte, Geographie, Technologie)\n• Analyse medizinischer Berichte\n• Navigation in der App",
    emergencyPrefix: "🚨 NOTFALL:",
    notUnderstood: "Ich bin nicht sicher, ob ich das verstanden habe. Könnten Sie es umformulieren? Ich kann bei Gesundheitsthemen, allgemeinen Wissensfragen oder der App-Navigation helfen.",
    processingError: "Bei der Verarbeitung Ihrer Anfrage ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.",
    reportAnalysisPrompt: "Bitte laden Sie Ihren medizinischen Bericht hoch oder fügen Sie den Text zur Analyse ein.",
  },
  zh: {
    greeting: "你好！我是您的健康与通用AI助手。我可以帮助您解答医疗问题、提供健康建议、回答常识问题（科学、历史、技术等），以及帮助您理解医疗报告。今天我能为您做什么？",
    helpText: "我可以帮助您：\n• 健康和医疗问题\n• 常识（科学、历史、地理、技术）\n• 医疗报告分析\n• 应用程序导航",
    emergencyPrefix: "🚨 紧急情况：",
    notUnderstood: "我不确定我是否理解了。您能重新表述一下吗？我可以帮助解答健康话题、常识问题或应用程序导航。",
    processingError: "处理您的请求时遇到错误。请重试。",
    reportAnalysisPrompt: "请上传您的医疗报告或粘贴文本进行分析。",
  },
  ar: {
    greeting: "مرحباً! أنا مساعدك الذكي للصحة والمعرفة العامة. يمكنني مساعدتك في الأسئلة الطبية، ونصائح الصحة، والمعرفة العامة (العلوم، التاريخ، التكنولوجيا والمزيد)، وفهم تقاريرك الطبية. كيف يمكنني مساعدتك اليوم؟",
    helpText: "يمكنني مساعدتك في:\n• أسئلة الصحة والطب\n• المعرفة العامة (العلوم، التاريخ، الجغرافيا، التكنولوجيا)\n• تحليل التقارير الطبية\n• التنقل في التطبيق",
    emergencyPrefix: "🚨 طوارئ:",
    notUnderstood: "لست متأكداً من أنني فهمت ذلك. هل يمكنك إعادة الصياغة؟ يمكنني المساعدة في موضوعات الصحة أو أسئلة المعرفة العامة أو التنقل في التطبيق.",
    processingError: "واجهت خطأ في معالجة طلبك. يرجى المحاولة مرة أخرى.",
    reportAnalysisPrompt: "يرجى تحميل تقريرك الطبي أو لصق النص للتحليل.",
  },
  hi: {
    greeting: "नमस्ते! मैं आपका स्वास्थ्य और सामान्य AI सहायक हूं। मैं चिकित्सा प्रश्नों, स्वास्थ्य सलाह, सामान्य ज्ञान (विज्ञान, इतिहास, प्रौद्योगिकी और अधिक), और आपकी चिकित्सा रिपोर्ट समझने में मदद कर सकता हूं। आज मैं आपकी कैसे मदद कर सकता हूं?",
    helpText: "मैं आपकी मदद कर सकता हूं:\n• स्वास्थ्य और चिकित्सा प्रश्न\n• सामान्य ज्ञान (विज्ञान, इतिहास, भूगोल, प्रौद्योगिकी)\n• चिकित्सा रिपोर्ट विश्लेषण\n• ऐप नेविगेशन",
    emergencyPrefix: "🚨 आपातकाल:",
    notUnderstood: "मुझे यकीन नहीं है कि मैंने समझा। क्या आप दोबारा कह सकते हैं? मैं स्वास्थ्य विषयों, सामान्य ज्ञान प्रश्नों या ऐप नेविगेशन में मदद कर सकता हूं।",
    processingError: "आपके अनुरोध को संसाधित करने में त्रुटि हुई। कृपया पुनः प्रयास करें।",
    reportAnalysisPrompt: "कृपया विश्लेषण के लिए अपनी चिकित्सा रिपोर्ट अपलोड करें या टेक्स्ट पेस्ट करें।",
  },
  pt: {
    greeting: "Olá! Sou seu Assistente de Saúde e IA Geral. Posso ajudá-lo com perguntas médicas, conselhos de saúde, conhecimento geral (ciência, história, tecnologia e mais) e entender seus relatórios médicos. Como posso ajudá-lo hoje?",
    helpText: "Posso ajudá-lo com:\n• Perguntas de saúde e médicas\n• Conhecimento geral (ciência, história, geografia, tecnologia)\n• Análise de relatórios médicos\n• Navegação no aplicativo",
    emergencyPrefix: "🚨 EMERGÊNCIA:",
    notUnderstood: "Não tenho certeza se entendi. Poderia reformular? Posso ajudar com tópicos de saúde, perguntas de conhecimento geral ou navegação no aplicativo.",
    processingError: "Encontrei um erro ao processar sua solicitação. Por favor, tente novamente.",
    reportAnalysisPrompt: "Por favor, carregue seu relatório médico ou cole o texto para análise.",
  },
};

export function detectLanguage(text: string): SupportedLanguage {
  // Simple heuristic language detection based on common words
  const lowerText = text.toLowerCase();

  if (/\b(hola|gracias|cómo|qué|por favor|salud)\b/.test(lowerText)) return 'es';
  if (/\b(bonjour|merci|comment|santé|s'il vous plaît)\b/.test(lowerText)) return 'fr';
  if (/\b(hallo|danke|wie|gesundheit|bitte)\b/.test(lowerText)) return 'de';
  if (/[\u4e00-\u9fff]/.test(text)) return 'zh';
  if (/[\u0600-\u06ff]/.test(text)) return 'ar';
  if (/[\u0900-\u097f]/.test(text)) return 'hi';
  if (/\b(olá|obrigado|como|saúde|por favor)\b/.test(lowerText)) return 'pt';

  return 'en';
}

export function getGreeting(language: SupportedLanguage = 'en'): string {
  return languageTemplates[language]?.greeting ?? languageTemplates.en.greeting;
}

export function getHelpText(language: SupportedLanguage = 'en'): string {
  return languageTemplates[language]?.helpText ?? languageTemplates.en.helpText;
}

export function getNotUnderstoodResponse(language: SupportedLanguage = 'en'): string {
  return languageTemplates[language]?.notUnderstood ?? languageTemplates.en.notUnderstood;
}
