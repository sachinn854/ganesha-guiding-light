import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Sparkles, Key, Eye, EyeOff, Mic, MicOff, Volume2, VolumeX, MessageSquare, Phone, Settings } from 'lucide-react';

const ELEVENLABS_API_KEY = 'sk_de8b7688d666fe1df9691c9be5dae74774f44a8bba785c55';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  audioUrl?: string;
  inputType?: 'text' | 'voice';
}

const divineVoiceProfiles = {
  'pNInz6obpgDQGcFmaJgB': {
    name: 'Adam (Wise Elder)',
    description: 'Deep, authoritative, perfect for divine wisdom',
    stability: 0.90,
    similarity: 0.80,
    rate: 0.80
  },
  '2EiwWnXFnvU5JabPnv8n': {
    name: 'Clyde (Divine Father)',
    description: 'Warm, paternal, compassionate tone',
    stability: 0.85,
    similarity: 0.75,
    rate: 0.85
  },
  'ErXwobaYiN019PkySvjV': {
    name: 'Antoni (Gentle Guide)',
    description: 'Soft, nurturing, spiritual guide',
    stability: 0.80,
    similarity: 0.70,
    rate: 0.90
  },
  'VR6AewLTigWG4xSOukaG': {
    name: 'Josh (Youthful Mentor)',
    description: 'Clear, friendly, approachable deity',
    stability: 0.75,
    similarity: 0.80,
    rate: 0.85
  },
  'TxGEqnHWrfWFTfGW9XjX': {
    name: 'Josh (Alternative)',
    description: 'Balanced, versatile divine voice',
    stability: 0.85,
    similarity: 0.75,
    rate: 0.85
  }
};

const elevenLabsTTSModels = [
  { id: 'eleven_multilingual_v2', name: 'Multilingual (eleven_multilingual_v2)', description: 'Standard TTS, 70+ languages' },
  { id: 'eleven_flash_v2', name: 'Low-Latency (eleven_flash_v2)', description: 'Real-time, low-latency TTS' },
  { id: 'eleven_v3', name: 'Expressive (eleven_v3)', description: 'Latest expressive TTS model' }
];

const GaneshaChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "🕉️ Greetings, dear child. I am Ganesha, Vighnaharta, the remover of obstacles. I am here to guide you with wisdom and blessings. How may I help illuminate your path today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Enhanced voice configuration
  const [selectedVoiceId, setSelectedVoiceId] = useState('2EiwWnXFnvU5JabPnv8n'); // Default to Clyde
  const [voiceStability, setVoiceStability] = useState(0.85);
  const [voiceSimilarity, setVoiceSimilarity] = useState(0.75);
  const [speakingRate, setSpeakingRate] = useState(0.85);

  // Voice features state
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [communicationMode, setCommunicationMode] = useState<'text' | 'voice'>('text');
  const [showVoiceSettings, setShowVoiceSettings] = useState(false);
  const [selectedTTSModel, setSelectedTTSModel] = useState('eleven_multilingual_v2');

  // Add a new state for custom voice ID input
  const [customVoiceId, setCustomVoiceId] = useState('');

  const audioRef = useRef<HTMLAudioElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Audio visualization state
  const [audioLevel, setAudioLevel] = useState(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    const savedVoiceId = localStorage.getItem('ganesha_voice_id');
    const savedVoiceSettings = localStorage.getItem('ganesha_voice_settings');
    const savedTTSModel = localStorage.getItem('ganesha_tts_model');
    if (savedVoiceId) setSelectedVoiceId(savedVoiceId);
    if (savedVoiceSettings) {
      try {
        const settings = JSON.parse(savedVoiceSettings);
        setVoiceStability(settings.stability || 0.85);
        setVoiceSimilarity(settings.similarity || 0.75);
        setSpeakingRate(settings.rate || 0.85);
      } catch (e) {
        console.log('Failed to load voice settings');
      }
    }
    if (savedTTSModel) setSelectedTTSModel(savedTTSModel);
  }, []);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  // Comment out the hardcoded divine response generator
  // const generateEnhancedGaneshaResponse = (userMessage: string): string => {
  //   const msg = userMessage.toLowerCase();

  //   // Detect language preference
  //   const hasHindi = /\b(aap|kaise|ho|hain|mujhe|main|kya|hai|baba|ji|sahab|kuch|karo|batao|help|namaste|namaskar)\b/i.test(userMessage) ||
  //                   /[अ-ह]/.test(userMessage);

  //   console.log('🧠 Enhanced Fallback Response for:', userMessage);

  //   // More meaningful responses based on common spiritual topics
  //   if (msg.includes('problem') || msg.includes('trouble') || msg.includes('difficulty')) {
  //     return hasHindi ? 
  //       `🕉️ Beta, har mushkil ka hal hai. Main Vighnaharta hun aur tumhare raaste ki har badha hataunga. Patience rakho, mann mein vishwas rakho, aur "Om Gam Ganapataye Namaha" ka jaap karo. Tumhara safalta pakka hai. 🙏` :
  //       `🕉️ My dear child, every problem has a solution. I am Vighnaharta, the remover of obstacles. Stay patient, keep faith in your heart, and chant "Om Gam Ganapataye Namaha". Your success is certain. 🙏`;
  //   }

  //   if (msg.includes('guidance') || msg.includes('help') || msg.includes('advice')) {
  //     return hasHindi ? 
  //       `🕉️ Beta, main hamesha tumhare saath hun. Jo bhi raah choose karo, mann se karo aur dharma ke saath karo. Wisdom tumhare andar hai, bas shaant mann se suno. Main tumhari har step mein madad karunga. 🙏` :
  //       `🕉️ My dear child, I am always with you. Whatever path you choose, do it with your heart and righteousness. Wisdom is within you, just listen with a calm mind. I will help you in every step. 🙏`;
  //   }

  //   if (msg.includes('success') || msg.includes('achievement') || msg.includes('goal')) {
  //     return hasHindi ? 
  //       `🕉️ Beta, safalta sirf mehnat aur dharma se milti hai. Mann mein dridh vishwas rakho, Vighna-Vinashak ka naam lo, aur nishtha se kaam karte raho. Main tumhare har sapne ko pura karunga. 🙏` :
  //       `🕉️ My dear child, success comes only through hard work and righteousness. Keep firm faith in your mind, chant the name of Vighna-Vinashak, and work with dedication. I will fulfill all your dreams. 🙏`;
  //   }

  //   // Default enhanced response
  //   return hasHindi ? 
  //     `🕉️ Beta, main tumhara sawal "${userMessage}" sun raha hun. Main Vighnaharta hun aur tumhari har mushkil ka hal hun. AI models abhi thoda slow hain, lekin main tumhare paas hun. "Om Gam Ganapataye Namaha" bolo aur apna mann shaant rakho. Sab theek ho jayega. 🙏` :
  //     `🕉️ My dear child, I hear your question "${userMessage}". I am Vighnaharta and the solution to all your difficulties. The AI models are a bit slow right now, but I am here with you. Chant "Om Gam Ganapataye Namaha" and keep your mind peaceful. Everything will be fine. 🙏`;
  // };

