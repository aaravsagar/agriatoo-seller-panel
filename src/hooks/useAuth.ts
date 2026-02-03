import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { USER_ROLES } from '../config/constants';
import { User } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        // ✅ Fetch Firestore user
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: data.role || USER_ROLES.SELLER, // fallback role
            name: data.name || 'User',
            phone: data.phone || '',
            address: data.address || '',
            pincode: data.pincode || '',
            shopName: data.shopName || '',
            deliveryRadius: data.deliveryRadius || 20,
            coveredPincodes: data.coveredPincodes || [],
            createdAt: data.createdAt?.toDate?.() || new Date(),
            isActive: data.isActive ?? true,
          });
        } else {
          // ✅ User not found in Firestore - only allow pre-registered users
          console.warn('User not registered in database:', firebaseUser.uid);
          setUser(null);
        }
      } catch (err) {
        console.error('Auth error:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};
