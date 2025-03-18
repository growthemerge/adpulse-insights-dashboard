
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { toast } from 'sonner';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  userProfile: UserProfile | null;
  refreshUserProfile: () => Promise<void>;
}

interface UserProfile {
  email: string;
  organizationId: string | null;
  role: 'admin' | 'user';
  displayName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchUserProfile(user: User) {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        setUserProfile(userDoc.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUserProfile(null);
    }
  }

  async function refreshUserProfile() {
    if (currentUser) {
      await fetchUserProfile(currentUser);
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signup(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create user profile document
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        organizationId: null,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      
      // Create a new organization for the user
      const orgRef = doc(collection(db, 'organizations'));
      await setDoc(orgRef, {
        name: `${email.split('@')[0]}'s Organization`,
        ownerId: user.uid,
        members: [user.uid],
        createdAt: new Date().toISOString()
      });
      
      // Update user with organization
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        organizationId: orgRef.id,
        role: 'admin',
        createdAt: new Date().toISOString()
      });
      
      toast.success('Account created successfully!');
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'Email is already in use. Please log in or use a different email.'
        : 'Failed to create an account. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  }

  async function login(email: string, password: string) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Logged in successfully!');
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = 
        error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' 
          ? 'Invalid email or password.' 
          : 'Failed to log in. Please try again.';
      toast.error(errorMessage);
      throw error;
    }
  }

  async function signOut() {
    try {
      await firebaseSignOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      console.error("Signout error:", error);
      toast.error('Failed to log out. Please try again.');
      throw error;
    }
  }

  async function resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      console.error("Reset password error:", error);
      toast.error('Failed to send password reset email. Please try again.');
      throw error;
    }
  }

  const value = {
    currentUser,
    isLoading,
    signup,
    login,
    signOut,
    resetPassword,
    userProfile,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
