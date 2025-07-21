import { Type } from "@google/genai";

export interface Facility {
    id: string;
    icon: string;
    name: string;
    description: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'Ativo' | 'Concluído' | 'Arquivado';
    ownerId: string; // Staff ID
    taskIds: string[];
    createdAt: string;
}

export type SiteContent = {
    hero: {
        title: string;
        subtitle: string;
        imageUrl: string;
    };
    whyUs: {
        title:string;
        subtitle: string;
        items: {
            icon: string;
            title: string;
            text: string;
        }[];
    };
    about: {
        title: string;
        text1: string;
        text2: string;
        imageUrls: string[];
    };
    experiences: {
        title: string;
        items: {
            title: string;
            description: string;
            imageUrl: string;
        }[];
    };
    facilities: Facility[];
    cta: {
        title: string;
        subtitle: string;
        buttonText: string;
    }
}

export type ThemeSettings = {
    adminPanel: {
        primaryColor: string;
        sidebarColor: string;
        backgroundColor: string;
        textColor: string;
        logoUrl: string;
        headerTitles: { [key in AdminSection]?: string };
        cardBorderRadius: string;
        buttonBorderRadius: string;
    };
    guestPortal: {
        primaryColor: string;
        backgroundColor: string;
        cardColor: string;
        textColor: string;
        welcomeTitle: string;
        welcomeSubtitle: string;
        cardTitles: {
            quickAccess: string;
            roomControls: string;
            tvControls: string;
            services: string;
            communityHub: string;
        };
        cardBorderRadius: string;
        buttonBorderRadius: string;
    };
    publicSite: {
        headerLayout: 'default' | 'logo-center';
        searchLayout: 'inline' | 'stacked';
        aboutGalleryLayout: 'grid' | 'carousel-simple';
        experiencesLayout: 'grid' | 'list';
        facilitiesLayout: 'grid' | 'list';
        footerLayout: 'default' | 'multi-column';
        primaryColor: string;
        backgroundColor: string;
        textColor: string;
        cardBackgroundColor: string;
        logoHeight: string;
        cardBorderRadius: string;
        buttonBorderRadius: string;
    };
}

export enum RoomType {
  SHARED_DORM = 'Dormitório Compartilhado',
  PRIVATE_SINGLE = 'Quarto Individual',
  PRIVATE_DOUBLE = 'Quarto Duplo',
  PRIVATE_COUPLE = 'Quarto de Casal',
  PRIVATE_TRIPLE = 'Quarto Triplo',
  PRIVATE_QUAD = 'Quarto Quádruplo',
  PRIVATE_FAMILY = 'Quarto Familiar',
}

export enum RoomStatus {
  AVAILABLE = 'Disponível',
  OCCUPIED = 'Ocupado',
  CLEANING = 'Limpeza',
  MAINTENANCE = 'Manutenção'
}

export interface Bed {
    bedNumber: number;
    bookingId: string | null;
    guestName: string | null;
}

export interface Room {
  id: number;
  name: string;
  type: RoomType;
  capacity: number;
  basePrice: number;
  imageUrl: string;
  amenities: string[];
  status: RoomStatus;
  occupants?: { guestId: string; guestName: string; bookingId: string }[];
  beds?: Bed[];
  lightsOn?: boolean;
  acOn?: boolean;
  acTemp?: number;
  doNotDisturb?: boolean;
}

export interface ItineraryItem {
    id: string; // Unique ID for the itinerary item itself
    date: string; // ISO Date string (YYYY-MM-DD)
    time?: string; // Optional time (HH:MM)
    title: string;
    type: 'tip' | 'activity' | 'event';
    sourceId: string; // ID of the LocalGuideTip or GuestActivity
    icon?: string;
}

export interface Achievement {
    id: string; // e.g., 'ACH_EXPLORER'
    name: string;
    description: string;
    icon: string; // Lucide icon name
}

export interface GuestPost {
    id: string;
    guestId: string;
    guestName: string;
    guestProfilePictureUrl?: string;
    text: string;
    imageUrl?: string;
    timestamp: string;
}

