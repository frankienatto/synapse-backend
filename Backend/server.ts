
import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { GoogleGenAI, Type } from "@google/genai";

// --- TYPES ---
// All type definitions are now included directly in this file.
export interface Facility { id: string; icon: string; name: string; description: string; }
export interface Project { id: string; name: string; description: string; status: 'Ativo' | 'Concluído' | 'Arquivado'; ownerId: string; taskIds: string[]; createdAt: string; }
export type SiteContent = { hero: { title: string; subtitle: string; imageUrl: string; }; whyUs: { title:string; subtitle: string; items: { icon: string; title: string; text: string; }[]; }; about: { title: string; text1: string; text2: string; imageUrls: string[]; }; experiences: { title: string; items: { title: string; description: string; imageUrl: string; }[]; }; facilities: Facility[]; cta: { title: string; subtitle: string; buttonText: string; } }
export type AdminSection = | 'dashboard' | 'calendar' | 'rooms' | 'bookings' | 'guests' | 'staff' | 'team_manager_ai' | 'pos' | 'financial_manager' | 'inventory' | 'shopping_list' | 'social_media' | 'ad_campaign_manager' | 'reports' | 'omni_channel' | 'internal_chat' | 'marketing_mix_ai' | 'ai_marketing_lab' | 'creative_studio' | 'ai_strategy_consultant' | 'property_settings' | 'projects' | 'ai_engagement_agent' | 'marketing_orchestrator' | 'management_center' | 'saas_admin' | 'subscriptions' | 'synapse_agent' | 'rate_manager' | 'channel_manager' | 'my_subscription' | 'guest_journey_ai';
export type ThemeSettings = { adminPanel: { primaryColor: string; sidebarColor: string; backgroundColor: string; textColor: string; logoUrl: string; headerTitles: { [key in AdminSection]?: string }; cardBorderRadius: string; buttonBorderRadius: string; }; guestPortal: { primaryColor: string; backgroundColor: string; cardColor: string; textColor: string; welcomeTitle: string; welcomeSubtitle: string; cardTitles: { quickAccess: string; roomControls: string; tvControls: string; services: string; communityHub: string; }; cardBorderRadius: string; buttonBorderRadius: string; }; publicSite: { headerLayout: 'default' | 'logo-center'; searchLayout: 'inline' | 'stacked'; aboutGalleryLayout: 'grid' | 'carousel-simple'; experiencesLayout: 'grid' | 'list'; facilitiesLayout: 'grid' | 'list'; footerLayout: 'default' | 'multi-column'; primaryColor: string; backgroundColor: string; textColor: string; cardBackgroundColor: string; logoHeight: string; cardBorderRadius: string; buttonBorderRadius: string; }; }
export enum RoomType { SHARED_DORM = 'Dormitório Compartilhado', PRIVATE_SINGLE = 'Quarto Individual', PRIVATE_DOUBLE = 'Quarto Duplo', PRIVATE_COUPLE = 'Quarto de Casal', PRIVATE_TRIPLE = 'Quarto Triplo', PRIVATE_QUAD = 'Quarto Quádruplo', PRIVATE_FAMILY = 'Quarto Familiar', }
export enum RoomStatus { AVAILABLE = 'Disponível', OCCUPIED = 'Ocupado', CLEANING = 'Limpeza', MAINTENANCE = 'Manutenção' }
export interface Bed { bedNumber: number; bookingId: string | null; guestName: string | null; }
export interface Room { id: number; name: string; type: RoomType; capacity: number; basePrice: number; imageUrl: string; amenities: string[]; status: RoomStatus; occupants?: { guestId: string; guestName: string; bookingId: string }[]; beds?: Bed[]; lightsOn?: boolean; acOn?: boolean; acTemp?: number; doNotDisturb?: boolean; }
export interface ItineraryItem { id: string; date: string; time?: string; title: string; type: 'tip' | 'activity' | 'event'; sourceId: string; icon?: string; }
export interface Achievement { id: string; name: string; description: string; icon: string; }
export interface GuestPost { id: string; guestId: string; guestName: string; guestProfilePictureUrl?: string; text: string; imageUrl?: string; timestamp: string; }
export interface Reward { id: string; name: string; description: string; cost: number; icon: string; }
export interface LoyaltyLevel { id: string; name: string; minPoints: number; icon: string; }
export interface CheckIn { id: string; guestId: string; locationId: string; locationName: string; locationType: 'tip' | 'activity'; timestamp: string; }
export interface AIConciergeMessage { id: string; sender: 'user' | 'agent'; text: string; timestamp: string; isLoading?: boolean; }
export interface Guest { id: string; fullName: string; email: string; phone: string; cpf: string; password?: string; birthDate?: string; nationality?: string; gender?: 'Masculino' | 'Feminino' | 'Outro' | 'Não informado'; address?: { street: string; number: string; city: string; state: string; zip: string; }; profilePictureUrl?: string; socials?: { instagram?: string; facebook?: string; twitter?: string; }; interests?: string[]; personalitySummary?: string; theme?: 'light' | 'dark' | 'tropical'; favoriteTipIds?: string[]; itinerary?: ItineraryItem[]; unlockedAchievements?: string[]; points?: number; weeklyPoints?: number; lastPostTimestamp?: string; conciergeChatHistory?: AIConciergeMessage[]; }
export interface AddOn { id: string; name: string; price: number; }
export interface RatePlan { id: string; name: string; description: string; priceModifier: number; modifierType: 'fixed' | 'percentage'; isDefault: boolean; }
export interface Booking { id: string; guestId: string; roomId: number; ratePlanId: string; checkIn: string; checkOut: string; numGuests: number; totalPrice: number; status: 'Confirmed' | 'Pending' | 'Checked-in' | 'Checked-out' | 'Cancelled' | 'Pre-Checked-in'; source: 'Website' | 'Walk-in' | 'Phone'; balance: number; paymentStatus: 'Paid' | 'Pending'; reviewId?: string; idPhotoUrl?: string; signatureUrl?: string; rulesAcknowledged?: boolean; addOns?: AddOn[]; guestJourneyId?: string; }
export interface Staff { id: string; name: string; role: 'Super Administrador' | 'Administrador Geral' | 'Gerente' | 'Diretor de Marketing' | 'Recepção' | 'Limpeza' | 'Manutenção' | 'Financeiro' | 'Jardim'; email: string; password?: string; permissions: AdminSection[]; onboardingCompleted?: boolean; }
export interface Review { id: string; bookingId: string; guestId: string; guestName: string; rating: number; comment: string; date: string; status: 'Pending' | 'Approved' | 'Rejected'; }
export interface Product { id: string; name: string; price: number; category: 'Comida & Bebida' | 'Aluguel' | 'Passeio' | 'Outros'; stock: number; lowStockThreshold: number; }
export interface Transaction { id: string; items: { productId: string; name: string; quantity: number; unitPrice: number; }[]; total: number; paymentMethod: 'Cartão de Crédito' | 'Dinheiro' | 'Conta do Quarto' | 'PIX' | 'PayPal'; bookingId?: string; guestName: string; timestamp: string; }
export enum TaskStatus { TODO = 'A Fazer', IN_PROGRESS = 'Em Andamento', AWAITING_CHECK = 'Aguardando Verificação', DONE = 'Concluído' }
export interface StaffTask { id: string; description: string; status: TaskStatus; assigneeId?: string; roomId?: number; bookingId?: string; supervisorComment?: string; projectId?: string; }
export interface Expense { id: string; description: string; amount: number; category: 'Luz' | 'Água' | 'Internet' | 'Marketing Digital' | 'Lavanderia' | 'Material de Limpeza' | 'Marketing' | 'Manutenção' | 'Salários' | 'Suprimentos' | 'Contas' | 'Outros'; date: string; }
export interface SubscriptionPlan { id: string; name: string; price: number; description: string; features: AdminSection[]; }
export interface PaymentGatewaySettings { stripe: { connected: boolean; publicKey: string; secretKey: string; }; mercadoPago: { connected: boolean; publicKey: string; accessToken: string; }; }
export interface PropertyInfo { id: string; name: string; address: string; cnpj: string; phone: string; email: string; checkInTime: string; checkOutTime: string; wifiNetwork: string; wifiPass: string; rules: string[]; planId: string; subscriptionStatus: 'Ativa' | 'Atrasada' | 'Cancelada'; paymentGatewaySettings: PaymentGatewaySettings; }
export interface PropertyEvent { id: string; title: string; description: string; date: string; time: string; imageUrl: string; icon: string; }
export interface LocalGuideTip { id: string; category: 'Praias' | 'Trilhas' | 'Restaurantes' | 'Passeios' | 'Hostel'; title: string; description: string; imageUrl: string; icon: string; }
export interface Block { id: string; roomId: number; startDate: string; endDate: string; reason: string; }
export interface BookingRestriction { id: string; startDate: string; endDate: string; type: 'minStay' | 'minAdvance'; value: number; name: string; }
export type AdPlatformString = 'Instagram' | 'Facebook' | 'X' | 'TikTok';
export interface ScheduledPost { id: string; platform: AdPlatformString; content: string; imageUrl?: string; videoUrl?: string; status: 'Scheduled' | 'Draft'; scheduledAt: string; campaignId?: string; }
export interface GuestActivity { id: string; creatorId: string; creatorName: string; title: string; description: string; date: string; maxParticipants?: number; crowdfundingTarget?: number; }
export type OTAPlatform = 'Booking.com' | 'Airbnb' | 'Expedia';
export interface OTAConnection { platform: OTAPlatform; connected: boolean; propertyId: string | null; lastSync: string | null; }
export type MessageSource = 'Instagram' | 'Facebook' | 'Website';
export interface ChatConversation { id: string; guestName: string; lastMessage: string; source: MessageSource; unread: boolean; timestamp: string; category?: string; summary?: string; intent?: 'High' | 'Medium' | 'Low'; isInternal?: boolean; }
export interface ChatMessage { id: string; conversationId: string; senderId: string; senderName: string; text: string; timestamp: string; isAutoReply?: boolean; }
export type AdPlatform = 'Google Ads' | 'Meta Ads' | 'TikTok Ads' | 'X Ads';
export type SocialPlatform = 'Facebook' | 'Instagram' | 'Twitter' | 'WhatsApp';
export interface CustomAudience { id: string; name: string; platform: AdPlatform; type: 'Interests' | 'Lookalike'; description: string; }
export interface SocialConnection { platform: SocialPlatform; connected: boolean; handleOrNumber: string | null; }
export type SocialMediaPlatform = 'Instagram' | 'Facebook';
export interface Persona { name: string; age: number; location: string; interests: string[]; bio: string; engagementRoadmap: { actionType: string; target: string; description: string; }[]; }
export interface AIEngagementAgent { targetAudienceDescription: string; connectedAccount: { platform: SocialMediaPlatform; accountId: string; accountName: string; accessToken: string; } | null; personas: Persona[]; isRunning: boolean; log: { timestamp: string; message: string; }[]; }
export interface ShoppingListItem { id: string; name: string; category: string; status: 'Pendente' | 'Comprado'; productId?: string; }
export interface ShoppingList { id: string; name: string; status: 'Pendente' | 'Concluída'; createdAt: string; items: ShoppingListItem[]; }
export interface MediaAsset { id: string; type: 'image' | 'video'; url: string; prompt?: string; createdAt: string; }
export type CampaignGoal = 'Aumentar Reservas' | 'Promover Oferta' | 'Consciência de Marca';
export interface Ad { id: string; name: string; status: 'Ativa' | 'Pausada' | 'Em Análise' | 'Rascunho'; copy: { headline: string; description: string; }; creativePrompt?: string; mediaAssetId?: string; creativeUrl?: string; }
export interface AdSet { id: string; name: string; status: 'Ativa' | 'Pausada' | 'Rascunho'; audience: { name: string; description: string; }; kpis: { impressions: number; clicks: number; cost: number; conversions: number; }; ads: Ad[]; }
export interface AdCampaign { id: string; name: string; platform: AdPlatform; status: 'Ativa' | 'Pausada' | 'Concluída' | 'Rascunho'; isGeneratedByAI?: boolean; adSets: AdSet[]; rules: { id: string; condition: string; action: string; }[]; }
export interface MarketingMixPlan { strategicVision: string; budgetSplit: { platform: AdPlatform; percentage: number; amount: number; justification: string; }[]; phases: { phaseName: string; duration: string; objective: string; actions: string[]; }[]; keyMetrics: string[]; creativeGuidelines: string; }
export interface CampaignContext { status: 'idle' | 'planning' | 'generating' | 'complete' | 'error'; objective: string; budget: number; period: string; plan: MarketingMixPlan | null; log: { timestamp: string; message: string; }[]; error?: string | null; generatedCampaigns: AdCampaign[]; }
export interface CampaignPerformanceAnalysis { summary: { performanceLevel: 'Excelente' | 'Bom' | 'Razoável' | 'Ruim' | 'Crítico'; text: string; }; insights: { text: string; type: 'positivo' | 'negativo' | 'neutro'; }[]; recommendations: { text: string; priority: 'Alta' | 'Média' | 'Baixa'; }[]; }
export interface ManagementReport { financialSummary: { totalRevenue: number; totalExpenses: number; netProfit: number; keyInsight: string; }; projectStatus: { activeProjects: number; atRiskProjects: { name: string; reason: string; }[]; }; teamPerformance: { tasksCompleted: number; topPerformer: { name: string; completedTasks: number; }; keyInsight: string; }; inventoryAlerts: { lowStockItems: { name: string; stock: number; }[]; }; strategicRecommendations: { priority: 'Alta' | 'Média' | 'Baixa'; recommendation: string; }[]; }
export interface SynapseMessage { id: string; sender: 'user' | 'agent'; text: string; timestamp: string; isLoading?: boolean; }
export type AIActionType = | 'SEND_MESSAGE' | 'SUGGEST_ACTIVITY' | 'OFFER_UPSELL' | 'CREATE_TASK' | 'REQUEST_REVIEW';
export interface AIAction { id: string; type: AIActionType; status: 'planned' | 'executed' | 'cancelled'; timestamp: string; details: { [key: string]: any }; justification: string; }
export interface GuestJourney { id: string; bookingId: string; guestId: string; status: 'pre-arrival' | 'in-stay' | 'post-stay' | 'completed'; satisfactionScore: number; engagementLevel: 'low' | 'medium' | 'high'; actionLog: AIAction[]; }
export interface BusinessDiagnosis { keyInsights: { insight: string; data: string }[]; crossModuleCorrelations: { finding: string; implication: string }[]; warnings: { warning: string; recommendation: string }[]; }
export interface DailyBriefing { summary: { title: string; points: string[]; }; attentionPoints: { title: string; points: { text: string; severity: 'High' | 'Medium' | 'Low'; action?: any }[]; }; proactiveSuggestions: { title: string; points: { text: string; action?: any }[]; }; }
export interface DBState { properties: PropertyInfo[]; currentPropertyId: string; subscriptionPlans: SubscriptionPlan[]; rooms: Room[]; guests: Guest[]; bookings: Booking[]; reviews: Review[]; products: Product[]; transactions: Transaction[]; staff: Staff[]; staffTasks: StaffTask[]; chatConversations: ChatConversation[]; chatMessages: ChatMessage[]; adCampaigns: AdCampaign[]; platformConnections: { platform: AdPlatform; connected: boolean; accountName: string | null; accountId: string | null; }[]; socialConnections: SocialConnection[]; customAudiences: CustomAudience[]; expenses: Expense[]; addOns: AddOn[]; ratePlans: RatePlan[]; propertyEvents: PropertyEvent[]; localGuideTips: LocalGuideTip[]; blocks: Block[]; bookingRestrictions: BookingRestriction[]; otaConnections: OTAConnection[]; scheduledPosts: ScheduledPost[]; sharedSpaces: { livingRoomTV: { isOn: boolean; volume: number; currentApp: 'Netflix' | 'YouTube' | 'TV Aberta' | null; } }; guestActivities: GuestActivity[]; activityParticipants: { activityId: string; guestId: string; guestName: string; }[]; activityComments: { id: string; activityId: string; guestId: string; guestName: string; text: string; timestamp: string; }[]; activityContributions: { activityId: string; guestId: string; amount: number; }[]; siteContent: SiteContent; themeSettings: ThemeSettings; publishedWorkSchedule: any | null; staffPerformanceReviews: Record<string, any>; onboardingPlans: Record<string, any>; aiEngagementAgent: AIEngagementAgent; projects: Project[]; shoppingLists: ShoppingList[]; mediaLibrary: MediaAsset[]; campaignContext: CampaignContext | null; managementReport?: ManagementReport | null; achievements: Achievement[]; rewards: Reward[]; guestPosts: GuestPost[]; loyaltyLevels: LoyaltyLevel[]; checkIns: CheckIn[]; synapseChatHistory: SynapseMessage[]; guestJourneys: GuestJourney[]; }

