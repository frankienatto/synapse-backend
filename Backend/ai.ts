
import { GoogleGenAI, Type } from "@google/genai";
import { DBState, Staff, StaffTask, AdCampaign, Persona, CustomAudience, Review, AIConciergeMessage, DailyBriefing, BusinessDiagnosis, MarketingMixPlan, CampaignPerformanceAnalysis, ManagementReport, SynapseMessage } from './types';

// This file contains all functions that interact with the Google Gemini API.
// It is kept separate to centralize AI logic and manage the API key securely.

const getAi = () => {
  // In Vercel, process.env.API_KEY must be set in the project's Environment Variables settings.
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- MOCKED AI RESPONSES (if API key is not available) ---
const mockResponse = (data: any) => {
    console.log("Using mocked AI response.");
    return data;
}

// --- ACTUAL AI FUNCTIONS ---

export const generateImage = async (prompt: string, aspectRatio: string): Promise<{ base64Image: string } | null> => {
    const ai = getAi();
    if (!ai) return mockResponse(null);

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: { numberOfImages: 1, aspectRatio: aspectRatio as any, outputMimeType: 'image/png' },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return { base64Image: response.generatedImages[0].image.imageBytes };
        }
        return null;
    } catch (error) {
        console.error("Error generating image in backend:", error);
        throw new Error("Failed to generate image.");
    }
};

export const generateDailyBriefing = async (dbState: DBState): Promise<DailyBriefing> => {
    const ai = getAi();
    if (!ai) return mockResponse({ summary: { title: "Briefing Simulado", points: ["Backend online, API Key ausente."] }, attentionPoints: { title: "Atenção", points: [] }, proactiveSuggestions: { title: "Sugestões", points: [] } });
    
    // In a real scenario, you'd pass relevant parts of dbState to the model.
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "Gere um briefing diário para um gerente de hostel. Inclua um resumo, pontos de atenção e sugestões proativas. A resposta deve ser em JSON."
    });
    
    // Basic parsing, would need more robust error handling in production
    return JSON.parse(response.text.replace(/```json|```/g, ''));
};

export const generateBusinessDiagnosis = async (dbState: DBState): Promise<BusinessDiagnosis> => {
    const ai = getAi();
    if (!ai) return mockResponse({ keyInsights: [], crossModuleCorrelations: [], warnings: [] });
    return { keyInsights: [], crossModuleCorrelations: [], warnings: [] }; // Return mock for now
}

export const generateMarketingMixPlan = async (objective: string, budget: number, period: string): Promise<MarketingMixPlan> => {
    const ai = getAi();
    if (!ai) return mockResponse({ strategicVision: 'Mock vision', budgetSplit: [], phases: [], keyMetrics: [], creativeGuidelines: '' });
    return { strategicVision: 'Mock vision', budgetSplit: [], phases: [], keyMetrics: [], creativeGuidelines: '' }; // Return mock for now
}

export const sendConciergeMessage = async (guestId: string, message: string, db: DBState): Promise<AIConciergeMessage> => {
    const ai = getAi();
    const guest = db.guests.find(g => g.id === guestId);
    if (!guest) throw new Error("Guest not found");

    const userMessage: AIConciergeMessage = { id: `msg_${Date.now()}`, sender: 'user', text: message, timestamp: new Date().toISOString() };
    guest.conciergeChatHistory = [...(guest.conciergeChatHistory || []), userMessage];
    
    if (!ai) {
        const mockReply: AIConciergeMessage = { id: `msg_${Date.now()}_agent`, sender: 'agent', text: "Desculpe, meu cérebro está offline (API Key não configurada).", timestamp: new Date().toISOString() };
        guest.conciergeChatHistory.push(mockReply);
        return mockReply;
    }

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `O hóspede disse: "${message}". Responda como um concierge de hostel amigável.`
    });
    
    const agentReply: AIConciergeMessage = { id: `msg_${Date.now()}_agent`, sender: 'agent', text: response.text, timestamp: new Date().toISOString() };
    guest.conciergeChatHistory.push(agentReply);
    return agentReply;
};


// --- PLACEHOLDERS for other AI functions ---
// These functions would be fully implemented with prompts and logic similar to the ones above.

