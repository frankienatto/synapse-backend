import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import PublicView from './components/PublicView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { BookingView } from './components/BookingView';
import RegisterView from './components/RegisterView';
import Login from './components/Login';
import { GuestPortalView } from './components/GuestPortalView';
import OnlineCheckinView from './components/OnlineCheckinView';
import ForgotPasswordView from './components/ForgotPasswordView';
import ToastContainer from './components/ToastContainer';
import * as apiClient from './services/apiClient';
import { eventBus } from './services/eventBus';
import { Loader2 } from 'lucide-react';
import { OperationalDashboard } from './components/OperationalDashboard';
import BookingWidgetView from './components/BookingWidgetView';
import { 
    Guest, 
    Review, 
    Room,
    Booking,
    RoomStatus, 
    StaffTask, 
    TaskStatus,
    Staff,
    Transaction,
    AppNotification,
    Product,
    User,
    Page,
    DBState,
    ChatConversation,
    ChatMessage,
    AdCampaign,
    AdPlatform,
    CampaignPhase,
    MarketingMixPlan,
    CustomAudience,
    Expense,
    RoomType,
    Block,
    ScheduledPost,
    AddOn,
    PropertyInfo,
    SharedSpaceControls,
    GuestActivity,
    ActivityParticipant,
    ActivityComment,
    ActivityContribution,
    SaleItem,
    SiteContent,
    ThemeSettings,
    SocialConnection,
    Project,
    ShoppingListItem,
    Ad,
    MediaAsset,
    SocialMediaPlatform,
    CampaignPerformanceAnalysis,
    ManagementReport,
    SynapseMessage,
    ItineraryItem,
    AIConciergeMessage,
    Facility,
    LocalGuideTip,
    PropertyEvent,
    RatePlan,
    BookingRestriction,
    OTAPlatform,
    PaymentGatewaySettings,
    SubscriptionPlan
} from './types';

interface GuestData {
    fullName: string;
    email: string;
    phone: string;
    cpf: string;
}

interface BookingData {
    roomId: number;
    checkIn: string;
    checkOut: string;
    numGuests: number;
    ratePlanId: string;
    addOnIds: string[];
}

interface ChatData {
    conversations: ChatConversation[];
    messages: ChatMessage[];
}

interface AppSession {
    user: User | null;
    token: string | null;
}

const ThemeStyles: React.FC<{ themeSettings?: ThemeSettings | null }> = ({ themeSettings }) => {
    if (!themeSettings) return null;
    const { publicSite, adminPanel, guestPortal } = themeSettings;
    const styles = `
        :root {
            /* Public Site */
            --ps-primary: ${publicSite.primaryColor};
            --ps-bg: ${publicSite.backgroundColor};
            --ps-text: ${publicSite.textColor};
            --ps-card-bg: ${publicSite.cardBackgroundColor};
            --ps-card-radius: ${publicSite.cardBorderRadius};
            --ps-button-radius: ${publicSite.buttonBorderRadius};

            /* Admin Panel */
            --admin-primary-color: ${adminPanel.primaryColor};
            --admin-sidebar-color: ${adminPanel.sidebarColor};
            --admin-bg-color: ${adminPanel.backgroundColor};
            --admin-text-color: ${adminPanel.textColor};
            --admin-card-radius: ${adminPanel.cardBorderRadius};
            --admin-button-radius: ${adminPanel.buttonBorderRadius};
            
            /* Guest Portal */
            --portal-bg: ${guestPortal.backgroundColor};
            --portal-text: ${guestPortal.textColor};
            --portal-card-bg: ${guestPortal.cardColor};
            --portal-primary: ${guestPortal.primaryColor};
        }

        /* Admin Panel Helper Classes defined globally now */
        .text-brand-green { color: var(--admin-primary-color); }
        .bg-brand-green { background-color: var(--admin-primary-color); }
        .bg-brand-green-dark:hover { filter: brightness(0.9); }
        .border-brand-green { border-color: var(--admin-primary-color); }
        .text-brand-dark { color: var(--admin-text-color); }
        .bg-brand-dark { background-color: var(--admin-text-color); }
        .bg-brand-sidebar { background-color: var(--admin-sidebar-color); }
        
         .btn-primary {
             background-color: var(--admin-primary-color);
             color: white;
             font-weight: bold;
             padding: 0.5rem 1rem;
             border-radius: var(--admin-button-radius, 8px);
        }
         .btn-secondary {
             background-color: #E5E7EB;
             color: #374151;
             font-weight: 600;
             padding: 0.5rem 1rem;
             border-radius: var(--admin-button-radius, 8px);
        }
    `;
    return <style>{styles}</style>;
};

