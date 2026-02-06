import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit, doc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './useAuth';
import { Order } from '../types';

interface Notification {
  id: string;
  type: 'new_order' | 'order_update' | 'low_stock';
  title: string;
  message: string;
  orderId?: string;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeModals, setActiveModals] = useState<Set<string>>(new Set());
  const [processedOrders, setProcessedOrders] = useState<Set<string>>(new Set());

  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio('/assets/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    } catch (error) {
      console.error('Error creating audio element:', error);
    }
  }, []);

  // Save pending notification to Firestore
  const savePendingNotification = useCallback(async (order: Order) => {
    if (!user) return;

    try {
      const notificationRef = doc(db, 'pendingNotifications', `${user.id}_${order.orderId}`);
      await setDoc(notificationRef, {
        sellerId: user.id,
        orderId: order.orderId,
        orderData: {
          id: order.id,
          orderId: order.orderId,
          customerName: order.customerName,
          totalAmount: order.totalAmount,
          items: order.items,
          status: order.status,
          createdAt: order.createdAt
        },
        timestamp: Date.now(),
        dismissed: false,
        createdAt: new Date()
      });
    } catch (error) {
      console.error('Error saving pending notification:', error);
    }
  }, [user]);

  // Mark notification as dismissed in Firestore
  const dismissNotification = useCallback(async (orderId: string) => {
    if (!user) return;

    try {
      const notificationRef = doc(db, 'pendingNotifications', `${user.id}_${orderId}`);
      await updateDoc(notificationRef, {
        dismissed: true,
        dismissedAt: new Date()
      });
      
      // Remove from active modals
      setActiveModals(prev => {
        const newSet = new Set(prev);
        newSet.delete(orderId);
        return newSet;
      });

      // Remove the modal from DOM
      const modal = document.getElementById(`modal-${orderId}`);
      if (modal) {
        modal.remove();
      }
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  }, [user]);

  const showNotificationModal = useCallback((order: Order, playSound: boolean = true) => {
    // Check if modal already exists for this order
    if (activeModals.has(order.orderId)) {
      return;
    }

    // Add to active modals
    setActiveModals(prev => new Set(prev).add(order.orderId));

    // Play sound if requested
    if (playSound) {
      playNotificationSound();
    }

    // Create and show notification modal
    const modalId = `modal-${order.orderId}`;
    
    // Remove existing modal if any
    const existingModal = document.getElementById(modalId);
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = modalId;
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 notification-modal';
    modal.setAttribute('data-order-id', order.orderId);
    modal.style.backdropFilter = 'blur(4px)';
    
    modal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl" style="animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">New Order Received! 🎉</h3>
            <p class="text-sm text-gray-600">Order ID: ${order.orderId}</p>
          </div>
        </div>
        <div class="mb-4 bg-gray-50 p-4 rounded-lg">
          <p class="text-gray-700 mb-2"><strong>Customer:</strong> ${order.customerName}</p>
          <p class="text-gray-700 mb-2"><strong>Amount:</strong> ₹${order.totalAmount}</p>
          <p class="text-gray-700 mb-2"><strong>Items:</strong> ${order.items?.length || 0} product(s)</p>
          <p class="text-xs text-gray-500 mt-2">Status: ${order.status}</p>
        </div>
        <div class="flex gap-2">
          <button id="dismiss-btn-${order.orderId}" class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium">
            Dismiss
          </button>
          <button id="view-btn-${order.orderId}" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
            View Order
          </button>
        </div>
        <p class="text-xs text-gray-500 text-center mt-3">⚠️ This notification will persist until dismissed</p>
      </div>
    `;

    // Add inline animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes bounce-in {
        0% { opacity: 0; transform: scale(0.3) translateY(-50px); }
        50% { opacity: 1; transform: scale(1.05); }
        70% { transform: scale(0.9); }
        100% { transform: scale(1) translateY(0); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);

    // Add event listeners
    const dismissBtn = document.getElementById(`dismiss-btn-${order.orderId}`);
    const viewBtn = document.getElementById(`view-btn-${order.orderId}`);

    const handleDismiss = async () => {
      await dismissNotification(order.orderId);
    };

    const handleView = async () => {
      // Navigate to order details (you can customize this URL)
      window.location.href = `/orders/${order.orderId}`;
      await dismissNotification(order.orderId);
    };

    dismissBtn?.addEventListener('click', handleDismiss);
    viewBtn?.addEventListener('click', handleView);

    // Prevent closing by clicking backdrop - shake to indicate
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        const modalContent = modal.querySelector('div');
        if (modalContent) {
          modalContent.style.animation = 'shake 0.5s';
          setTimeout(() => {
            modalContent.style.animation = 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          }, 500);
        }
      }
    });

  }, [activeModals, dismissNotification, playNotificationSound]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep only 50 notifications
    setUnreadCount(prev => prev + 1);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, read: true }
          : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  // Load and show pending notifications on app open
  useEffect(() => {
    if (!user || user.role !== 'seller') return;

    const loadPendingNotifications = async () => {
      try {
        const pendingQuery = query(
          collection(db, 'pendingNotifications'),
          where('sellerId', '==', user.id),
          where('dismissed', '==', false),
          orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(pendingQuery);
        
        snapshot.docs.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          
          // Show notification modal for each pending notification
          if (!data.dismissed && data.orderData) {
            const order = {
              ...data.orderData,
              createdAt: data.orderData.createdAt?.toDate ? data.orderData.createdAt.toDate() : new Date(data.orderData.createdAt)
            } as Order;

            // Show modal and play sound for each pending notification
            setTimeout(() => {
              showNotificationModal(order, true);
            }, 100);
            
            // Add to notifications list
            addNotification({
              type: 'new_order',
              title: 'Pending Order',
              message: `Order ${order.orderId} from ${order.customerName} - ₹${order.totalAmount}`,
              orderId: order.orderId
            });
          }
        });

        // Now set up real-time listener for changes
        const unsubscribe = onSnapshot(pendingQuery, (snapshot) => {
          snapshot.docChanges().forEach((change) => {
            const data = change.doc.data();
            
            if (change.type === 'removed' || (change.type === 'modified' && data.dismissed)) {
              // Remove modal if it exists
              const modal = document.getElementById(`modal-${data.orderId}`);
              if (modal) {
                modal.remove();
              }
              setActiveModals(prev => {
                const newSet = new Set(prev);
                newSet.delete(data.orderId);
                return newSet;
              });
            }
          });
        });

        return unsubscribe;
      } catch (error) {
        console.error('Error loading pending notifications:', error);
      }
    };

    loadPendingNotifications();
  }, [user, showNotificationModal, addNotification]);

  // Listen for new orders for sellers
  useEffect(() => {
    if (!user || user.role !== 'seller') return;

    const q = query(
      collection(db, 'orders'),
      where('sellerId', '==', user.id),
      orderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === 'added') {
          const order = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate() || new Date()
          } as Order;

          // Skip if already processed
          if (processedOrders.has(order.orderId)) {
            continue;
          }

          // Check if this notification already exists in Firestore
          try {
            const existingQuery = query(
              collection(db, 'pendingNotifications'),
              where('sellerId', '==', user.id),
              where('orderId', '==', order.orderId)
            );
            
            const existingDocs = await getDocs(existingQuery);

            if (existingDocs.empty) {
              // New order - save as pending notification
              await savePendingNotification(order);
              
              // Mark as processed
              setProcessedOrders(prev => new Set(prev).add(order.orderId));
              
              // Show modal and play sound
              showNotificationModal(order, true);
              
              addNotification({
                type: 'new_order',
                title: 'New Order Received',
                message: `Order ${order.orderId} from ${order.customerName} - ₹${order.totalAmount}`,
                orderId: order.orderId
              });
            } else {
              // Mark as processed to avoid checking again
              setProcessedOrders(prev => new Set(prev).add(order.orderId));
            }
          } catch (error) {
            console.error('Error checking existing notification:', error);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [user, showNotificationModal, addNotification, savePendingNotification, processedOrders]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    playNotificationSound,
    dismissNotification
  };
};