// --- DATABASE ---
const db: DBState = {
    currentPropertyId: 'P01',
    properties: [ { id: 'P01', name: 'Forest Beach House', address: 'Rua das Gaivotas, 123, Florianópolis, SC', cnpj: '12.345.678/0001-90', phone: '(48) 99999-8888', email: 'contato@forestbeachhouse.com', checkInTime: '14:00', checkOutTime: '11:00', wifiNetwork: 'ForestHouse_Guest', wifiPass: 'natureza123', rules: [], planId: 'PLAN_ENTERPRISE', subscriptionStatus: 'Ativa', paymentGatewaySettings: { stripe: { connected: false, publicKey: '', secretKey: '' }, mercadoPago: { connected: false, publicKey: '', accessToken: '' }, }, } ],
    subscriptionPlans: [ { id: 'PLAN_BASIC', name: 'Básico', price: 299, description: 'Essencial para começar.', features: ['dashboard', 'calendar', 'rooms', 'bookings', 'guests', 'pos', 'reports'] }, { id: 'PLAN_PRO', name: 'Profissional', price: 599, description: 'Ferramentas avançadas para crescer.', features: ['dashboard', 'calendar', 'rooms', 'bookings', 'guests', 'pos', 'reports', 'staff', 'financial_manager', 'inventory', 'social_media', 'omni_channel', 'internal_chat', 'property_settings', 'projects', 'rate_manager', 'channel_manager'] }, { id: 'PLAN_ENTERPRISE', name: 'Synapse AI Enterprise', price: 999, description: 'O poder total da IA para dominar o mercado.', features: ['dashboard', 'calendar', 'rooms', 'bookings', 'guests', 'staff', 'team_manager_ai', 'pos', 'financial_manager', 'inventory', 'shopping_list', 'social_media', 'ad_campaign_manager', 'reports', 'omni_channel', 'internal_chat', 'marketing_mix_ai', 'ai_marketing_lab', 'creative_studio', 'ai_strategy_consultant', 'property_settings', 'projects', 'ai_engagement_agent', 'marketing_orchestrator', 'management_center', 'synapse_agent', 'rate_manager', 'channel_manager', 'guest_journey_ai'] }, ],
    rooms: [ { id: 1, name: 'Suíte Master', type: RoomType.PRIVATE_COUPLE, capacity: 2, basePrice: 250, imageUrl: 'https://i.imgur.com/TP67J8z.jpg', amenities: ['wi-fi', 'ar condicionado'], status: RoomStatus.AVAILABLE }, { id: 2, name: 'Quarto Família', type: RoomType.PRIVATE_FAMILY, capacity: 4, basePrice: 350, imageUrl: 'https://i.imgur.com/h1ObQ2U.jpg', amenities: ['wi-fi', 'ar condicionado'], status: RoomStatus.AVAILABLE }, { id: 3, name: 'Dormitório Misto', type: RoomType.SHARED_DORM, capacity: 6, basePrice: 80, imageUrl: 'https://i.imgur.com/0i3o3a2.jpeg', amenities: ['wi-fi'], status: RoomStatus.CLEANING }, ],
    guests: [ { id: 'G01', fullName: 'Ana Clara', email: 'ana.clara@example.com', phone: '11987654321', cpf: '12345678900' }, { id: 'G02', fullName: 'Bruno Costa', email: 'bruno.costa@example.com', phone: '21912345678', cpf: '09876543211', interests: ['surf', 'trilhas'] }, ],
    bookings: [ { id: 'B01', guestId: 'G01', roomId: 1, checkIn: '2024-07-28', checkOut: '2024-07-30', numGuests: 2, totalPrice: 500, status: 'Checked-in', source: 'Website', balance: 0, paymentStatus: 'Paid', ratePlanId: 'RP01', guestJourneyId: 'GJ01' }, ],
    reviews: [ { id: 'R01', bookingId: 'B01', guestId: 'G01', guestName: 'Ana Clara', rating: 5, comment: 'Lugar incrível, com certeza voltarei!', date: '2024-07-20', status: 'Approved' }, { id: 'R02', bookingId: 'B02', guestId: 'G02', guestName: 'Bruno Costa', rating: 4, comment: 'Ótima localização para quem surfa.', date: '2024-07-21', status: 'Pending' }, ],
    products: [ { id: 'P001', name: 'Cerveja Artesanal', price: 15, category: 'Comida & Bebida', stock: 50, lowStockThreshold: 10 }, { id: 'P002', name: 'Aluguel Prancha', price: 40, category: 'Aluguel', stock: 10, lowStockThreshold: 2 }, ],
    transactions: [],
    staff: [ { id: 'S01', name: 'Carlos (Super Admin)', role: 'Super Administrador', email: 'carlos.s@hostel.com', password: 'admin', permissions: ['saas_admin', 'subscriptions'] }, { id: 'S02', name: 'Camila (Gerente)', role: 'Gerente', email: 'camila.c@hostel.com', password: 'admin', permissions: ['dashboard', 'calendar', 'rooms', 'bookings', 'guests', 'staff', 'pos', 'financial_manager', 'reports', 'omni_channel', 'internal_chat', 'property_settings', 'projects', 'ai_strategy_consultant', 'management_center'] }, { id: 'S03', name: 'Mariana (Marketing)', role: 'Diretor de Marketing', email: 'mariana.m@hostel.com', password: 'admin', permissions: ['dashboard', 'social_media', 'ad_campaign_manager', 'creative_studio', 'marketing_mix_ai', 'ai_marketing_lab', 'ai_engagement_agent', 'marketing_orchestrator'] }, ],
    staffTasks: [ { id: 'T01', description: 'Verificar limpeza do Quarto 3', status: TaskStatus.TODO, assigneeId: 'S02' }, ],
    chatConversations: [], chatMessages: [], adCampaigns: [], platformConnections: [], socialConnections: [], customAudiences: [], expenses: [], addOns: [],
    ratePlans: [ { id: 'RP01', name: 'Tarifa Padrão', description: 'Tarifa flexível', priceModifier: 0, modifierType: 'fixed', isDefault: true }, ],
    propertyEvents: [], localGuideTips: [], blocks: [], bookingRestrictions: [],
    otaConnections: [ { platform: 'Booking.com', connected: false, propertyId: null, lastSync: null }, { platform: 'Airbnb', connected: false, propertyId: null, lastSync: null }, { platform: 'Expedia', connected: false, propertyId: null, lastSync: null }, ],
    scheduledPosts: [], sharedSpaces: { livingRoomTV: { isOn: false, volume: 25, currentApp: null } }, guestActivities: [], activityParticipants: [], activityComments: [], activityContributions: [],
    siteContent: { hero: { title: 'Sua Aventura Começa Aqui', subtitle: 'O refúgio perfeito entre a mata e o mar em Florianópolis. Viva experiências únicas e conecte-se com a natureza.', imageUrl: 'https://i.imgur.com/pPeG082.jpg' }, whyUs: { title: 'Por que nos amar?', subtitle: 'Somos mais que uma hospedagem, somos seu lar na Ilha da Magia.', items: [ { icon: 'Waves', title: 'Pé na Areia', text: 'A poucos passos da praia de Canasvieiras.' }, { icon: 'Users', title: 'Comunidade', text: 'Conecte-se com viajantes de todo o mundo.' }, { icon: 'Leaf', title: 'Natureza', text: 'Imerso na exuberante Mata Atlântica.' } ] }, about: { title: 'Nossa História', text1: 'Nascemos do sonho de criar um espaço que une conforto, natureza e boas energias.', text2: 'Cada canto do nosso hostel foi pensado para proporcionar momentos inesquecíveis.', imageUrls: ['https://i.imgur.com/S9a2xL0.jpg', 'https://i.imgur.com/KzJt2eA.jpg'] }, experiences: { title: 'Viva o Momento', items: [ { title: 'Aulas de Surf', description: 'Aprenda a surfar com os melhores instrutores locais.', imageUrl: 'https://i.imgur.com/S8y182D.jpg' }, { title: 'Trilhas Guiadas', description: 'Explore as belezas escondidas da ilha.', imageUrl: 'https://i.imgur.com/qE4aP3e.jpg' }, { title: 'Noites de Luau', description: 'Música, fogueira e novas amizades sob as estrelas.', imageUrl: 'https://i.imgur.com/qE4aP3e.jpg' } ] }, facilities: [], cta: { title: 'Sua Cama na Ilha da Magia te Espera!', subtitle: 'Garanta sua vaga no paraíso. As melhores memórias da sua viagem começam aqui.', buttonText: 'Reservar Agora' } },
    themeSettings: { adminPanel: { primaryColor: '#4CAF50', sidebarColor: '#1F2937', backgroundColor: '#F9FAFB', textColor: '#1F2937', logoUrl: 'https://i.imgur.com/uEFOBeo.png', headerTitles: {}, cardBorderRadius: '16px', buttonBorderRadius: '8px' }, guestPortal: { primaryColor: '#4CAF50', backgroundColor: '#F9FAFB', cardColor: '#FFFFFF', textColor: '#1F2937', welcomeTitle: 'Bem-vindo(a) de volta, {guestName}!', welcomeSubtitle: 'Tudo o que você precisa para uma estadia perfeita.', cardTitles: { quickAccess: 'Acesso Rápido', roomControls: 'Controles do Quarto', tvControls: 'Controle da TV (Sala)', services: 'Serviços', communityHub: 'Comunidade' }, cardBorderRadius: '16px', buttonBorderRadius: '8px' }, publicSite: { headerLayout: 'default', searchLayout: 'inline', aboutGalleryLayout: 'grid', experiencesLayout: 'grid', facilitiesLayout: 'grid', footerLayout: 'default', primaryColor: '#4CAF50', backgroundColor: '#F9FAFB', textColor: '#1F2937', cardBackgroundColor: '#FFFFFF', logoHeight: '60px', cardBorderRadius: '16px', buttonBorderRadius: '8px' } },
    publishedWorkSchedule: null, staffPerformanceReviews: {}, onboardingPlans: {}, aiEngagementAgent: { targetAudienceDescription: '', connectedAccount: null, personas: [], isRunning: false, log: [] }, projects: [], shoppingLists: [], mediaLibrary: [], campaignContext: null, managementReport: null, achievements: [], rewards: [], guestPosts: [], loyaltyLevels: [], checkIns: [], synapseChatHistory: [],
    guestJourneys: [ { id: 'GJ01', bookingId: 'B01', guestId: 'G01', status: 'in-stay', satisfactionScore: 85, engagementLevel: 'medium', actionLog: [ { id: 'ACT01', type: 'SEND_MESSAGE', status: 'executed', timestamp: '2024-07-28T10:00:00Z', details: { message: 'Olá Ana, seja bem-vinda!', channel: 'whatsapp' }, justification: 'Mensagem de boas-vindas padrão.' } ] }, ]
};

