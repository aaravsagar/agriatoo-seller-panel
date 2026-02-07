import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
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

        // Try to fetch user by Firebase UID first
        const userRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          // User found with Firebase UID as document ID
          const data = userSnap.data();

          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            role: data.role || USER_ROLES.SELLER,
            name: data.name || 'User',
            phone: data.phone || '',
            address: data.address || '',
            pincode: data.pincode || '',
            shopName: data.shopName || '',
            deliveryRadius: data.deliveryRadius || 20,
            coveredPincodes: data.coveredPincodes || [],
            createdAt: data.createdAt?.toDate?.() || new Date(),
            isActive: data.isActive ?? true,
            upiId: data.upiId || '',
          });
        } else {
          // User not found by UID - search by email
          // This handles cases where old custom IDs exist
          const usersRef = collection(db, 'users');
          const q = query(usersRef, where('email', '==', firebaseUser.email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Found user by email
            const userDoc = querySnapshot.docs[0];
            const data = userDoc.data();

            // Check if this is an old unmigrated account
            if (data.authCreated === false || data.migrated === true) {
              console.warn('User account needs migration. Please log out and log in again.');
              setUser(null);
              await auth.signOut();
              setLoading(false);
              return;
            }

            setUser({
              id: userDoc.id,
              email: firebaseUser.email || '',
              role: data.role || USER_ROLES.SELLER,
              name: data.name || 'User',
              phone: data.phone || '',
              address: data.address || '',
              pincode: data.pincode || '',
              shopName: data.shopName || '',
              deliveryRadius: data.deliveryRadius || 20,
              coveredPincodes: data.coveredPincodes || [],
              createdAt: data.createdAt?.toDate?.() || new Date(),
              isActive: data.isActive ?? true,
              upiId: data.upiId || '',
            });
          } else {
            // User not found in Firestore at all
            console.warn('User not registered in database:', firebaseUser.uid);
            setUser(null);
            await auth.signOut(); // Sign out unauthorized users
          }
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