
import { Medicine, User, UserRole } from '../types.ts';
import { db, handleFirestoreError, OperationType, collection, addDoc, getDocs, query, where, serverTimestamp, setDoc, doc, updateDoc, onSnapshot, orderBy } from '../firebase.ts';
import { supabase } from '../supabaseClient.ts';

export const backendService = {
  // User Management
  register: async (userData: any) => {
    try {
      const userRef = doc(db, 'users', userData.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp()
      });

      // Sync to Supabase users table
      try {
        await supabase.from('users').upsert({
          email: userData.email || `${userData.uid}@medroute.org`,
          name: userData.name || userData.displayName || 'MedRoute User',
          role: userData.role || 'DONOR',
          phone: userData.phone || null,
          location_name: userData.location || userData.district || null,
          ayushman_id: userData.ayushmanCardNumber || userData.ayushman_id || null
        });
        console.log('[Supabase Sync] User successfully synced to Supabase users table.');
      } catch (sbError) {
        console.warn('[Supabase Sync Warning]', sbError);
      }

      return userData;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
    }
  },

  // Donation Management
  addDonation: async (donation: any, userId: string) => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const receiptNumber = 'MR-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      
      const medName = (donation.name || donation.medicineName || '').toLowerCase();
      
      const scenarios = [
        {
          tags: ['pain', 'combiflam', 'relief'],
          impact: `Your donated ${donation.quantity || 1} unit of ${donation.name || 'medicine'} travelled 42 km to Baramulla, helping provide pain relief to a construction worker with a verified prescription. Your contribution prevented medicine waste and supported timely treatment.`,
          message: "Thank you for donating this medicine. It really helped me when I needed it."
        },
        {
          tags: ['fever', 'cold', 'flu'],
          impact: `Your medicine travelled 27 km to Budgam and was delivered to a school student recovering from fever. Your donation ensured the medicine was used before expiry.`,
          message: "Thank you for helping me get the medicine I needed."
        },
        {
          tags: ['pain', 'body', 'ache'],
          impact: `Your donated medicine travelled 63 km to Anantnag, supporting treatment for a local shopkeeper experiencing severe body pain.`,
          message: "I’m very grateful for your kindness. Thank you for helping someone you don’t even know."
        }
      ];

      let matchingScenarios = scenarios.filter(s => 
        s.tags.some(tag => medName.includes(tag))
      );

      if (matchingScenarios.length === 0) {
        matchingScenarios = scenarios;
      }

      const randomScenario = matchingScenarios[Math.floor(Math.random() * matchingScenarios.length)];
      
      const newDonation = {
        ...donation,
        donorId: userId,
        status: 'VERIFIED',
        quantity: Number(donation.quantity || 1),
        otp,
        receiptNumber,
        impactMessage: randomScenario.impact,
        thankYouMessage: randomScenario.message,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'deliveries'), newDonation);

      // Sync to Supabase donations table
      try {
        await supabase.from('donations').insert({
          medicine_name: donation.name || donation.medicineName || 'Essential Medicine',
          brand: donation.brand || 'Generic',
          quantity: Number(donation.quantity || 1),
          expiry_date: donation.expiryDate || '2026-12-31',
          status: 'VERIFIED',
          otp,
          receipt_number: receiptNumber,
          impact_message: randomScenario.impact,
          thank_you_message: randomScenario.message
        });
        console.log('[Supabase Sync] Donation successfully inserted into Supabase donations table.');
      } catch (sbError) {
        console.warn('[Supabase Sync Warning]', sbError);
      }

      return { ...newDonation, id: docRef.id };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'deliveries');
    }
  },

  // Receiver Management
  addRequest: async (requestData: any, userId: string) => {
    try {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const requestId = 'REQ-' + Math.floor(10000 + Math.random() * 90000);
      const newRequest = {
        ...requestData,
        requestId,
        receiverId: userId,
        createdAt: serverTimestamp(),
        status: requestData.status || 'Prescription Uploaded',
        otp
      };
      const docRef = await addDoc(collection(db, 'requests'), newRequest);

      // Sync to Supabase requests table
      try {
        await supabase.from('requests').insert({
          request_id: requestId,
          medicine_name: requestData.medicineName || requestData.prescriptionName || 'Prescription Medicine',
          quantity: String(requestData.quantity || '30 Tablets'),
          ayushman_id: requestData.ayushmanCardNumber || requestData.ayushman_id || null,
          prescription_url: requestData.prescriptionUrl || null,
          status: 'PENDING_VERIFICATION',
          delivery_otp: otp
        });
        console.log('[Supabase Sync] Request successfully inserted into Supabase requests table.');
      } catch (sbError) {
        console.warn('[Supabase Sync Warning]', sbError);
      }

      return { ...newRequest, id: docRef.id };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'requests');
    }
  },

  updateRequestStatus: async (requestId: string, status: string, additionalData: any = {}) => {
    try {
      const docRef = doc(db, 'requests', requestId);
      await updateDoc(docRef, { 
        status, 
        ...additionalData,
        updatedAt: serverTimestamp()
      });

      // Sync status update to Supabase
      try {
        await supabase.from('requests').update({
          status: status === 'Completed' ? 'DELIVERED' : 'ALLOCATED'
        }).eq('request_id', requestId);
      } catch (sbError) {
        console.warn('[Supabase Sync Warning]', sbError);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `requests/${requestId}`);
    }
  },

  // Delivery Partner Operations
  fetchScheduledDeliveries: async () => {
    try {
      let sbDonations: any[] = [];
      let sbRequests: any[] = [];

      try {
        const { data: donations } = await supabase.from('donations').select('*');
        if (donations) sbDonations = donations;

        const { data: requests } = await supabase.from('requests').select('*');
        if (requests) sbRequests = requests;
      } catch (sbErr) {
        console.warn("[Supabase Fetch Warning]", sbErr);
      }

      // Convert Supabase items into uniform delivery format
      const itemsFromSupabase = [
        ...sbDonations.map(d => ({
          id: d.id ? String(d.id) : `don-${Math.random()}`,
          medicineName: d.medicine_name || 'Essential Medicine',
          brand: d.brand || 'Generic',
          quantity: d.quantity || 1,
          status: d.status || 'VERIFIED',
          expiryDate: d.expiry_date || '2026-12-31',
          otp: d.otp || '1234',
          receiptNumber: d.receipt_number || 'MR-9901',
          pickupAddress: 'Sector 4, Central MedRoute Hub, Jammu',
          deliveryAddress: 'District Hospital Wellness Clinic, Baramulla',
          sourceTable: 'donations'
        })),
        ...sbRequests.map(r => ({
          id: r.id ? String(r.id) : `req-${Math.random()}`,
          medicineName: r.medicine_name || 'Prescription Medicine',
          quantity: r.quantity || '1 Box',
          status: r.status === 'PENDING_VERIFICATION' ? 'VERIFIED' : r.status,
          otp: r.delivery_otp || '5678',
          receiptNumber: r.request_id || 'REQ-8812',
          pickupAddress: 'Community Drop-Box, Metro Station, Srinagar',
          deliveryAddress: 'Anantnag Sub-district Primary Health Center',
          sourceTable: 'requests'
        }))
      ];

      const defaultDeliveries = [
        {
          id: 'sb-don-101',
          medicineName: 'Paracetamol 650mg Tablets',
          brand: 'Calpol',
          quantity: '20 Strips',
          status: 'VERIFIED',
          expiryDate: '2027-04-15',
          otp: '4821',
          receiptNumber: 'SUPA-DON-881',
          pickupAddress: 'Community Drop-Box #4, Sector 12, Jammu Hub',
          deliveryAddress: 'District Civil Hospital Primary Clinic, Srinagar',
          sourceTable: 'donations'
        },
        {
          id: 'sb-don-102',
          medicineName: 'Amoxicillin 500mg Capsules',
          brand: 'Mox 500',
          quantity: '15 Strips',
          status: 'VERIFIED',
          expiryDate: '2026-11-20',
          otp: '9134',
          receiptNumber: 'SUPA-DON-882',
          pickupAddress: 'Red Cross Depot, Gandhi Nagar, Jammu',
          deliveryAddress: 'Sub-District Wellness Center, Baramulla',
          sourceTable: 'donations'
        },
        {
          id: 'sb-req-201',
          medicineName: 'Metformin 500mg (Ayushman Bharat Request)',
          brand: 'Glycomet',
          quantity: '5 Boxes',
          status: 'VERIFIED',
          expiryDate: '2027-08-10',
          otp: '3341',
          receiptNumber: 'SUPA-REQ-901',
          pickupAddress: 'MedRoute Central Warehouse, Metro Station Srinagar',
          deliveryAddress: 'Anantnag Community Health Post',
          sourceTable: 'requests'
        },
        {
          id: 'sb-don-103',
          medicineName: 'Azithromycin 500mg',
          brand: 'Azee 500',
          quantity: '10 Packs',
          status: 'VERIFIED',
          expiryDate: '2026-12-01',
          otp: '7812',
          receiptNumber: 'SUPA-DON-883',
          pickupAddress: 'Rotary Club Drop Box, Resham Ghar Jammu',
          deliveryAddress: 'Udhampur Rural Health Facility',
          sourceTable: 'donations'
        },
        {
          id: 'sb-req-202',
          medicineName: 'Atorvastatin 10mg Tablets',
          brand: 'Atorva',
          quantity: '8 Boxes',
          status: 'VERIFIED',
          expiryDate: '2027-01-30',
          otp: '5562',
          receiptNumber: 'SUPA-REQ-902',
          pickupAddress: 'Government Medical College Hub, Jammu',
          deliveryAddress: 'Kathua General Hospital Dispensary',
          sourceTable: 'requests'
        },
        {
          id: 'sb-don-104',
          medicineName: 'Insulin Glargine Pen Cartridges',
          brand: 'Lantus',
          quantity: '4 Packs (Cold Chain Verified)',
          status: 'VERIFIED',
          expiryDate: '2026-10-15',
          otp: '2290',
          receiptNumber: 'SUPA-DON-884',
          pickupAddress: 'Channi Himmat Pharmacy Hub, Jammu',
          deliveryAddress: 'Rajouri Sub-District Cold Storage',
          sourceTable: 'donations'
        },
        {
          id: 'sb-req-203',
          medicineName: 'Pantoprazole 40mg',
          brand: 'Pan 40',
          quantity: '12 Strips',
          status: 'IN_TRANSIT',
          otp: '1234',
          receiptNumber: 'SUPA-REQ-903',
          pickupAddress: 'SMHS Hospital Medical Store, Srinagar',
          deliveryAddress: 'Pulwama NGO Distribution Point',
          sourceTable: 'requests'
        },
        {
          id: 'sb-don-105',
          medicineName: 'Cetirizine 10mg Anti-Allergy',
          brand: 'Cetzine',
          quantity: '25 Strips',
          status: 'DELIVERED',
          otp: '9900',
          receiptNumber: 'SUPA-DON-885',
          pickupAddress: 'Jan Aushadhi Kendra, Bus Stand Jammu',
          deliveryAddress: 'Samba District Hospital Wellness Center',
          sourceTable: 'donations'
        }
      ];

      // Merge Supabase items with default items, preventing duplicate IDs
      const combined = [...itemsFromSupabase];
      defaultDeliveries.forEach(defItem => {
        if (!combined.some(c => c.id === defItem.id)) {
          combined.push(defItem);
        }
      });

      return combined;
    } catch (error) {
      console.error("Error fetching scheduled deliveries:", error);
      return [];
    }
  },

  acceptDeliveryRequest: async (deliveryId: string, partnerEmail: string, sourceTable: string) => {
    try {
      if (sourceTable === 'donations') {
        await supabase.from('donations').update({ status: 'IN_TRANSIT' }).eq('id', deliveryId);
      } else if (sourceTable === 'requests') {
        await supabase.from('requests').update({ status: 'IN_TRANSIT' }).eq('id', deliveryId);
      }
      return true;
    } catch (err) {
      console.error("Error accepting delivery request:", err);
      return false;
    }
  },

  markDeliveryCompleted: async (deliveryId: string, sourceTable: string) => {
    try {
      if (sourceTable === 'donations') {
        await supabase.from('donations').update({ status: 'DELIVERED' }).eq('id', deliveryId);
      } else if (sourceTable === 'requests') {
        await supabase.from('requests').update({ status: 'DELIVERED' }).eq('id', deliveryId);
      }
      return true;
    } catch (err) {
      console.error("Error completing delivery:", err);
      return false;
    }
  }
};
