import { useAuth } from '@/hooks/useAuth';
import { Opportunity } from './csvParser';

export interface Activity {
  id: string;
  type: 'visit' | 'click';
  opportunityId: string;
  opportunityName: string;
  timestamp: number;
  date: string;
}

export interface UserActivityData {
  userId: string;
  activities: Activity[];
}

const STORAGE_KEY = 'limbolimbo_user_activities';

function generateActivityId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toISOString();
}

function getUserActivitiesFromStorage(): UserActivityData[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading user activities from localStorage:', error);
    return [];
  }
}

function saveUserActivitiesToStorage(data: UserActivityData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user activities to localStorage:', error);
  }
}

function getUserData(userId: string): UserActivityData | undefined {
  const allData = getUserActivitiesFromStorage();
  return allData.find(userData => userData.userId === userId);
}

function updateUserData(userData: UserActivityData): void {
  const allData = getUserActivitiesFromStorage();
  const index = allData.findIndex(data => data.userId === userData.userId);
  
  if (index >= 0) {
    allData[index] = userData;
  } else {
    allData.push(userData);
  }
  
  saveUserActivitiesToStorage(allData);
}

export function trackVisit(opportunity: Opportunity, userId: string): void {
  if (!userId || !opportunity.opp_ID) return;
  
  const activity: Activity = {
    id: generateActivityId(),
    type: 'visit',
    opportunityId: opportunity.opp_ID,
    opportunityName: opportunity.Opportunité,
    timestamp: Date.now(),
    date: formatDate(Date.now())
  };
  
  const userData = getUserData(userId) || { userId, activities: [] };
  userData.activities.unshift(activity); // Ajouter au début (plus récent)
  
  // Limiter à 500 activités maximum pour éviter la surcharge
  if (userData.activities.length > 500) {
    userData.activities = userData.activities.slice(0, 500);
  }
  
  updateUserData(userData);
}

export function trackClick(opportunity: Opportunity, userId: string): void {
  if (!userId || !opportunity.opp_ID) return;
  
  const activity: Activity = {
    id: generateActivityId(),
    type: 'click',
    opportunityId: opportunity.opp_ID,
    opportunityName: opportunity.Opportunité,
    timestamp: Date.now(),
    date: formatDate(Date.now())
  };
  
  const userData = getUserData(userId) || { userId, activities: [] };
  userData.activities.unshift(activity); // Ajouter au début (plus récent)
  
  // Limiter à 500 activités maximum
  if (userData.activities.length > 500) {
    userData.activities = userData.activities.slice(0, 500);
  }
  
  updateUserData(userData);
}

export function getUserActivities(userId: string): Activity[] {
  const userData = getUserData(userId);
  return userData ? userData.activities : [];
}

export function getUserActivitiesByType(userId: string, type: 'visit' | 'click'): Activity[] {
  const activities = getUserActivities(userId);
  return activities.filter(activity => activity.type === type);
}

export function searchUserActivities(userId: string, searchTerm: string): Activity[] {
  const activities = getUserActivities(userId);
  const term = searchTerm.toLowerCase();
  
  return activities.filter(activity =>
    activity.opportunityName.toLowerCase().includes(term) ||
    activity.opportunityId.toLowerCase().includes(term)
  );
}

export function clearUserHistory(userId: string): boolean {
  try {
    const allData = getUserActivitiesFromStorage();
    const filteredData = allData.filter(userData => userData.userId !== userId);
    saveUserActivitiesToStorage(filteredData);
    return true;
  } catch (error) {
    console.error('Error clearing user history:', error);
    return false;
  }
}

export function exportUserActivities(userId: string): string {
  const activities = getUserActivities(userId);
  
  if (activities.length === 0) {
    return JSON.stringify({ message: 'Aucune activité à exporter' }, null, 2);
  }
  
  return JSON.stringify({
    userId,
    exportDate: new Date().toISOString(),
    totalActivities: activities.length,
    activities: activities
  }, null, 2);
}

export function exportUserActivitiesAsCSV(userId: string): string {
  const activities = getUserActivities(userId);
  
  if (activities.length === 0) {
    return 'Aucune activité à exporter';
  }
  
  const headers = ['Date', 'Type', 'ID Opportunité', 'Nom Opportunité', 'Timestamp'];
  const rows = activities.map(activity => [
    new Date(activity.timestamp).toLocaleString('fr-FR'),
    activity.type === 'visit' ? 'Visite' : 'Clic',
    activity.opportunityId,
    activity.opportunityName,
    activity.timestamp.toString()
  ]);
  
  return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Hook pour faciliter l'utilisation dans les composants
export function useUserActivity() {
  const { user } = useAuth();
  
  const userId = user?.id || user?.email || 'anonymous';
  
  return {
    trackVisit: (opportunity: Opportunity) => trackVisit(opportunity, userId),
    trackClick: (opportunity: Opportunity) => trackClick(opportunity, userId),
    getActivities: () => getUserActivities(userId),
    getVisits: () => getUserActivitiesByType(userId, 'visit'),
    getClics: () => getUserActivitiesByType(userId, 'click'),
    searchActivities: (term: string) => searchUserActivities(userId, term),
    clearHistory: () => clearUserHistory(userId),
    exportJSON: () => exportUserActivities(userId),
    exportCSV: () => exportUserActivitiesAsCSV(userId)
  };
}