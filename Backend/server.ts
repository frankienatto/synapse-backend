
import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './database';
import * as ai from './ai';
import { RoomStatus, DBState, Staff, Guest, Booking, Room, Review, Product, Transaction, StaffTask, ChatConversation, ChatMessage, CustomAudience, Expense, Block, ScheduledPost, AddOn, SiteContent, ThemeSettings, SocialConnection, Project, ShoppingListItem, MediaAsset, SocialMediaPlatform, CampaignPerformanceAnalysis, ManagementReport, ItineraryItem, AIConciergeMessage, Facility, LocalGuideTip, PropertyEvent, RatePlan, BookingRestriction, OTAPlatform, PaymentGatewaySettings, SubscriptionPlan, PropertyInfo } from './types';

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// --- API Endpoints ---

app.get('/initial-data', (req: Request, res: Response) => {
    res.json({ db, chat: { conversations: db.chatConversations, messages: db.chatMessages }, notifications: [] });
});

app.post('/auth/login', (req: Request, res: Response) => {
    const { email, pass } = req.body;
    const staffUser = db.staff.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
    if (staffUser) return res.json({ user: staffUser, token: `staff-token-${staffUser.id}` });
    const guestUser = db.guests.find(u => u.email.toLowerCase() === email.toLowerCase() && (u.password === pass || u.cpf === pass));
    if (guestUser) return res.json({ user: guestUser, token: `guest-token-${guestUser.id}` });
    res.status(401).json({ message: "Email ou senha inválidos." });
});

app.put('/rooms/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;
    const room = db.rooms.find(r => r.id === parseInt(id));
    if (room) {
        room.status = status as RoomStatus;
        res.status(200).json(room);
    } else {
        res.status(404).send('Room not found');
    }
});


// Generic error-handling wrapper for AI functions
const handleAiRequest = async (handler: () => Promise<any>, res: Response) => {
    try {
        const result = await handler();
        res.json(result);
    } catch (error: any) {
        console.error("AI handler error:", error);
        res.status(500).json({ message: error.message || "AI service error" });
    }
};

