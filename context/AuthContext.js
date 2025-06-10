// context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        setUser({
          uid: user.uid,
          email: user.email,
          role: userData?.role || 'freelancer',
          fullName: userData?.fullName || '',
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, password) => {
    setLoading(true);
    
    return auth.signInWithEmailAndPassword(email, password)
      .then(async (userCredential) => {
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        const userData = userDoc.data();

        setUser({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          role: userData?.role || 'freelancer',
          fullName: userData?.fullName || '',
        });
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        throw error;
      });
  };

  const signup = async (email, password, role, fullName) => {
    setLoading(true);
    
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      
      // Create user document in Firestore with all user data
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        role: role,
        fullName: fullName,
        createdAt: new Date(),
      });

      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        role: role,
        fullName: fullName,
      });
      
      setLoading(false);
      return userCredential.user; // Return the user object if needed
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await auth.signOut();
      setUser(null);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  } ;
  
  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};