export const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [pageParams, setPageParams] = useState<any>(null);
    const [session, setSession] = useState<AppSession>({ user: null, token: null });
    const [dbState, setDbState] = useState<DBState | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [chatData, setChatData] = useState<ChatData | null>(null);

    const isWidgetMode = window.location.pathname.includes('/widget');
    const currentUser = session.user;

    const refreshData = async () => {
        try {
            const data = await apiClient.getInitialData();
            setDbState(data.db);
            setChatData(data.chat);
            setNotifications(data.notifications);
        } catch (err: any) {
            console.error("Failed to refresh data:", err);
            setError("Não foi possível conectar ao servidor. A aplicação pode não funcionar corretamente.");
            eventBus.emit('new-toast', { type: 'error', title: 'Erro de Conexão', message: 'Não foi possível buscar os dados do servidor.' });
        }
    };

    useEffect(() => {
        const initialLoad = async () => {
            setLoading(true);
            try {
                // On initial load, try to get data. If it fails, it's a critical error.
                const data = await apiClient.getInitialData();
                setDbState(data.db);
                setChatData(data.chat);
                setNotifications(data.notifications);
            } catch (err: any) {
                console.error("Critical error on initial load:", err);
                setError("Falha ao carregar os dados iniciais. Verifique se o servidor está online.");
            } finally {
                setLoading(false);
            }
        };
        initialLoad();
        
        // Setup event bus for frontend-only notifications
        const handleNotification = (data: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
            eventBus.emit('new-toast', data);
        };
        eventBus.on('new-notification', handleNotification);
        
        return () => {
            eventBus.off('new-notification', handleNotification);
        }
    }, []);

    const handleSetPage = (newPage: Page, params: any = null) => {
        setPage(newPage);
        setPageParams(params);
        window.scrollTo(0, 0);
    };
    
    const withApiCall = async (apiCall: Promise<any>, successMessage?: string) => {
        try {
            const result = await apiCall;
            await refreshData();
            if (successMessage) {
                eventBus.emit('new-notification', { type: 'success', title: 'Sucesso', message: successMessage });
            }
            return result;
        } catch (err: any) {
            console.error("API Call failed:", err);
            eventBus.emit('new-notification', { type: 'error', title: 'Erro', message: err.message || 'Ocorreu um erro na operação.' });
            throw err;
        }
    };

    const handleLogin = async (email: string, pass: string): Promise<boolean> => {
        try {
            const result = await apiClient.login(email, pass);
            setSession({ user: result.user, token: result.token });
            if ('role' in result.user) {
                if (['Limpeza', 'Manutenção', 'Jardim'].includes(result.user.role)) {
                    handleSetPage('operationalDashboard');
                } else {
                    handleSetPage('admin');
                }
            } else {
                handleSetPage('guestPortal');
            }
            return true;
        } catch (err) {
            console.error(err);
            throw err; // Re-throw for the login form to catch
        }
    };

    const handleLogout = () => {
        setSession({ user: null, token: null });
        handleSetPage('login');
    };
    
    // All handlers are now wrappers around apiClient calls
    const handleReviewSubmit = (bookingId: string, guest: Guest, rating: number, comment: string) => withApiCall(apiClient.addReview(bookingId, rating, comment), "Avaliação enviada com sucesso.");
    const handleApproveReview = (reviewId: string) => withApiCall(apiClient.approveReview(reviewId));
    const handleRejectReview = (reviewId: string) => withApiCall(apiClient.rejectReview(reviewId));
    const handleRoomStatusChange = (roomId: number, newStatus: RoomStatus) => withApiCall(apiClient.updateRoomStatus(roomId, newStatus));
    const handleTaskStatusChange = (taskId: string) => withApiCall(apiClient.updateTaskStatus(taskId));
    const handleApproveTask = (taskId: string) => withApiCall(apiClient.approveTask(taskId));
    const handleRejectTask = (taskId: string, comment: string) => withApiCall(apiClient.rejectTask(taskId, comment));
    const handleGuestAdd = (guestData: Omit<Guest, 'id'>) => withApiCall(apiClient.addGuest(guestData), "Hóspede adicionado.");
    const handleGuestUpdate = (guestData: Guest) => withApiCall(apiClient.updateGuest(guestData), "Hóspede atualizado.");
    const handleRoomAdd = (roomData: Omit<Room, 'id' | 'status' | 'imageUrl'>) => withApiCall(apiClient.addRoom(roomData), "Quarto adicionado.");
    const handleRoomUpdate = (updatedRoom: Room) => withApiCall(apiClient.updateRoom(updatedRoom), "Quarto atualizado.");
    const handleUpdateRoomBeds = (roomId: number, newBedCount: number) => withApiCall(apiClient.updateRoomBeds(roomId, newBedCount));
    const handleBookingCreate = (data: { booking: BookingData, guest: GuestData }) => withApiCall(apiClient.createBookingWithNewGuest(data), "Reserva criada com sucesso!");
    const handleBookingAdd = (bookingData: Omit<Booking, 'id' | 'totalPrice' | 'balance' | 'paymentStatus' | 'status'>) => withApiCall(apiClient.addBooking(bookingData), "Reserva adicionada.");
    const handleBookingUpdate = (bookingId: string, updates: Partial<Pick<Booking, 'checkIn' | 'checkOut' | 'roomId'>>) => withApiCall(apiClient.updateBookingDetails(bookingId, updates));
    const handleCheckIn = (bookingId: string) => withApiCall(apiClient.handleCheckIn(bookingId), "Check-in realizado.");
    const handleCheckOut = (bookingId: string) => withApiCall(apiClient.handleCheckOut(bookingId), "Check-out realizado.");
    const handleBedAssignment = (bookingId: string, roomId: number, bedNumber: number) => withApiCall(apiClient.assignBed(bookingId, roomId, bedNumber));
    const handleStaffAdd = (staffData: Omit<Staff, 'id'>) => withApiCall(apiClient.addStaff(staffData), "Membro da equipe adicionado.");
    const handleStaffUpdate = (updatedStaff: Staff) => withApiCall(apiClient.updateStaff(updatedStaff), "Membro da equipe atualizado.");
    const handleStaffDelete = (staffId: string) => withApiCall(apiClient.deleteStaff(staffId), "Membro da equipe removido.");
    const handleTaskAdd = (taskData: Omit<StaffTask, 'id' | 'status'>) => withApiCall(apiClient.addTask(taskData), "Tarefa adicionada.");
    const handleTaskUpdate = (task: StaffTask) => withApiCall(apiClient.updateTask(task));
    const handleSale = (transaction: Transaction) => withApiCall(apiClient.addTransaction(transaction), "Venda registrada.");
    const handleProductAdd = (productData: Omit<Product, 'id'>) => withApiCall(apiClient.addProduct(productData), "Produto adicionado.");
    const handleProductUpdate = (product: Product) => withApiCall(apiClient.updateProduct(product), "Produto atualizado.");
    const handleProductDelete = (productId: string) => withApiCall(apiClient.deleteProduct(productId), "Produto removido.");
    const handleAddExpense = (data: Omit<Expense, 'id'>) => withApiCall(apiClient.addExpense(data), "Despesa adicionada.");
    const handleDeleteExpense = (id: string) => withApiCall(apiClient.deleteExpense(id), "Despesa removida.");
    const handleSendMessage = (conversationId: string, text: string, senderId: string, senderName: string) => withApiCall(apiClient.sendMessage(conversationId, text, senderId, senderName));
    const handleMarkConversationAsRead = (conversationId: string) => withApiCall(apiClient.markConversationAsRead(conversationId));
    const handleConnectPlatform = (platform: AdPlatform) => withApiCall(apiClient.generateAdCampaign(platform, 'Aumentar Reservas', '')); // Placeholder for actual connection logic
    const handleCreateAudience = (audienceData: Omit<CustomAudience, 'id'>) => withApiCall(apiClient.generateAdCampaign(audienceData.platform, 'Aumentar Reservas', '')); // Placeholder
    const handleUpdateAd = (campaignId: string, adSetId: string, adId: string, updates: Partial<Ad>) => Promise.resolve(); // Placeholder
    const handleChangeAdCampaignStatus = (campaignId: string, newStatus: AdCampaign['status']) => Promise.resolve(); // Placeholder
    const handleAnalyzeCampaign = (campaignId: string, adSetId: string): Promise<CampaignPerformanceAnalysis | null> => {
        const campaign = dbState?.adCampaigns.find(c => c.id === campaignId);
        const adSet = campaign?.adSets.find(as => as.id === adSetId);
        if (!campaign || !adSet) {
            console.error("Campaign or AdSet not found for analysis");
            return Promise.resolve(null);
        }
        return withApiCall(apiClient.analyzeCampaignPerformance(adSet, campaign), "Análise de campanha gerada.");
    };
    const handleAddBlock = (blockData: Omit<Block, 'id'>) => Promise.resolve(); // Placeholder
    const handleAddScheduledPost = (postData: Omit<ScheduledPost, 'id'>) => withApiCall(apiClient.addScheduledPost(postData));
    const handleUpdateScheduledPost = (postId: string, updates: Partial<ScheduledPost>) => Promise.resolve();
    const handleDeleteScheduledPost = (postId: string) => Promise.resolve();
    const handleAddOnSave = (addOn: Omit<AddOn, 'id'> | AddOn) => withApiCall(apiClient.saveAddOn(addOn));
    const handleAddOnDelete = (id: string) => withApiCall(apiClient.deleteAddOn(id));
    const handleSaveSiteContent = (content: SiteContent) => withApiCall(apiClient.saveSiteContent(content), "Conteúdo do site salvo.");
    const handleSaveThemeSettings = (settings: ThemeSettings) => withApiCall(apiClient.saveThemeSettings(settings), "Tema salvo.");
    const handleSavePropertyEvents = (events: PropertyEvent[]) =>  withApiCall(apiClient.savePropertyEvents(events));
    const handleSaveLocalGuideTips = (tips: LocalGuideTip[]) => withApiCall(apiClient.saveLocalGuideTips(tips));
    const handleSaveFacilities = (facilities: Facility[]) => withApiCall(apiClient.saveFacilities(facilities));
    const handleSaveRatePlan = (plan: Omit<RatePlan, 'id'> | RatePlan) => withApiCall(apiClient.saveRatePlan(plan));
    const handleDeleteRatePlan = (planId: string) => withApiCall(apiClient.deleteRatePlan(planId));
    const handleSaveBookingRestriction = (restriction: Omit<BookingRestriction, 'id'> | BookingRestriction) => withApiCall(apiClient.saveBookingRestriction(restriction));
    const handleDeleteBookingRestriction = (restrictionId: string) => withApiCall(apiClient.deleteBookingRestriction(restrictionId));
    const handleSavePaymentGatewaySettings = (settings: PaymentGatewaySettings) => withApiCall(apiClient.savePaymentGatewaySettings(settings));
    const handlePublishWorkSchedule = (schedule: any) => withApiCall(apiClient.publishWorkSchedule(schedule));
    const handleSaveStaffPerformanceReview = (staffId: string, review: any) => withApiCall(apiClient.saveStaffPerformanceReview(staffId, review));
    const handleSaveOnboardingPlan = (staffId: string, plan: any) => withApiCall(apiClient.saveOnboardingPlan(staffId, plan));
    const handleStartInternalChat = (user1Id: string, user2Id: string) => withApiCall(apiClient.startOrGetInternalChat(user1Id, user2Id));
    const handleSavePlatformConnections = (connections: SocialConnection[]) => withApiCall(apiClient.savePlatformConnections(connections));
    const handleGeneratePersonas = (audienceDescription: string) => withApiCall(apiClient.generatePersonas(audienceDescription));
    const handleCreatePersonaFromAudience = (audience: CustomAudience) => withApiCall(apiClient.createPersonaFromAudience(audience));
    const handleConnectAgentAccount = (platform: SocialMediaPlatform) => withApiCall(apiClient.connectAIEngagementAccount(platform));
    const handleDisconnectAgentAccount = () => withApiCall(apiClient.disconnectAIEngagementAccount());
    const handleRunAgent = () => withApiCall(apiClient.runAIEngagementAgent());
    const handleProjectAdd = (projectData: Omit<Project, 'id' | 'taskIds' | 'createdAt'>) => withApiCall(apiClient.addProject(projectData));
    const handleProjectUpdate = (project: Project) => withApiCall(apiClient.updateProject(project));
    const handleProjectDelete = (projectId: string) => withApiCall(apiClient.deleteProject(projectId));
    const handleAdjustStock = (productId: string, newStock: number) => withApiCall(apiClient.adjustStock(productId, newStock));
    const handleAddShoppingListItem = (itemData: Omit<ShoppingListItem, 'id'|'status'>) => withApiCall(apiClient.addShoppingListItem(itemData));
    const handleUpdateShoppingListItemStatus = (itemId: string, status: "Pendente" | "Comprado") => withApiCall(apiClient.updateShoppingListItemStatus(itemId, status));
    const handleReceiveStock = (items: { productId: string; quantity: number }[]) => withApiCall(apiClient.receiveStock(items));
    const handleAddMediaAsset = (assetData: Omit<MediaAsset, 'id' | 'createdAt'>) => withApiCall(apiClient.addMediaAsset(assetData));
    const handleDeleteMediaAsset = (assetId: string) => withApiCall(apiClient.deleteMediaAsset(assetId));
    const handleRunMarketingOrchestration = (objective: string, budget: number, period: string) => withApiCall(apiClient.generateMarketingMixPlan(objective, budget, period));
    const handleGetManagementReport = (): Promise<ManagementReport | null> => withApiCall(apiClient.getManagementReport());
    const handleSendSynapseCommand = (command: string) => { if (!currentUser) return Promise.resolve(); return withApiCall(apiClient.sendSynapseCommand(command, currentUser.id, 'name' in currentUser ? currentUser.name : currentUser.fullName)); };
    const handleAddProperty = (propertyData: Omit<PropertyInfo, 'id'>) => withApiCall(apiClient.addProperty(propertyData));
    const handleUpdateProperty = (propertyData: PropertyInfo) => withApiCall(apiClient.updateProperty(propertyData), "Informações da propriedade salvas.");
    const handleCompleteOnboarding = (staffId: string) => withApiCall(apiClient.completeOnboarding(staffId));
    const handleConnectOTA = (platform: OTAPlatform, propertyId: string) => withApiCall(apiClient.connectOTA(platform, propertyId));
    const handleDisconnectOTA = (platform: OTAPlatform) => withApiCall(apiClient.disconnectOTA(platform));
    const handleChangeSubscriptionPlan = (propertyId: string, newPlanId: string) => withApiCall(apiClient.changeSubscriptionPlan(propertyId, newPlanId));
    const handleSaveSubscriptionPlan = (plan: Omit<SubscriptionPlan, 'id'> | SubscriptionPlan) => withApiCall(apiClient.saveSubscriptionPlan(plan));
    const handleDeleteSubscriptionPlan = (planId: string) => withApiCall(apiClient.deleteSubscriptionPlan(planId));
    const handleUpdateRoomControls = (roomId: number, controls: Partial<Pick<Room, 'lightsOn' | 'acOn' | 'acTemp' | 'doNotDisturb'>>) => withApiCall(apiClient.updateRoomControls(roomId, controls));
    const handleRequestService = (bookingId: string, serviceType: 'Limpeza' | 'Manutenção', details: string) => withApiCall(apiClient.requestService(bookingId, serviceType, details));
    const handleUpdateProfile = (guestId: string, updates: Partial<Guest>) => withApiCall(apiClient.updateGuest({ id: guestId, ...updates } as Guest));
    const handleAcknowledgeRules = (bookingId: string) => withApiCall(apiClient.acknowledgeRules(bookingId));
    const handlePayBalance = (bookingId: string) => withApiCall(apiClient.payBalance(bookingId));
    const handleUpdateLivingRoomTV = (updates: Partial<SharedSpaceControls['livingRoomTV']>) => Promise.resolve();
    const handlePlaceRoomServiceOrder = (bookingId: string, items: SaleItem[]) => withApiCall(apiClient.placeRoomServiceOrder(bookingId, items));
    const handleStartReceptionChat = (guestId: string) => withApiCall(apiClient.startOrGetInternalChat(guestId, ''));
    const handleStartGuestChat = (guest1Id: string, guest2Id: string) => withApiCall(apiClient.startOrGetInternalChat(guest1Id, guest2Id));
    const handleCreateGuestActivity = (activityData: Omit<GuestActivity, 'id'>) => Promise.resolve();
    const handleUpdateGuestActivity = (activityData: GuestActivity) => Promise.resolve();
    const onDeleteGuestActivity = (activityId: string) => Promise.resolve();
    const onJoinGuestActivity = (activityId: string, guestId: string, guestName: string) => Promise.resolve();
    const onLeaveGuestActivity = (activityId: string, guestId: string) => Promise.resolve();
    const onAddActivityComment = (activityId: string, guestId: string, guestName: string, text: string) => Promise.resolve();
    const onMakeActivityContribution = (activityId: string, guestId: string, amount: number) => Promise.resolve();
    const onToggleFavoriteTip = (guestId: string, tipId: string) => Promise.resolve();
    const onUpdateItinerary = (guestId: string, itinerary: ItineraryItem[]) => withApiCall(apiClient.updateGuestItinerary(guestId, itinerary));
    const onUnlockAchievement = (guestId: string, achievementId: string) => Promise.resolve();
    const onRedeemReward = (guestId: string, rewardId: string) => Promise.resolve();
    const onAddGuestPost = (guestId: string, text: string, imageUrl?: string) => Promise.resolve();
    const onMakeCheckIn = (guestId: string, locationId: string, locationType: 'tip' | 'activity') => Promise.resolve();
    const onSendConciergeMessage = (guestId: string, message: string) => withApiCall(apiClient.sendConciergeMessage(guestId, message));

    const handleStartChat = (name: string, firstMessage: string) => {
        return withApiCall(apiClient.startWebsiteConversation(name, firstMessage));
    };

    const handleCheckinSubmit = async (bookingId: string, idPhotoUrl: string, signatureUrl: string) => {
        await withApiCall(apiClient.submitOnlineCheckin(bookingId, idPhotoUrl, signatureUrl), "Check-in online enviado com sucesso!");
        handleSetPage('guestPortal');
    };

    const renderPage = () => {
        if (isWidgetMode) {
            return dbState ? <BookingWidgetView db={dbState} onBookingCreate={handleBookingCreate} /> : null;
        }
        
        switch (page) {
            case 'home':
                return <PublicView setPage={handleSetPage} db={dbState!} chatData={chatData!} onStartChat={handleStartChat} onSendMessage={handleSendMessage}/>;
            case 'booking':
                return <BookingView setPage={handleSetPage} initialParams={pageParams} db={dbState!} onBookingCreate={handleBookingCreate}/>;
            case 'register':
                return <RegisterView setPage={handleSetPage} onRegister={handleGuestAdd} />;
            case 'login':
                return <Login setPage={handleSetPage} handleLogin={handleLogin} />;
            case 'guestPortal':
                return currentUser && 'fullName' in currentUser ? <GuestPortalView 
                    currentUser={currentUser} 
                    db={dbState!} 
                    chatData={chatData!} 
                    setPage={handleSetPage}
                    onUpdateRoomControls={handleUpdateRoomControls}
                    onRequestService={handleRequestService}
                    onUpdateProfile={handleUpdateProfile}
                    onReviewSubmit={handleReviewSubmit}
                    onAcknowledgeRules={handleAcknowledgeRules}
                    onPayBalance={handlePayBalance}
                    onUpdateLivingRoomTV={handleUpdateLivingRoomTV}
                    onPlaceRoomServiceOrder={handlePlaceRoomServiceOrder}
                    onStartReceptionChat={handleStartReceptionChat}
                    onStartGuestChat={handleStartGuestChat}
                    onSendMessage={handleSendMessage}
                    onCreateGuestActivity={handleCreateGuestActivity as any}
                    onUpdateGuestActivity={handleUpdateGuestActivity as any}
                    onDeleteGuestActivity={onDeleteGuestActivity as any}
                    onJoinGuestActivity={onJoinGuestActivity as any}
                    onLeaveGuestActivity={onLeaveGuestActivity as any}
                    onAddActivityComment={onAddActivityComment as any}
                    onMakeActivityContribution={onMakeActivityContribution as any}
                    onToggleFavoriteTip={onToggleFavoriteTip as any}
                    onUpdateItinerary={onUpdateItinerary}
                    onUnlockAchievement={onUnlockAchievement as any}
                    onRedeemReward={onRedeemReward as any}
                    onAddGuestPost={onAddGuestPost as any}
                    onMakeCheckIn={onMakeCheckIn as any}
                    onSendConciergeMessage={onSendConciergeMessage}
                /> : <Login setPage={handleSetPage} handleLogin={handleLogin} />;
            case 'onlineCheckin':
                const bookingForCheckin = dbState?.bookings.find(b => b.id === pageParams?.bookingId);
                const guestForCheckin = bookingForCheckin ? dbState?.guests.find(g => g.id === bookingForCheckin.guestId) : null;
                return bookingForCheckin && guestForCheckin ? <OnlineCheckinView booking={bookingForCheckin} guest={guestForCheckin} onCheckinSubmit={handleCheckinSubmit} setPage={handleSetPage}/> : <div>Reserva não encontrada.</div>;
            case 'admin':
                return currentUser && 'role' in currentUser ? <AdminDashboard 
                    currentUser={currentUser}
                    db={dbState!}
                    notifications={notifications}
                    chatData={chatData!}
                    onLogout={handleLogout}
                    onMarkNotificationAsRead={(id) => setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))}
                    onMarkAllNotificationsAsRead={() => setNotifications(notifications.map(n => ({...n, read: true})))}
                    onRoomStatusChange={handleRoomStatusChange}
                    onTaskStatusChange={handleTaskStatusChange}
                    onGuestAdd={handleGuestAdd}
                    onGuestUpdate={handleGuestUpdate}
                    onRoomAdd={handleRoomAdd}
                    onRoomUpdate={handleRoomUpdate}
                    onBookingAdd={handleBookingAdd}
                    onBookingUpdate={handleBookingUpdate}
                    onStaffAdd={handleStaffAdd}
                    onStaffUpdate={handleStaffUpdate}
                    onStaffDelete={handleStaffDelete}
                    onTaskAdd={handleTaskAdd}
                    onTaskUpdate={handleTaskUpdate}
                    onSale={handleSale}
                    onProductAdd={handleProductAdd}
                    onProductUpdate={handleProductUpdate}
                    onProductDelete={handleProductDelete}
                    onSendMessage={handleSendMessage}
                    onMarkConversationAsRead={handleMarkConversationAsRead}
                    onConnectPlatform={handleConnectPlatform}
                    onApplyABTest={async () => {}}
                    onApplyRule={async () => {}}
                    onCreateAudience={handleCreateAudience}
                    onUpdateAd={handleUpdateAd}
                    onChangeAdCampaignStatus={handleChangeAdCampaignStatus}
                    onAnalyzeCampaign={handleAnalyzeCampaign}
                    onAddExpense={handleAddExpense}
                    onDeleteExpense={handleDeleteExpense}
                    onAddBlock={handleAddBlock}
                    onAddScheduledPost={handleAddScheduledPost}
                    onUpdateScheduledPost={handleUpdateScheduledPost}
                    onDeleteScheduledPost={handleDeleteScheduledPost}
                    onAddOnSave={handleAddOnSave}
                    onAddOnDelete={handleAddOnDelete}
                    onBedAssignment={handleBedAssignment}
                    onUpdateRoomBeds={handleUpdateRoomBeds}
                    onSaveSiteContent={handleSaveSiteContent}
                    onSaveThemeSettings={handleSaveThemeSettings}
                    onSavePropertyEvents={handleSavePropertyEvents}
                    onSaveLocalGuideTips={handleSaveLocalGuideTips}
                    onSaveFacilities={handleSaveFacilities}
                    onSaveRatePlan={handleSaveRatePlan}
                    onDeleteRatePlan={handleDeleteRatePlan}
                    onSaveBookingRestriction={handleSaveBookingRestriction}
                    onDeleteBookingRestriction={handleDeleteBookingRestriction}
                    onSavePaymentGatewaySettings={handleSavePaymentGatewaySettings}
                    onApproveReview={handleApproveReview}
                    onRejectReview={handleRejectReview}
                    onApproveTask={handleApproveTask}
                    onRejectTask={handleRejectTask}
                    onPublishWorkSchedule={handlePublishWorkSchedule}
                    onSaveStaffPerformanceReview={handleSaveStaffPerformanceReview}
                    onSaveOnboardingPlan={handleSaveOnboardingPlan}
                    onStartInternalChat={handleStartInternalChat}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                    onSavePlatformConnections={handleSavePlatformConnections}
                    onGeneratePersonas={handleGeneratePersonas}
                    onCreatePersonaFromAudience={handleCreatePersonaFromAudience}
                    onConnectAgentAccount={handleConnectAgentAccount}
                    onDisconnectAgentAccount={handleDisconnectAgentAccount}
                    onRunAgent={handleRunAgent}
                    onProjectAdd={handleProjectAdd}
                    onProjectUpdate={handleProjectUpdate}
                    onProjectDelete={handleProjectDelete}
                    onAdjustStock={handleAdjustStock}
                    onAddShoppingListItem={handleAddShoppingListItem}
                    onUpdateShoppingListItemStatus={handleUpdateShoppingListItemStatus}
                    onReceiveStock={handleReceiveStock}
                    onAddMediaAsset={handleAddMediaAsset}
                    onDeleteMediaAsset={handleDeleteMediaAsset}
                    onRunMarketingOrchestration={handleRunMarketingOrchestration}
                    onGetManagementReport={handleGetManagementReport}
                    synapseChatHistory={dbState?.synapseChatHistory || []}
                    onSendSynapseCommand={handleSendSynapseCommand}
                    onAddProperty={handleAddProperty}
                    onUpdateProperty={handleUpdateProperty}
                    onCompleteOnboarding={handleCompleteOnboarding}
                    onConnectOTA={handleConnectOTA}
                    onDisconnectOTA={handleDisconnectOTA}
                    onChangeSubscriptionPlan={handleChangeSubscriptionPlan}
                    onSaveSubscriptionPlan={handleSaveSubscriptionPlan}
                    onDeleteSubscriptionPlan={handleDeleteSubscriptionPlan}
                /> : <Login setPage={handleSetPage} handleLogin={handleLogin} />;
            case 'operationalDashboard':
                return currentUser && 'role' in currentUser ? <OperationalDashboard 
                    db={dbState!} 
                    currentUser={currentUser} 
                    notifications={notifications}
                    onTaskStatusChange={handleTaskStatusChange} 
                    onStartManagerChat={(staffId) => handleStartInternalChat(staffId, 'S01')}
                    onSendMessage={handleSendMessage}
                    chatData={chatData!}
                    onLogout={handleLogout}
                /> : <Login setPage={handleSetPage} handleLogin={handleLogin} />;
            case 'forgotPassword':
                return <ForgotPasswordView setPage={handleSetPage} />;
            default:
                return <PublicView setPage={handleSetPage} db={dbState!} chatData={chatData!} onStartChat={handleStartChat} onSendMessage={handleSendMessage}/>;
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
                <Loader2 className="h-12 w-12 animate-spin text-brand-green" />
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-red-50 p-4">
                <div className="text-center text-red-700">
                    <h1 className="text-2xl font-bold">Erro Crítico</h1>
                    <p>{error}</p>
                </div>
            </div>
        );
    }
    
    return (
        <>
            <ThemeStyles themeSettings={dbState?.themeSettings || null} />
            <div className="font-sans">
                {!isWidgetMode && !['login', 'register', 'forgotPassword', 'admin', 'operationalDashboard'].includes(page) && dbState?.themeSettings &&
                    <Header page={page} setPage={handleSetPage} currentUser={currentUser} logout={handleLogout} themeSettings={dbState!.themeSettings} />
                }
                {dbState && chatData && renderPage()}
            </div>
            <ToastContainer />
        </>
    );
};