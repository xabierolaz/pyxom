import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

export interface ProgressAnalytics {
  totalUsers: number;
  activeUsers: number;
  completionRates: { [partId: string]: number };
  averageTimeSpent: number;
  popularExercises: { exerciseId: string; completions: number }[];
  userRanking: { userId: string; name: string; points: number }[];
}

export interface UserActivity {
  userId: string;
  action: 'exercise_start' | 'exercise_complete' | 'hint_used' | 'debug_session' | 'solution_viewed';
  exerciseId?: string;
  timestamp: string;
  metadata?: { [key: string]: any };
}

export class AnalyticsService {
  
  // Track user activities
  static async trackActivity(activity: Omit<UserActivity, 'timestamp'>): Promise<void> {
    try {
      await addDoc(collection(db, 'activities'), {
        ...activity,
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }

  // Get platform analytics
  static async getPlatformAnalytics(): Promise<ProgressAnalytics> {
    try {
      // Get all users
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate total and active users (active in last 7 days)
      const totalUsers = users.length;
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const activeUsers = users.filter(user => 
        user.progress?.lastActive && user.progress.lastActive > weekAgo
      ).length;

      // Calculate completion rates by part
      const completionRates: { [partId: string]: number } = {};
      for (let part = 1; part <= 14; part++) {
        const completedCount = users.filter(user => 
          user.progress?.currentPart && user.progress.currentPart >= part
        ).length;
        completionRates[`part${part}`] = totalUsers > 0 ? completedCount / totalUsers : 0;
      }

      // Calculate average time spent
      const totalTimeSpent = users.reduce((sum, user) => 
        sum + (user.progress?.timeSpent || 0), 0
      );
      const averageTimeSpent = totalUsers > 0 ? totalTimeSpent / totalUsers : 0;

      // Get popular exercises
      const completionsQuery = query(collection(db, 'completions'));
      const completionsSnapshot = await getDocs(completionsQuery);
      const exerciseCompletions: { [exerciseId: string]: number } = {};
      
      completionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        const exerciseId = data.exerciseId;
        exerciseCompletions[exerciseId] = (exerciseCompletions[exerciseId] || 0) + 1;
      });

      const popularExercises = Object.entries(exerciseCompletions)
        .map(([exerciseId, completions]) => ({ exerciseId, completions }))
        .sort((a, b) => b.completions - a.completions)
        .slice(0, 10);

      // Get user ranking
      const userRanking = users
        .map(user => ({
          userId: user.id,
          name: user.name,
          points: user.progress?.totalPoints || 0
        }))
        .sort((a, b) => b.points - a.points)
        .slice(0, 20);

      return {
        totalUsers,
        activeUsers,
        completionRates,
        averageTimeSpent,
        popularExercises,
        userRanking
      };
    } catch (error) {
      console.error('Error getting platform analytics:', error);
      throw error;
    }
  }

  // Get user-specific analytics
  static async getUserAnalytics(userId: string) {
    try {
      // Get user data
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      const userData = userDoc.data();

      // Get user activities
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(100)
      );
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activities = activitiesSnapshot.docs.map(doc => doc.data());

      // Get user completions
      const completionsQuery = query(
        collection(db, 'completions'),
        where('userId', '==', userId),
        orderBy('completedAt', 'desc')
      );
      const completionsSnapshot = await getDocs(completionsQuery);
      const completions = completionsSnapshot.docs.map(doc => doc.data());

      // Calculate daily activity
      const dailyActivity: { [date: string]: number } = {};
      activities.forEach(activity => {
        const date = activity.timestamp.split('T')[0];
        dailyActivity[date] = (dailyActivity[date] || 0) + 1;
      });

      // Calculate weekly progress
      const weeklyProgress: { [week: string]: number } = {};
      completions.forEach(completion => {
        if (completion.timestamp) {
          const date = new Date(completion.timestamp);
          const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
          const week = weekStart.toISOString().split('T')[0];
          weeklyProgress[week] = (weeklyProgress[week] || 0) + (completion.points || 0);
        }
      });

      // Calculate streak
      let currentStreak = 0;
      let longestStreak = 0;
      const today = new Date();
      
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        
        if (dailyActivity[dateStr]) {
          currentStreak = i === 0 ? currentStreak + 1 : currentStreak;
          longestStreak = Math.max(longestStreak, currentStreak);
        } else if (i === 0) {
          currentStreak = 0;
        }
      }

      return {
        user: userData,
        activities: activities.slice(0, 20),
        completions: completions.slice(0, 20),
        dailyActivity,
        weeklyProgress,
        currentStreak,
        longestStreak,
        totalActivities: activities.length,
        totalCompletions: completions.length
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }

  // Update user time spent
  static async updateTimeSpent(userId: string, sessionTime: number): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const currentTimeSpent = userDoc.data().progress?.timeSpent || 0;
        await updateDoc(userRef, {
          'progress.timeSpent': currentTimeSpent + sessionTime,
          'progress.lastActive': new Date().toISOString(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error('Error updating time spent:', error);
    }
  }

  // Get leaderboard
  static async getLeaderboard(limit: number = 50) {
    try {
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      
      const leaderboard = usersSnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            points: data.progress?.totalPoints || 0,
            completedExercises: data.progress?.completedExercises?.length || 0,
            currentPart: data.progress?.currentPart || 1,
            joinDate: data.joinDate
          };
        })
        .sort((a, b) => b.points - a.points)
        .slice(0, limit);

      return leaderboard;
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      throw error;
    }
  }

  // Export user data (GDPR compliance)
  static async exportUserData(userId: string) {
    try {
      // Get user document
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.exists() ? userDoc.data() : null;

      // Get user activities
      const activitiesQuery = query(
        collection(db, 'activities'),
        where('userId', '==', userId)
      );
      const activitiesSnapshot = await getDocs(activitiesQuery);
      const activities = activitiesSnapshot.docs.map(doc => doc.data());

      // Get user completions
      const completionsQuery = query(
        collection(db, 'completions'),
        where('userId', '==', userId)
      );
      const completionsSnapshot = await getDocs(completionsQuery);
      const completions = completionsSnapshot.docs.map(doc => doc.data());

      return {
        userData,
        activities,
        completions,
        exportDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }
}

export default AnalyticsService;