export const generateVideo = async (prompt: string, duration: number, aspectRatio: string): Promise<{ videoUrl: string }> => mockResponse({ videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' });
export const generateSocialMediaPost = async (platform: string, topic: string, context: string): Promise<{ postText: string; imageSuggestion: string }> => mockResponse({ postText: `Post incrível sobre ${topic} no ${platform}!`, imageSuggestion: `Uma foto vibrante de ${topic}.` });
export const generateAdCampaign = async (platform: string, goal: string, context: string): Promise<any> => mockResponse({ campaignName: `Campanha de ${goal}`, adCopy: { headlines: ['Título Gerado pela IA'], descriptions: ['Descrição gerada pela IA.'] }, targeting: { keywords: ['hostel', 'viagem'] }, creativeSuggestion: 'Usar imagem de pessoas felizes na praia.', budget: { dailyAmount: 50, justification: 'Orçamento inicial recomendado.' } });
export const generateDeepCampaignOptimization = async (campaign: AdCampaign): Promise<any> => mockResponse({ copyOptimization: {}, audienceDiscovery: {}, automatedRules: [] });
export const analyzeAdCreative = async (imageBase64: string, mimeType: string): Promise<any> => mockResponse({ strengths: ['Boa iluminação'], weaknesses: ['Texto pequeno'], suggestions: ['Aumentar o logo'] });
export const spyOnCompetitor = async (competitorName: string): Promise<any> => mockResponse({});
export const detectCampaignAnomalies = async (campaigns: AdCampaign[]): Promise<any> => mockResponse({ anomalies: [] });
export const generateCampaignsFromPhase = async (phase: any, plan: any, budget: number): Promise<{ campaigns: any[] }> => mockResponse({ campaigns: [] });
export const analyzeCampaignPerformance = async (adSet: any, campaign: any): Promise<CampaignPerformanceAnalysis> => mockResponse({ summary: { performanceLevel: 'Bom', text: 'Ok' }, insights: [], recommendations: [] });
export const analyzeMarketAndSEO = async (domain: string): Promise<any> => mockResponse({});
export const spyOnCompetitorAds = async (competitor: string): Promise<any> => mockResponse({});
export const generateCreativeAsset = async (assetType: 'Imagem' | 'Vídeo', topic: string): Promise<any> => mockResponse({});
export const getGrowthHacks = async (question: string): Promise<any> => mockResponse({});
export const generatePostFromReview = async (comment: string, guestName: string): Promise<{ postText: string, imageSuggestion: string }> => mockResponse({ postText: `Obrigado, ${guestName}!`, imageSuggestion: 'Foto do hostel' });
export const generateWorkSchedule = async (staff: Staff[], constraints: string): Promise<any> => mockResponse({ schedule: [] });
export const generateOnboardingPlan = async (employeeName: string, employeeRole: string, existingStaff: Staff[]): Promise<any> => mockResponse({ plan: [] });
export const analyzeTeamPerformance = async (tasks: StaffTask[], staff: Staff[], targetStaffId?: string): Promise<any> => mockResponse({ summary: 'Todos são ótimos', strengths: [], suggestions: [] });
export const calculateBreakevenPoint = async (totalFixedCosts: number, avgRevenuePerGuest: number, variableCostPerGuest: number): Promise<any> => mockResponse({ breakevenOccupancyRate: 42, monthlyRevenueTarget: 10000, analysis: 'Análise mockada.' });
export const runFinancialScenario = async (scenario: string, totalFixedCosts: number, avgRevenuePerGuest: number, variableCostPerGuest: number): Promise<any> => mockResponse({ scenario, impactAnalysis: { profitChange: 'aumento', revenueChange: 'aumento' }, recommendations: [], potentialRisks: [] });
export const generateProfitabilityPlan = async (dbState: DBState): Promise<any> => mockResponse({ pricingSuggestions: [], packageDeals: [] });
export const simulateExpansion = async (query: string, dbState: DBState): Promise<any> => mockResponse({ simulationSummary: 'Parece uma boa ideia.', estimatedCost: 'R$ 50.000', projectedRevenueIncrease: '15%', estimatedROI: '25%', risksAndConsiderations: [] });
export const getManagementReport = async (): Promise<ManagementReport | null> => mockResponse(null);
export const generatePersonas = async (audienceDescription: string): Promise<{ personas: Persona[] }> => mockResponse({ personas: [] });
export const createPersonaFromAudience = async (audience: CustomAudience): Promise<Persona> => mockResponse({} as Persona);
export const generateDailyItinerary = async (guestInterests: string[], todaysEvents: any[]): Promise<any> => mockResponse({ morning: {}, afternoon: {}, night: {} });
export const executeSynapseCommand = async (command: string, userId: string, userName: string, db: DBState): Promise<void> => {
    const agentMessage: SynapseMessage = { id: `syn_${Date.now()}`, sender: 'agent', text: `Comando "${command}" recebido, mas a execução real não está implementada.`, timestamp: new Date().toISOString() };
    db.synapseChatHistory.push(agentMessage);
};