// AI Endpoints
app.post('/ai/daily-briefing', (req: Request, res: Response) => handleAiRequest(() => ai.generateDailyBriefing(db), res));
app.post('/ai/generate-image', (req: Request, res: Response) => handleAiRequest(() => ai.generateImage(req.body.prompt, req.body.aspectRatio), res));
app.post('/ai/generate-video', (req: Request, res: Response) => handleAiRequest(() => ai.generateVideo(req.body.prompt, req.body.duration, req.body.aspectRatio), res));
app.post('/ai/social-post', (req: Request, res: Response) => handleAiRequest(() => ai.generateSocialMediaPost(req.body.platform, req.body.topic, req.body.context), res));
app.post('/ai/ad-campaign', (req: Request, res: Response) => handleAiRequest(() => ai.generateAdCampaign(req.body.platform, req.body.goal, req.body.context), res));
app.post('/ai/optimize-campaign', (req: Request, res: Response) => handleAiRequest(() => ai.generateDeepCampaignOptimization(req.body.campaign), res));
app.post('/ai/analyze-creative', (req: Request, res: Response) => handleAiRequest(() => ai.analyzeAdCreative(req.body.imageBase64, req.body.mimeType), res));
app.post('/ai/spy-competitor', (req: Request, res: Response) => handleAiRequest(() => ai.spyOnCompetitor(req.body.competitorName), res));
app.post('/ai/detect-anomalies', (req: Request, res: Response) => handleAiRequest(() => ai.detectCampaignAnomalies(req.body.campaigns), res));
app.post('/ai/marketing-mix', (req: Request, res: Response) => handleAiRequest(() => ai.generateMarketingMixPlan(req.body.objective, req.body.budget, req.body.period), res));
app.post('/ai/campaigns-from-phase', (req: Request, res: Response) => handleAiRequest(() => ai.generateCampaignsFromPhase(req.body.phase, req.body.plan, req.body.budget), res));
app.post('/ai/analyze-performance', (req: Request, res: Response) => handleAiRequest(() => ai.analyzeCampaignPerformance(req.body.adSet, req.body.campaign), res));
app.post('/ai/analyze-market-seo', (req: Request, res: Response) => handleAiRequest(() => ai.analyzeMarketAndSEO(req.body.domain), res));
app.post('/ai/spy-competitor-ads', (req: Request, res: Response) => handleAiRequest(() => ai.spyOnCompetitorAds(req.body.competitor), res));
app.post('/ai/generate-creative-asset', (req: Request, res: Response) => handleAiRequest(() => ai.generateCreativeAsset(req.body.assetType, req.body.topic), res));
app.post('/ai/get-growth-hacks', (req: Request, res: Response) => handleAiRequest(() => ai.getGrowthHacks(req.body.question), res));
app.post('/ai/post-from-review', (req: Request, res: Response) => handleAiRequest(() => ai.generatePostFromReview(req.body.comment, req.body.guestName), res));
app.post('/ai/work-schedule', (req: Request, res: Response) => handleAiRequest(() => ai.generateWorkSchedule(req.body.staff, req.body.constraints), res));
app.post('/ai/onboarding-plan', (req: Request, res: Response) => handleAiRequest(() => ai.generateOnboardingPlan(req.body.employeeName, req.body.employeeRole, req.body.existingStaff), res));
app.post('/ai/team-performance', (req: Request, res: Response) => handleAiRequest(() => ai.analyzeTeamPerformance(req.body.tasks, req.body.staff, req.body.targetStaffId), res));
app.post('/ai/breakeven', (req: Request, res: Response) => handleAiRequest(() => ai.calculateBreakevenPoint(req.body.totalFixedCosts, req.body.avgRevenuePerGuest, req.body.variableCostPerGuest), res));
app.post('/ai/financial-scenario', (req: Request, res: Response) => handleAiRequest(() => ai.runFinancialScenario(req.body.scenario, req.body.totalFixedCosts, req.body.avgRevenuePerGuest, req.body.variableCostPerGuest), res));
app.post('/ai/business-diagnosis', (req: Request, res: Response) => handleAiRequest(() => ai.generateBusinessDiagnosis(req.body.dbState), res));
app.post('/ai/profitability-plan', (req: Request, res: Response) => handleAiRequest(() => ai.generateProfitabilityPlan(req.body.dbState), res));
app.post('/ai/expansion-simulation', (req: Request, res: Response) => handleAiRequest(() => ai.simulateExpansion(req.body.query, req.body.dbState), res));
app.post('/ai/management-report', (req: Request, res: Response) => handleAiRequest(() => ai.getManagementReport(), res));
app.post('/ai/personas', (req: Request, res: Response) => handleAiRequest(() => ai.generatePersonas(req.body.audienceDescription), res));
app.post('/ai/persona-from-audience', (req: Request, res: Response) => handleAiRequest(() => ai.createPersonaFromAudience(req.body.audience), res));
app.post('/ai/daily-itinerary', (req: Request, res: Response) => handleAiRequest(() => ai.generateDailyItinerary(req.body.guestInterests, req.body.todaysEvents), res));
app.post('/ai/concierge/:guestId/message', (req: Request, res: Response) => handleAiRequest(() => ai.sendConciergeMessage(req.params.guestId, req.body.message, db), res));
app.post('/ai/synapse-agent/command', (req: Request, res: Response) => handleAiRequest(() => ai.executeSynapseCommand(req.body.command, req.body.userId, req.body.userName, db), res));


// Add other mocked or simple endpoints here
app.post('/bookings/new-guest', (req: Request, res: Response) => {
    // This is a simplified version. A real one would do more validation.
    const { booking, guest: guestData } = req.body;
    const newGuest: Guest = { id: `G${Date.now()}`, ...guestData };
    db.guests.push(newGuest);

    const newBooking: Booking = { 
        id: `B${Date.now()}`,
        guestId: newGuest.id,
        ...booking,
        totalPrice: 200, // Simplified price calculation
        balance: 0,
        paymentStatus: 'Paid',
        status: 'Confirmed'
    };
    db.bookings.push(newBooking);
    res.status(201).json({ booking: newBooking, guest: newGuest });
});


// This is the default export for Vercel
export default app;