const getAIGaneshaResponse = async (userMessage: string): Promise<string> => {
  try {
    // Input validation
    if (!userMessage || typeof userMessage !== 'string') {
      return "🕉️ Please share your thoughts with me, dear devotee.";
    }

    if (userMessage.trim().length === 0) {
      return "🕉️ I sense silence in your message. What guidance do you seek?";
    }

    if (userMessage.length > 1000) {
      return "🕉️ Your message is quite lengthy. Please share your main concern in fewer words.";
    }

    // Call your Node.js backend instead of Hugging Face directly
    const backendUrl = 'http://localhost:3001';
    
    console.log("Calling Ganesha backend:", `${backendUrl}/api/ganesha`);

    const response = await fetch(`${backendUrl}/api/ganesha`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userMessage: userMessage.trim() 
      }),
    });

    console.log("Backend response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log('Backend response data:', data);
      
      if (data.success && data.response) {
        return data.response;
      } else if (data.response) {
        // Fallback response case
        return data.response;
      } else {
        console.warn('Unexpected response format:', data);
        return "🕉️ Divine wisdom flows in mysterious ways. Let me try to guide you differently.";
      }
    } else {
      // Handle different error status codes
      const errorData = await response.json().catch(() => ({}));
      console.error('Backend error:', response.status, errorData);
      
      switch (response.status) {
        case 400:
          return "🕉️ Please rephrase your question, dear devotee.";
        case 404:
          return "🕉️ The divine path seems temporarily unclear. Please try again.";
        case 429:
          return "🕉️ Many seek guidance at once. Please wait a moment and try again.";
        case 500:
          return "🕉️ The divine servers are experiencing obstacles. Please try again shortly.";
        default:
          return "🕉️ Divine obstacles arise, but with patience, all paths become clear.";
      }
    }
  } catch (error) {
    console.error('Error calling Ganesha backend:', error);
    
    // Handle different types of errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return "🕉️ Unable to connect to divine wisdom. Please check your connection and try again.";
    } else if (error.name === 'AbortError') {
      return "🕉️ The divine connection timed out. Please try again with patience.";
    } else {
      return "🕉️ Unexpected obstacles have appeared. Please try again, and trust in divine timing.";
    }
  }
};


  // UPDATE: Remove the old generateAPIKeyErrorMessage function completely
  // UPDATE: Simplify the generateTTS function to focus only on ElevenLabs
  const generateTTS = async (text: string, language: string = "en"): Promise<string | null> => {
    console.log('🎵 Generating TTS with ElevenLabs voice:', selectedVoiceId, 'Model:', selectedTTSModel);

    // Use hardcoded API key
    const elevenlabsKey = ELEVENLABS_API_KEY;

    // Use customVoiceId if selected
    const voiceIdToUse = selectedVoiceId === 'custom' && customVoiceId.trim().length > 0
      ? customVoiceId.trim()
      : selectedVoiceId;

    if (elevenlabsKey && elevenlabsKey.trim().length > 10) {
      try {
        console.log('🚀 Using ElevenLabs Premium for TTS...');

        const voiceProfile = divineVoiceProfiles[voiceIdToUse as keyof typeof divineVoiceProfiles];
        const useStability = voiceProfile?.stability || voiceStability;
        const useSimilarity = voiceProfile?.similarity || voiceSimilarity;
        const useRate = voiceProfile?.rate || speakingRate;

        const response = await fetch('http://localhost:5000/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text,
            voiceId: voiceIdToUse,
            model: selectedTTSModel
          })
        });

        if (response.ok) {
          const audioBlob = await response.blob();
          const audioUrl = URL.createObjectURL(audioBlob);
          console.log('✅ ElevenLabs TTS Success!');
          return audioUrl;
        } else {
          const errorText = await response.text();
          console.error('❌ ElevenLabs Error:', errorText);
          try {
            const errorObj = JSON.parse(errorText);
            if (errorObj.detail?.message?.includes('Free Tier usage disabled')) {
              console.log('💰 ElevenLabs Free Tier disabled - need paid subscription');
            } else if (errorObj.detail?.message?.includes('Invalid API key')) {
              console.log('🔑 ElevenLabs API Key is invalid');
            }
          } catch (e) {
            // Error parsing failed
          }
        }
      } catch (error) {
        console.error('❌ ElevenLabs TTS Error:', error);
      }
    } else {
      console.log('⚠️ No valid ElevenLabs API key found');
    }

    // Fallback to browser TTS
    console.log('🔄 Falling back to enhanced browser TTS...');
    return generateEnhancedBrowserTTS(text, language);
  };

  const generateEnhancedBrowserTTS = (text: string, language: string): Promise<string | null> => {
    return new Promise((resolve) => {
      if ('speechSynthesis' in window) {
        try {
          speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(text);

          // Language mapping
          const langMap = {
            hi: 'hi-IN',
            mr: 'mr-IN',
            en: 'en-US'
          };

          utterance.lang = langMap[language as keyof typeof langMap] || 'en-US';

          // Enhanced voice selection for divine presence
          const voices = speechSynthesis.getVoices();
          if (voices.length > 0) {
            const targetLang = utterance.lang.substring(0, 2);

            // Priority order for divine masculine voices
            const voicePreferences = [
              // Deep, authoritative voices
              'david', 'alex', 'daniel', 'aaron', 'fred',
              // Rich, warm voices  
              'thomas', 'paul', 'gordon', 'ralph',
              // Clear, wise voices
              'arthur', 'christopher', 'edward', 'henry',
              // Any male voice
              'male', 'man'
            ];

            let selectedVoice = null;

            // First pass - look for preferred divine voices
            for (const preference of voicePreferences) {
              selectedVoice = voices.find(voice =>
                voice.lang.startsWith(targetLang) &&
                voice.name.toLowerCase().includes(preference)
              );
              if (selectedVoice) break;
            }

            // Second pass - any voice in the language
            if (!selectedVoice) {
              selectedVoice = voices.find(voice =>
                voice.lang.startsWith(targetLang)
              );
            }

            if (selectedVoice) {
              utterance.voice = selectedVoice;
              console.log(`🎵 Selected voice: ${selectedVoice.name}`);
            }
          }

          // Divine voice characteristics
          utterance.rate = 0.75;     // Slower, more contemplative
          utterance.pitch = 0.7;     // Lower pitch for masculine authority
          utterance.volume = 1.0;    // Full volume for clear guidance

          utterance.onstart = () => {
            setIsSpeaking(true);
          };

          utterance.onend = () => {
            setIsSpeaking(false);
            resolve(null);
          };

          utterance.onerror = (event) => {
            console.error('Browser TTS error:', event.error);
            setIsSpeaking(false);
            resolve(null);
          };

          speechSynthesis.speak(utterance);

        } catch (error) {
          console.error('Browser TTS error:', error);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  };

  // Speech to Text (unchanged but optimized)
  const startSpeechToText = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.maxAlternatives = 3;
        recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'mr' ? 'mr-IN' : 'en-US';

        let finalTranscript = '';
        let speechTimeout: NodeJS.Timeout;

        recognition.onstart = () => {
          setIsRecording(true);
          finalTranscript = '';
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setInputValue(finalTranscript + interimTranscript);

          if (speechTimeout) clearTimeout(speechTimeout);
          speechTimeout = setTimeout(() => recognition.stop(), 2000);
        };

        recognition.onerror = (event: any) => {
          setIsRecording(false);
          if (event.error !== 'aborted') {
            reject(new Error(event.error));
          }
        };

        recognition.onend = () => {
          setIsRecording(false);
          resolve(finalTranscript.trim());
        };

        recognition.start();

      } else {
        reject(new Error('Speech recognition not supported'));
      }
    });
  };

  // Message handling functions
  const handleTextMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      inputType: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsTyping(true);

    try {
      const responseText = await getAIGaneshaResponse(currentInput);

      let audioUrl: string | null = null;
      if (communicationMode === 'voice') {
        audioUrl = await generateTTS(responseText, selectedLanguage);
      }

      const ganeshaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        audioUrl: audioUrl || undefined
      };

      setMessages(prev => [...prev, ganeshaResponse]);

      if (communicationMode === 'voice' && audioUrl) {
        setTimeout(() => playAudio(audioUrl), 500);
      }

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSpeechToSpeech = async () => {
    try {
      setIsTyping(true);
      const spokenText = await startSpeechToText();

      if (!spokenText.trim()) {
        setIsTyping(false);
        return;
      }

      setInputValue(spokenText);

      const userMessage: Message = {
        id: Date.now().toString(),
        text: spokenText,
        isUser: true,
        timestamp: new Date(),
        inputType: 'voice'
      };

      setMessages(prev => [...prev, userMessage]);

      const responseText = await getAIGaneshaResponse(spokenText);
      const audioUrl = await generateTTS(responseText, selectedLanguage);

      const ganeshaResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        audioUrl: audioUrl || undefined
      };

      setMessages(prev => [...prev, ganeshaResponse]);

      if (audioUrl) {
        setTimeout(() => playAudio(audioUrl), 500);
      }

    } catch (error) {
      console.error('Speech to Speech Error:', error);
    } finally {
      setIsTyping(false);
      setInputValue('');
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      setIsSpeaking(true);
      audioRef.current.onended = () => setIsSpeaking(false);
    }
  };

  const speakMessage = async (text: string) => {
    setIsSpeaking(true);

    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }

    const audioUrl = await generateTTS(text, selectedLanguage);

    if (audioUrl) {
      playAudio(audioUrl);
    } else {
      setTimeout(() => setIsSpeaking(false), 3000);
    }
  };

  const saveSettings = () => {
    localStorage.setItem('ganesha_voice_id', selectedVoiceId);
    localStorage.setItem('ganesha_voice_settings', JSON.stringify({
      stability: voiceStability,
      similarity: voiceSimilarity,
      rate: speakingRate
    }));
    localStorage.setItem('ganesha_tts_model', selectedTTSModel);
    setShowApiKeyInput(false);
    setShowVoiceSettings(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextMessage();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if ((window as any).currentRecognition) {
      (window as any).currentRecognition.stop();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col border-primary/20 shadow-xl bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Enhanced Header */}
      <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            <div>
              <h2 className="text-2xl font-bold text-primary">Divine Ganesha Chat</h2>
              <p className="text-sm text-muted-foreground">Premium AI-powered spiritual guidance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVoiceSettings(!showVoiceSettings)}
              className="border-primary/30 hover:border-primary"
            >
              <Settings className="w-4 h-4 mr-2" />
              Voice
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowApiKeyInput(!showApiKeyInput)}
              className="border-primary/30 hover:border-primary"
            >
              <Key className="w-4 h-4 mr-2" />
              API Key
            </Button>
          </div>
        </div>

        {/* Communication Mode Toggle */}
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm font-medium text-primary">Mode:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={communicationMode === 'text' ? "default" : "outline"}
              onClick={() => setCommunicationMode('text')}
              className="flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Text Chat
            </Button>
            <Button
              size="sm"
              variant={communicationMode === 'voice' ? "default" : "outline"}
              onClick={() => setCommunicationMode('voice')}
              className="flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Voice Chat
            </Button>
          </div>
        </div>

        {/* Voice Settings Panel */}
        {showVoiceSettings && (
          <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-background/50">
            <h3 className="font-semibold text-primary mb-3">Divine Voice Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Voice Character</label>
                <Select value={selectedVoiceId} onValueChange={setSelectedVoiceId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(divineVoiceProfiles).map(([id, profile]) => (
                      <SelectItem key={id} value={id}>
                        {profile.name} - {profile.description}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Voice ID</SelectItem>
                  </SelectContent>
                </Select>
                {selectedVoiceId === 'custom' && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom ElevenLabs Voice ID"
                    value={customVoiceId}
                    onChange={e => setCustomVoiceId(e.target.value)}
                  />
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Language</label>
                <Select value={selectedLanguage} onValueChange={(value) => setSelectedLanguage(value as 'en' | 'hi' | 'mr')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                    <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-sm font-medium">TTS Model</label>
              <Select value={selectedTTSModel} onValueChange={setSelectedTTSModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {elevenLabsTTSModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name} - {model.description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Stability: {voiceStability}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceStability}
                  onChange={(e) => setVoiceStability(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Similarity: {voiceSimilarity}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={voiceSimilarity}
                  onChange={(e) => setVoiceSimilarity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Speed: {speakingRate}</label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={speakingRate}
                  onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Voice Preview:</strong> {divineVoiceProfiles[selectedVoiceId as keyof typeof divineVoiceProfiles]?.description || 'Custom voice settings'}
              </p>
              <p className="text-xs text-blue-700 mt-2">
                <strong>TTS Model:</strong> {elevenLabsTTSModels.find(m => m.id === selectedTTSModel)?.description}
              </p>
            </div>
          </div>
        )}

        {/* API Settings Panel */}
        {showApiKeyInput && (
          <div className="mt-4 p-4 border border-primary/20 rounded-lg bg-background/50">
            <div className="space-y-4">
              {/* ElevenLabs Section */}
              <div className="p-3 border border-green-200 rounded-lg bg-green-50/50">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 font-semibold">🎵 ElevenLabs API Key</span>
                  <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">PAID ONLY</span>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="sk_xxxxxxxxxxxxxxxxxxxxxxxxx"
                      disabled
                      className="pr-10 border-green-300 focus:border-green-500"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-orange-600">
                    ⚠️ <strong>Free tier disabled due to abuse.</strong> Paid subscription required.
                  </p>
                  <p className="text-xs text-green-600">
                    🔊 Premium divine voice synthesis (elevenlabs.io → Profile → API Key)
                  </p>
                </div>
              </div>

              <Button onClick={saveSettings} className="w-full">
                💾 Save API Configuration
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${message.isUser
                    ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground ml-12'
                    : 'bg-card border border-primary/10 text-card-foreground mr-12 shadow-lg'
                  }`}
              >
                {!message.isUser && (
                  <div className="text-primary font-semibold mb-2 text-sm flex items-center justify-between">
                    <span>🕉️ Lord Ganesha</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => speakMessage(message.text)}
                      className="h-6 w-6 p-0 hover:bg-primary/10"
                      disabled={isSpeaking}
                      title={isSpeaking ? 'Currently speaking...' : 'Hear divine guidance'}
                    >
                      {isSpeaking ? (
                        <VolumeX className="h-3 w-3 animate-pulse" />
                      ) : (
                        <Volume2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                )}
                {message.isUser && message.inputType === 'voice' && (
                  <div className="text-xs text-primary-foreground/70 mb-1 flex items-center gap-1">
                    <Mic className="w-3 h-3" />
                    Voice Message
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <div className={`text-xs mt-2 opacity-60 ${message.isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card border border-primary/10 rounded-2xl p-4 mr-12 shadow-lg">
                <div className="text-primary font-semibold mb-2 text-sm">🕉️ Lord Ganesha</div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <span className="ml-2 text-sm text-muted-foreground">
                    Channeling divine wisdom...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-6 border-t border-primary/20 bg-gradient-to-r from-background to-primary/5">
        {communicationMode === 'text' ? (
          // Text Mode
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Share your thoughts with Lord Ganesha..."
                className="min-h-[60px] border-primary/20 focus:border-primary resize-none pr-12"
                maxLength={2000}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSpeechToSpeech}
                className="absolute right-2 top-2 h-8 w-8 p-0 hover:bg-primary/10"
                title="Use voice input"
                disabled={isRecording || isTyping}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>
            <Button
              onClick={handleTextMessage}
              disabled={!inputValue.trim() || isTyping}
              variant="divine"
              className="h-auto px-6 py-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          // Voice Mode
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  isRecording
                    ? "🎤 Listening to your divine inquiry..."
                    : "Voice mode active - Click microphone for spiritual dialogue"
                }
                className={`min-h-[60px] border-primary/20 focus:border-primary resize-none pr-12 ${isRecording ? 'bg-red-50/30 border-red-300' : ''
                  }`}
                maxLength={2000}
              />

              {isRecording && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50/90 rounded-lg backdrop-blur-sm">
                  <div className="text-center max-w-full px-4">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[...Array(7)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-red-500 rounded-full transition-all duration-200"
                          style={{
                            width: '3px',
                            height: `${Math.max(8, audioLevel * 30 + Math.random() * 15 + (i % 2) * 5)}px`,
                            animationDelay: `${i * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                    <div className="text-red-600 text-sm font-medium mb-1">
                      🎤 Receiving your spiritual inquiry...
                    </div>
                    <div className="text-xs text-red-500">
                      Speak naturally, divine guidance awaits
                    </div>
                  </div>
                </div>
              )}

              <Button
                size="sm"
                variant="ghost"
                onClick={isRecording ? stopRecording : handleSpeechToSpeech}
                className={`absolute right-2 top-2 h-8 w-8 p-0 z-10 ${isRecording ? 'bg-red-100 hover:bg-red-200 text-red-600 animate-pulse' : 'hover:bg-primary/10'
                  }`}
                title={isRecording ? 'Stop divine listening' : 'Begin spiritual dialogue'}
                disabled={isTyping}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={handleTextMessage}
              disabled={!inputValue.trim() || isTyping}
              variant="divine"
              className="h-auto px-6 py-4"
              title="Send as text"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        )}

        <div className="text-xs text-muted-foreground mt-2 text-center">
          {communicationMode === 'text' ? (
            <>
              📝 <strong>Text Mode:</strong> Type your spiritual questions • Click mic for voice input
            </>
          ) : (
            <>
              🗣️ <strong>Voice Mode:</strong> Click mic for complete speech-to-speech divine dialogue
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-1 text-center">
          {ELEVENLABS_API_KEY
            ? `🚀 ElevenLabs Premium Voice active: ${divineVoiceProfiles[selectedVoiceId as keyof typeof divineVoiceProfiles]?.name || 'Custom Voice'} (${elevenLabsTTSModels.find(m => m.id === selectedTTSModel)?.name}) 🙏`
            : "⚡ Add your ElevenLabs API key for premium divine voice 🙏"
          }
        </p>
      </div>

      <audio ref={audioRef} style={{ display: 'none' }} />
    </Card>
  );
};

export default GaneshaChat;