export interface Reward {
    id: string;
    name: string;
    description: string;
    cost: number; // in points
    icon: string;
}

export interface LoyaltyLevel {
    id: string;
    name: string;
    minPoints: number;
    icon: string;
}

export interface CheckIn {
    id: string;
    guestId: string;
    locationId: string; // ID of LocalGuideTip or GuestActivity
    locationName: string;
    locationType: 'tip' | 'activity';
    timestamp: string;
}

export interface AIConciergeMessage {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
    isLoading?: boolean;
}

export interface Guest {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
    password?: string;
    birthDate?: string;
    nationality?: string;
    gender?: 'Masculino' | 'Feminino' | 'Outro' | 'Não informado';
    address?: {
        street: string;
        number: string;
        city: string;
        state: string;
        zip: string;
    };
    profilePictureUrl?: string;
    socials?: {
        instagram?: string;
        facebook?: string;
        twitter?: string;
    };
    interests?: string[]; // e.g., 'surf', 'trilhas', 'gastronomia', 'festa', 'relaxar'
    personalitySummary?: string; // AI-generated summary, e.g., "Aventureiro que ama natureza e esportes."
    theme?: 'light' | 'dark' | 'tropical';
    favoriteTipIds?: string[];
    itinerary?: ItineraryItem[];
    unlockedAchievements?: string[];
    points?: number;
    weeklyPoints?: number;
    lastPostTimestamp?: string;
    conciergeChatHistory?: AIConciergeMessage[];
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface RatePlan {
    id: string;
    name: string;
    description: string;
    priceModifier: number; // Can be positive or negative
    modifierType: 'fixed' | 'percentage';
    isDefault: boolean;
}

export interface Booking {
  id: string;
  guestId: string;
  roomId: number;
  ratePlanId: string;
  checkIn: string;
  checkOut: string;
  numGuests: number;
  totalPrice: number;
  status: 'Confirmed' | 'Pending' | 'Checked-in' | 'Checked-out' | 'Cancelled' | 'Pre-Checked-in';
  source: 'Website' | 'Walk-in' | 'Phone';
  balance: number; // For extra charges from POS
  paymentStatus: 'Paid' | 'Pending';
  reviewId?: string;
  idPhotoUrl?: string;
  signatureUrl?: string;
  rulesAcknowledged?: boolean;
  addOns?: AddOn[];
  guestJourneyId?: string;
}

export interface Staff {
  id: string;
  name: string;
  role: 'Super Administrador' | 'Administrador Geral' | 'Gerente' | 'Diretor de Marketing' | 'Recepção' | 'Limpeza' | 'Manutenção' | 'Financeiro' | 'Jardim';
  email: string;
  password?: string;
  permissions: AdminSection[];
  onboardingCompleted?: boolean;
}

export type User = Guest | Staff;

export interface Review {
    id: string;
    bookingId: string;
    guestId: string;
    guestName: string;
    rating: number;
    comment: string;
    date: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Product {
    id: string;
    name: string;
    price: number;
    category: 'Comida & Bebida' | 'Aluguel' | 'Passeio' | 'Outros';
    stock: number;
    lowStockThreshold: number;
}

export interface SaleItem {
    productId: string;
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface Transaction {
    id: string;
    items: SaleItem[];
    total: number;
    paymentMethod: 'Cartão de Crédito' | 'Dinheiro' | 'Conta do Quarto' | 'PIX' | 'PayPal';
    bookingId?: string;
    guestName: string;
    timestamp: string;
}

export enum TaskStatus {
  TODO = 'A Fazer',
  IN_PROGRESS = 'Em Andamento',
  AWAITING_CHECK = 'Aguardando Verificação',
  DONE = 'Concluído'
}

export interface StaffTask {
  id: string;
  description: string;
  status: TaskStatus;
  assigneeId?: string;
  roomId?: number;
  bookingId?: string;
  supervisorComment?: string;
  projectId?: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    category: 'Luz' | 'Água' | 'Internet' | 'Marketing Digital' | 'Lavanderia' | 'Material de Limpeza' | 'Marketing' | 'Manutenção' | 'Salários' | 'Suprimentos' | 'Contas' | 'Outros';
    date: string;
}

export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    description: string;
    features: AdminSection[];
}

export interface PaymentGatewaySettings {
    stripe: {
        connected: boolean;
        publicKey: string;
        secretKey: string;
    };
    mercadoPago: {
        connected: boolean;
        publicKey: string;
        accessToken: string;
    };
}

export interface PropertyInfo {
    id: string;
    name: string;
    address: string;
    cnpj: string;
    phone: string;
    email: string;
    checkInTime: string;
    checkOutTime: string;
    wifiNetwork: string;
    wifiPass: string;
    rules: string[];
    planId: string;
    subscriptionStatus: 'Ativa' | 'Atrasada' | 'Cancelada';
    paymentGatewaySettings: PaymentGatewaySettings;
}

export interface PropertyEvent {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    imageUrl: string;
    icon: string;
}

export interface LocalGuideTip {
    id: string;
    category: 'Praias' | 'Trilhas' | 'Restaurantes' | 'Passeios' | 'Hostel';
    title: string;
    description: string;
    imageUrl: string;
    icon: string;
}

export interface Block {
    id: string;
    roomId: number;
    startDate: string;
    endDate: string;
    reason: string;
}

export interface BookingRestriction {
    id: string;
    startDate: string; // YYYY-MM-DD
    endDate: string;   // YYYY-MM-DD
    type: 'minStay' | 'minAdvance';
    value: number; // number of nights for minStay, number of days for minAdvance
    name: string; // e.g., "Feriado de Ano Novo"
}

export interface AppNotification {
    id: string;
    type: 'booking' | 'checkin' | 'pos' | 'task' | 'review' | 'guest' | 'chat' | 'success' | 'error' | 'info';
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
    linkTo?: AdminSection;
}

export type AdPlatformString = 'Instagram' | 'Facebook' | 'X' | 'TikTok';

export interface ScheduledPost {
    id: string;
    platform: AdPlatformString;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    status: 'Scheduled' | 'Draft';
    scheduledAt: string; // ISO String
    campaignId?: string;
}

export interface SharedSpaceControls {
    livingRoomTV: {
        isOn: boolean;
        volume: number;
        currentApp: 'Netflix' | 'YouTube' | 'TV Aberta' | null;
    };
}

export interface GuestActivity {
    id: string;
    creatorId: string; // guestId
    creatorName: string;
    title: string;
    description: string;
    date: string; // ISO string for the activity date/time
    maxParticipants?: number;
    crowdfundingTarget?: number;
}

export interface ActivityParticipant {
    activityId: string;
    guestId: string;
    guestName: string;
}

export interface ActivityComment {
    id: string;
    activityId: string;
    guestId: string;
    guestName: string;
    text: string;
    timestamp: string;
}

export interface ActivityContribution {
    activityId: string;
    guestId: string;
    amount: number;
}

export type OTAPlatform = 'Booking.com' | 'Airbnb' | 'Expedia';

export interface OTAConnection {
    platform: OTAPlatform;
    connected: boolean;
    propertyId: string | null;
    lastSync: string | null;
}

export type AdminSection =
  | 'dashboard'
  | 'calendar'
  | 'rooms'
  | 'bookings'
  | 'guests'
  | 'staff'
  | 'team_manager_ai'
  | 'pos'
  | 'financial_manager'
  | 'inventory'
  | 'shopping_list'
  | 'social_media'
  | 'ad_campaign_manager'
  | 'reports'
  | 'omni_channel'
  | 'internal_chat'
  | 'marketing_mix_ai'
  | 'ai_marketing_lab'
  | 'creative_studio'
  | 'ai_strategy_consultant'
  | 'property_settings'
  | 'projects'
  | 'ai_engagement_agent'
  | 'marketing_orchestrator'
  | 'management_center'
  | 'saas_admin'
  | 'subscriptions'
  | 'synapse_agent'
  | 'rate_manager'
  | 'channel_manager'
  | 'my_subscription'
  | 'guest_journey_ai';

export type Page = 'home' | 'booking' | 'register' | 'login' | 'guestPortal' | 'onlineCheckin' | 'admin' | 'staffDashboard' | 'operationalDashboard' | 'forgotPassword' | 'bookingWidget';

export type MessageSource = 'Instagram' | 'Facebook' | 'Website';

export interface ChatConversation {
    id: string;
    guestName: string;
    lastMessage: string;
    source: MessageSource;
    unread: boolean;
    timestamp: string;
    category?: string;
    summary?: string;
    intent?: 'High' | 'Medium' | 'Low';
    isInternal?: boolean;
}

export interface ChatMessage {
    id: string;
    conversationId: string;
    senderId: string; // Can be a guest ID, staff ID, 'AGENT_SYSTEM', or 'GUEST_WEBSITE_...'
    senderName: string; // The name to display for the sender
    text: string;
    timestamp: string;
    isAutoReply?: boolean;
}

export type AdPlatform = 'Google Ads' | 'Meta Ads' | 'TikTok Ads' | 'X Ads';
export type SocialPlatform = 'Facebook' | 'Instagram' | 'Twitter' | 'WhatsApp';

export interface CustomAudience {
    id: string;
    name: string;
    platform: AdPlatform;
    type: 'Interests' | 'Lookalike';
    description: string;
}

export interface PlatformConnection {
    platform: AdPlatform;
    connected: boolean;
    accountName: string | null;
    accountId: string | null;
}

export interface SocialConnection {
    platform: SocialPlatform;
    connected: boolean;
    handleOrNumber: string | null;
}

// --- AI Engagement Agent Types ---
export type SocialMediaPlatform = 'Instagram' | 'Facebook';

export interface EngagementAction {
    actionType: string;
    target: string;
    description: string;
}

export interface Persona {
    name: string;
    age: number;
    location: string;
    interests: string[];
    bio: string;
    engagementRoadmap: EngagementAction[];
}

export interface AIEngagementAgent {
    targetAudienceDescription: string;
    connectedAccount: {
        platform: SocialMediaPlatform;
        accountId: string;
        accountName: string;
        accessToken: string; // This would be encrypted in a real backend
    } | null;
    personas: Persona[];
    isRunning: boolean;
    log: { timestamp: string; message: string; }[];
}

export interface ShoppingListItem {
    id: string;
    name: string;
    category: string;
    status: 'Pendente' | 'Comprado';
    productId?: string; // Links back to a Product for stock receiving
}

export interface ShoppingList {
    id: string;
    name: string;
    status: 'Pendente' | 'Concluída';
    createdAt: string;
    items: ShoppingListItem[];
}

export interface MediaAsset {
    id: string;
    type: 'image' | 'video';
    url: string; // base64 data URL for images, regular URL for videos
    prompt?: string; // If generated by AI
    createdAt: string;
}

export type CampaignGoal = 'Aumentar Reservas' | 'Promover Oferta' | 'Consciência de Marca';

export interface AutomationRule {
    id: string;
    condition: string;
    action: string;
}

export interface Ad {
    id: string;
    name: string;
    status: 'Ativa' | 'Pausada' | 'Em Análise' | 'Rascunho';
    copy: {
        headline: string;
        description: string;
    };
    creativePrompt?: string;
    mediaAssetId?: string;
    creativeUrl?: string;
}

export interface AdSet {
    id: string;
    name: string;
    status: 'Ativa' | 'Pausada' | 'Rascunho';
    audience: {
        name: string;
        description: string;
    };
    kpis: {
        impressions: number;
        clicks: number;
        cost: number;
        conversions: number;
    };
    ads: Ad[];
}

export interface AdCampaign {
    id: string;
    name: string;
    platform: AdPlatform;
    status: 'Ativa' | 'Pausada' | 'Concluída' | 'Rascunho';
    isGeneratedByAI?: boolean;
    adSets: AdSet[];
    rules: AutomationRule[];
}

export interface PlatformBudget {
  platform: AdPlatform;
  percentage: number;
  amount: number;
  justification: string;
}

export interface CampaignPhase {
  phaseName: string;
  duration: string;
  objective: string;
  actions: string[];
  generatedCampaignIds?: string[];
}

export interface MarketingMixPlan {
  strategicVision: string;
  budgetSplit: PlatformBudget[];
  phases: CampaignPhase[];
  keyMetrics: string[];
  creativeGuidelines: string;
}

export interface CampaignContext {
    status: 'idle' | 'planning' | 'generating' | 'complete' | 'error';
    objective: string;
    budget: number;
    period: string;
    plan: MarketingMixPlan | null;
    log: { timestamp: string; message: string; }[];
    error?: string | null;
    generatedCampaigns: AdCampaign[];
}

export interface CampaignPerformanceAnalysis {
    summary: {
        performanceLevel: 'Excelente' | 'Bom' | 'Razoável' | 'Ruim' | 'Crítico';
        text: string;
    };
    insights: {
        text: string;
        type: 'positivo' | 'negativo' | 'neutro';
    }[];
    recommendations: {
        text: string;
        priority: 'Alta' | 'Média' | 'Baixa';
    }[];
}

export interface ManagementReport {
  financialSummary: {
    totalRevenue: number;
    totalExpenses: number;
    netProfit: number;
    keyInsight: string;
  };
  projectStatus: {
    activeProjects: number;
    atRiskProjects: { name: string; reason: string; }[];
  };
  teamPerformance: {
    tasksCompleted: number;
    topPerformer: { name: string; completedTasks: number; };
    keyInsight: string;
  };
  inventoryAlerts: {
    lowStockItems: { name: string; stock: number; }[];
  };
  strategicRecommendations: {
    priority: 'Alta' | 'Média' | 'Baixa';
    recommendation: string;
  }[];
}

export interface SynapseMessage {
    id: string;
    sender: 'user' | 'agent';
    text: string;
    timestamp: string;
    isLoading?: boolean;
}

// --- Guest Journey AI Types ---
export type AIActionType =
    | 'SEND_MESSAGE'
    | 'SUGGEST_ACTIVITY'
    | 'OFFER_UPSELL'
    | 'CREATE_TASK'
    | 'REQUEST_REVIEW';

export interface AIAction {
    id: string;
    type: AIActionType;
    status: 'planned' | 'executed' | 'cancelled';
    timestamp: string;
    details: { [key: string]: any }; // e.g., { message: "Olá!", channel: "whatsapp" }
    justification: string; // Why the AI chose this action
}

export interface GuestJourney {
    id: string;
    bookingId: string;
    guestId: string;
    status: 'pre-arrival' | 'in-stay' | 'post-stay' | 'completed';
    satisfactionScore: number; // 0-100, predicted by AI
    engagementLevel: 'low' | 'medium' | 'high';
    actionLog: AIAction[];
}


export interface DBState {
    properties: PropertyInfo[];
    currentPropertyId: string;
    subscriptionPlans: SubscriptionPlan[];
    rooms: Room[];
    guests: Guest[];
    bookings: Booking[];
    reviews: Review[];
    products: Product[];
    transactions: Transaction[];
    staff: Staff[];
    staffTasks: StaffTask[];
    chatConversations: ChatConversation[];
    chatMessages: ChatMessage[];
    adCampaigns: AdCampaign[];
    platformConnections: PlatformConnection[];
    socialConnections: SocialConnection[];
    customAudiences: CustomAudience[];
    expenses: Expense[];
    addOns: AddOn[];
    ratePlans: RatePlan[];
    propertyEvents: PropertyEvent[];
    localGuideTips: LocalGuideTip[];
    blocks: Block[];
    bookingRestrictions: BookingRestriction[];
    otaConnections: OTAConnection[];
    scheduledPosts: ScheduledPost[];
    sharedSpaces: SharedSpaceControls;
    guestActivities: GuestActivity[];
    activityParticipants: ActivityParticipant[];
    activityComments: ActivityComment[];
    activityContributions: ActivityContribution[];
    siteContent: SiteContent;
    themeSettings: ThemeSettings;
    publishedWorkSchedule: any | null;
    staffPerformanceReviews: Record<string, any>;
    onboardingPlans: Record<string, any>;
    aiEngagementAgent: AIEngagementAgent;
    projects: Project[];
    shoppingLists: ShoppingList[];
    mediaLibrary: MediaAsset[];
    campaignContext: CampaignContext | null;
    managementReport?: ManagementReport | null;
    achievements: Achievement[];
    rewards: Reward[];
    guestPosts: GuestPost[];
    loyaltyLevels: LoyaltyLevel[];
    checkIns: CheckIn[];
    synapseChatHistory: SynapseMessage[];
    guestJourneys: GuestJourney[];
}


// --- AI Marketing Lab Types ---

export interface MarketAnalysis {
    domain: string;
    trafficSources: { source: string; percentage: number }[];
    topKeywords: string[];
    audienceProfile: string;
    seoOpportunities: string[];
}

export interface AdSpy {
    competitorName: string;
    strategy: string;
    exampleAds: {
        headline: string;
        description: string;
        creativeDescription: string;
    }[];
    counterStrategy: string[];
}

export interface CreativeAsset {
    assetType: 'Imagem' | 'Vídeo';
    topic: string;
    imagePrompt?: string;
    textOverlays?: string[];
    videoScript?: { scene: number; description: string; duration: string }[];
    suggestedAudio?: string;
}

export interface GrowthHack {
    title: string;
    description: string;
    difficulty: 'Fácil' | 'Média' | 'Difícil';
}

// --- Creative Studio Types ---
export type CreativePlatform = 'Google Imagen' | 'Google Veo' | 'Google Fonts' | 'Google Trends';

// --- AI Strategy Consultant Types ---
export interface BusinessDiagnosis {
    keyInsights: { insight: string; data: string }[];
    crossModuleCorrelations: { finding: string; implication: string }[];
    warnings: { warning: string; recommendation: string }[];
}

export interface ProfitabilityOpportunity {
    pricingSuggestions: {
        roomType: string;
        newPrice: number;
        period: string;
        reason: string;
    }[];
    packageDeals: {
        dealName: string;
        description: string;
        marketingSuggestion: {
           channel: 'Anúncio no Instagram' | 'Post Orgânico' | 'Campanha de Email';
           headline: string;
           callToAction: string;
       };
    }[];
}

export interface ExpansionSimulation {
    simulationSummary: string;
    estimatedCost: string;
    projectedRevenueIncrease: string;
    estimatedROI: string;
    risksAndConsiderations: string[];
}


// --- Actionable Daily Briefing Types ---
export type BriefingActionType =
  | 'VIEW_BOOKING'
  | 'MODERATE_REVIEW'
  | 'VIEW_CALENDAR'
  | 'CREATE_TASK'
  | 'CREATE_SOCIAL_POST'
  | 'ANALYZE_FINANCIALS'
  | 'OPTIMIZE_PROFITABILITY'
  | 'SIMULATE_EXPANSION';

export interface BriefingAction {
    type: BriefingActionType;
    label: string;
    payload?: { [key: string]: any };
}

export interface AttentionPoint {
    text: string;
    severity: 'High' | 'Medium' | 'Low';
    action?: BriefingAction;
}

export interface ProactiveSuggestion {
    text: string;
    action?: BriefingAction;
}

export interface DailyBriefing {
    summary: {
        title: string;
        points: string[];
    };
    attentionPoints: {
        title: string;
        points: AttentionPoint[];
    };
    proactiveSuggestions: {
        title: string;
        points: ProactiveSuggestion[];
    };
}