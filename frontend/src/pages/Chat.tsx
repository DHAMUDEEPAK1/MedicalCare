import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { AssistantPanel } from '../components/assistant/AssistantPanel';
import { ReportAnalysisContext, ConfidenceLevel } from '../components/assistant/assistantTypes';
import { useAssistantTranscript } from '../components/assistant/useAssistantTranscript';
import { useAssistantAI } from '../components/assistant/useAssistantAI';
import { getErrorFallbackResponse } from '../components/assistant/medicalKnowledgeBase';
import { useMedicalFiles, MedicalFileMetadata } from '../hooks/useMedicalFiles';
import { extractTextFromBytes, extractTextFromPDF } from '../components/assistant/reportTextExtraction';
import { CloseButton } from '../components/CloseButton';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { analyzeFile as analyzeMedicalFile } from '../components/assistant/assistantBrain';

export default function Chat() {
  // Protect this route - redirect to signin if not authenticated
  useRequireAuth();

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [inputValue, setInputValue] = useState('');
  const { transcript, addMessage, clearTranscript } = useAssistantTranscript();
  const { files, downloadFile } = useMedicalFiles();
  const [reportContext, setReportContext] = useState<ReportAnalysisContext>({ state: 'idle' });
  const ai = useAssistantAI();

  const handleCommand = useCallback(async (userInput: string, confidence?: ConfidenceLevel) => {
    if (!userInput.trim()) return;

    setErrorMessage(undefined);

    try {
      // Check if we're in a report analysis flow
      if (reportContext.state === 'awaiting-selection') {
        addMessage('user', userInput, confidence);
        setInputValue('');

        const selection = userInput.trim();
        const selectedIndex = parseInt(selection) - 1;

        let selectedFile: MedicalFileMetadata | undefined = undefined;
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < files.length) {
          selectedFile = files[selectedIndex];
        } else {
          selectedFile = files.find(f => f.filename.toLowerCase().includes(selection.toLowerCase()));
        }

        if (!selectedFile) {
          addMessage('assistant', `I couldn't find that report. Please enter the number (1-${files.length}) or part of the filename.`);
          return;
        }

        addMessage('assistant', `Reading "${selectedFile.filename}"...`);

        try {
          const bytes = await downloadFile(selectedFile.id, selectedFile.filename, true);
          if (!bytes) {
            addMessage('assistant', `I couldn't access that file.`);
            setReportContext({ state: 'idle' });
            return;
          }

          const isVisualFile = selectedFile.contentType?.includes('image') || selectedFile.contentType?.includes('pdf') || selectedFile.filename.toLowerCase().endsWith('.pdf');

          if (isVisualFile && (selectedFile.contentType?.includes('pdf') || selectedFile.filename.toLowerCase().endsWith('.pdf'))) {
            addMessage('assistant', `Reading "${selectedFile.filename}" offline using Local Saiyan Brain... 🛡️`);
            try {
              // Convert to File object if needed or just pass selectedFile if it matches expected type
              const text = await extractTextFromPDF(selectedFile as any);
              if (text && text.trim()) {
                const analysisResult = analyzeMedicalFile(selectedFile.filename, text);
                addMessage('assistant', analysisResult.message, analysisResult.type as any);
                setReportContext({ state: 'idle' });
                return;
              }
            } catch (err) {
              console.error('Offline PDF extraction failed:', err);
            }
          } else if (isVisualFile) {
            addMessage('assistant', `I'm operating in **Full Offline Fortress Mode** for maximum privacy. 🛡️\n\nI can scan PDFs locally, but for clinical images, please **paste the text** from the report directly into the chat and I will perform a master-warrior diagnostic scan!`);
            setReportContext({ state: 'awaiting-paste', selectedReportId: selectedFile.id, selectedReportFilename: selectedFile.filename });
            return;
          }

          const extractionResult = await extractTextFromBytes(bytes as Uint8Array);

          if (extractionResult.success && extractionResult.text) {
            setReportContext({ state: 'analyzing' });
            const analysisResult = analyzeMedicalFile(selectedFile.filename, extractionResult.text);
            addMessage('assistant', analysisResult.message, analysisResult.type as any);
            setReportContext({ state: 'idle' });
          } else {
            addMessage('assistant', `I couldn't read the text. Please paste it manually.`);
            setReportContext({ state: 'awaiting-paste', selectedReportId: selectedFile.id, selectedReportFilename: selectedFile.filename });
          }
        } catch (error) {
          addMessage('assistant', `Error reading file.`);
          setReportContext({ state: 'idle' });
        }
        return;
      }

      if (reportContext.state === 'awaiting-paste') {
        addMessage('user', userInput, confidence);
        setInputValue('');
        const pastedText = userInput.trim();

        if (pastedText.length < 20) {
          addMessage('assistant', 'That seems too short. Please paste the full text.');
          return;
        }

        setReportContext({ state: 'analyzing' });
        const analysisResult = analyzeMedicalFile(reportContext.selectedReportFilename || 'Your Report', pastedText);
        addMessage('assistant', analysisResult.message, analysisResult.type as any);
        setReportContext({ state: 'idle' });
        return;
      }

      // Delegate to Multilingual AI Brain
      const result = await ai.processCommand(userInput, transcript, (role, content) => {
        addMessage(role, content);
      });

      // Handle specific result types (navigation, etc) from the brain
      if (result?.type === 'navigation' && result.navigationTarget) {
        setTimeout(() => {
          navigate({ to: result.navigationTarget! });
        }, 1500);
      } else if (result?.type === 'report-list') {
        const potentialFilename = result.targetFilename;
        const matchingFile = potentialFilename ? files.find(f => f.filename.toLowerCase().includes(potentialFilename.toLowerCase())) : null;

        if (potentialFilename && matchingFile) {
          // Direct filename analysis triggered from brain
          setReportContext({ state: 'awaiting-selection' });
          handleCommand(matchingFile.filename);
        } else if (files.length === 0) {
          addMessage('assistant', 'You don\'t have any medical reports uploaded right now.\n\nHowever, you can **paste your report text** directly! Just say `"paste report"` and I\'ll get ready to read it.');
        } else {
          const fileList = files.map((f, i) => `${i + 1}. ${f.filename}`).join('\n');
          addMessage('assistant', `Which report should I analyze?\n\n${fileList}`);
          setReportContext({ state: 'awaiting-selection' });
        }
      } else if (result?.type === 'report-paste-request') {
        setReportContext({ state: 'awaiting-paste' });
      }

      setInputValue('');

    } catch (error) {
      console.error('Error processing command:', error);
      addMessage('assistant', getErrorFallbackResponse());
      setReportContext({ state: 'idle' });
    }
  }, [addMessage, navigate, reportContext, files, downloadFile, transcript, ai]);

  useEffect(() => {
    const prompt = sessionStorage.getItem('initialChatPrompt');
    if (prompt) {
      sessionStorage.removeItem('initialChatPrompt');
      setTimeout(() => {
        handleCommand(prompt);
      }, 500);
    }
  }, [handleCommand]);

  const handleVoiceInput = useCallback((text: string, confidence?: ConfidenceLevel) => {
    handleCommand(text, confidence);
  }, [handleCommand]);

  const handleClearConversation = useCallback(() => {
    clearTranscript();
    setReportContext({ state: 'idle' });
    setErrorMessage(undefined);
  }, [clearTranscript]);

  return (
    <div className="h-screen w-screen flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-4 right-4 z-20">
        <CloseButton />
      </div>

      <div className="flex-1 w-full h-full min-h-0 text-foreground flex items-center justify-center">
        <div className="w-full h-full bg-card overflow-hidden md:max-w-6xl md:h-[95vh] md:border md:border-border md:shadow-2xl md:rounded-2xl">
          <AssistantPanel
            transcript={transcript}
            status={ai.status as any}
            errorMessage={errorMessage}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onVoiceInput={handleVoiceInput}
            onClearConversation={handleClearConversation}
            onFileUpload={(file) => ai.processUploadedFile(file, addMessage)}
            autoStartVoice={true}
          />
        </div>
      </div>
    </div>
  );
}

