import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, query, where } from 'firebase/firestore';

export const getUserData = async (userId) => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    // Create a new user document if it doesn't exist
    const userData = {
      totalBalance: 12495,
      monthlySpending: 3250,
      savingsRate: 20,
      budget: {
        groceries: 34,
        transportation: 18,
        shopping: 16,
        other: 29
      },
      goals: [
        {
          id: 1,
          name: 'Emergency Fund',
          current: 5000,
          target: 5000,
          targetDate: 'Jul',
          completed: true
        },
        {
          id: 2,
          name: 'Vacation',
          current: 2500,
          target: 4000,
          targetDate: 'Dec',
          targetYear: '2024',
          completed: false
        }
      ],
      cashFlow: {
        income: [2000, 2100, 1900, 2300, 2400, 2200, 2500, 2600, 2700, 2800, 3000, 3100],
        expenses: [1700, 1800, 1600, 1900, 2000, 1800, 2100, 2200, 2300, 2400, 2600, 2700]
      },
      recommendations: [
        {
          id: 1,
          title: 'Consider investing in moderately risky funds',
          type: 'Moderate',
          icon: 'chart'
        },
        {
          id: 2,
          title: 'You\'re overspending on transportation this month',
          type: 'Warning',
          icon: 'alert'
        },
        {
          id: 3,
          title: 'Try automating your savings',
          type: 'Tip',
          icon: 'piggy-bank'
        }
      ],
      learnArticles: [
        {
          id: 1,
          title: 'How to Build an Emergency Fund',
          icon: 'shield'
        },
        {
          id: 2,
          title: 'Tips for Reducing Debt',
          icon: 'credit-card'
        }
      ]
    };
    
    await setDoc(userRef, userData);
    return userData;
  }
};

export const updateUserData = async (userId, data) => {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, data);
};