// --- AI FUNCTIONS ---
const getAi = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY environment variable not set. AI features will be mocked.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};
const mockResponse = (data: any) => { console.log("Using mocked AI response."); return data; }
export const generateImage = async (prompt: string, aspectRatio: string): Promise<{ base64Image: string } | null> => {
    const ai = getAi();
    if (!ai) return mockResponse(null);
    try {
        const response = await ai.models.generateImages({ model: 'imagen-3.0-generate-002', prompt: prompt, config: { numberOfImages: 1, aspectRatio: aspectRatio as any, outputMimeType: 'image/png' }, });
        if (response.generatedImages && response.generatedImages.length > 0) { return { base64Image: response.generatedImages[0].image.imageBytes }; }
        return null;
    } catch (error) { console.error("Error generating image in backend:", error); throw new Error("Failed to generate image."); }
};
export const generateDailyBriefing = async (dbState: DBState): Promise<DailyBriefing> => {
    const ai = getAi();
    if (!ai) return mockResponse({ summary: { title: "Briefing Simulado", points: ["Backend online, API Key ausente."] }, attentionPoints: { title: "Atenção", points: [] }, proactiveSuggestions: { title: "Sugestões", points: [] } });
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: "Gere um briefing diário para um gerente de hostel. Inclua um resumo, pontos de atenção e sugestões proativas. A resposta deve ser em JSON." });
    return JSON.parse(response.text.replace(/```json|```/g, ''));
};
export const generateBusinessDiagnosis = async (dbState: DBState): Promise<BusinessDiagnosis> => mockResponse({ keyInsights: [], crossModuleCorrelations: [], warnings: [] });
export const generateMarketingMixPlan = async (objective: string, budget: number, period: string): Promise<MarketingMixPlan> => mockResponse({ strategicVision: 'Mock vision', budgetSplit: [], phases: [], keyMetrics: [], creativeGuidelines: '' });
export const sendConciergeMessage = async (guestId: string, message: string, db: DBState): Promise<AIConciergeMessage> => {
    const ai = getAi();
    const guest = db.guests.find(g => g.id === guestId);
    if (!guest) throw new Error("Guest not found");
    const userMessage: AIConciergeMessage = { id: `msg_${Date.now()}`, sender: 'user', text: message, timestamp: new Date().toISOString() };
    guest.conciergeChatHistory = [...(guest.conciergeChatHistory || []), userMessage];
    if (!ai) { const mockReply: AIConciergeMessage = { id: `msg_${Date.now()}_agent`, sender: 'agent', text: "Desculpe, meu cérebro está offline (API Key não configurada).", timestamp: new Date().toISOString() }; guest.conciergeChatHistory.push(mockReply); return mockReply; }
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: `O hóspede disse: "${message}". Responda como um concierge de hostel amigável.` });
    const agentReply: AIConciergeMessage = { id: `msg_${Date.now()}_agent`, sender: 'agent', text: response.text, timestamp: new Date().toISOString() };
    guest.conciergeChatHistory.push(agentReply);
    return agentReply;
};
// Other AI function mocks/placeholders...
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
export const executeSynapseCommand = async (command: string, userId: string, userName: string, db: DBState): Promise<void> => { const agentMessage: SynapseMessage = { id: `syn_${Date.now()}`, sender: 'agent', text: `Comando "${command}" recebido, mas a execução real não está implementada.`, timestamp: new Date().toISOString() }; db.synapseChatHistory.push(agentMessage); };


// --- SERVER ---
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
    if (room) { room.status = status as RoomStatus; res.status(200).json(room); } 
    else { res.status(404).send('Room not found'); }
});
app.post('/bookings/new-guest', (req: Request, res: Response) => {
    const { booking, guest: guestData } = req.body;
    const newGuest: Guest = { id: `G${Date.now()}`, ...guestData };
    db.guests.push(newGuest);
    const newBooking: Booking = { id: `B${Date.now()}`, guestId: newGuest.id, ...booking, totalPrice: 200, balance: 0, paymentStatus: 'Paid', status: 'Confirmed' };
    db.bookings.push(newBooking);
    res.status(201).json({ booking: newBooking, guest: newGuest });
});
// Generic AI handler
const handleAiRequest = async (handler: () => Promise<any>, res: Response) => {
    try { const result = await handler(); res.json(result); } 
    catch (error: any) { console.error("AI handler error:", error); res.status(500).json({ message: error.message || "AI service error" }); }
};
// AI routes
app.post('/ai/daily-briefing', (req: Request, res: Response) => handleAiRequest(() => generateDailyBriefing(db), res));
app.post('/ai/generate-image', (req: Request, res: Response) => handleAiRequest(() => generateImage(req.body.prompt, req.body.aspectRatio), res));
app.post('/ai/concierge/:guestId/message', (req: Request, res: Response) => handleAiRequest(() => sendConciergeMessage(req.params.guestId, req.body.message, db), res));
// Add all other AI endpoints here...

// --- Add other simple endpoints ---
// Simple CRUD operations can be added here as needed for functionality.
// Example:
app.post('/reviews/:id/approve', (req, res) => {
    const review = db.reviews.find(r => r.id === req.params.id);
    if(review) {
        review.status = 'Approved';
        res.status(200).json(review);
    } else {
        res.status(404).json({message: 'Review not found'});
    }
});


export default app;
