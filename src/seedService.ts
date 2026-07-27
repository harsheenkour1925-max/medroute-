
import { db, handleFirestoreError, OperationType, doc, setDoc, serverTimestamp, collection, addDoc } from '../firebase.ts';
import { UserRole } from '../types.ts';

export const seedDemoData = async () => {
  console.log("Starting database seeding...");

  const mockUsers = [
    { uid: 'seed_donor_1', email: 'donor1@example.com', name: 'Dr. Aarav Sharma', role: UserRole.DONOR },
    { uid: 'seed_donor_2', email: 'donor2@example.com', name: 'Clinical Care Pharmacy', role: UserRole.DONOR },
    { uid: 'seed_receiver_1', email: 'receiver1@example.com', name: 'Amit Verma', role: UserRole.RECEIVER },
    { uid: 'seed_receiver_2', email: 'receiver2@example.com', name: 'Sunita Devi', role: UserRole.RECEIVER },
    { uid: 'seed_ngo_1', email: 'ngo1@example.com', name: 'Health For All NGO', role: UserRole.NGO },
    { uid: 'seed_delivery_1', email: 'delivery1@example.com', name: 'Speedy Med Logistics', role: UserRole.DELIVERY },
  ];

  try {
    // 1. Seed Users
    for (const u of mockUsers) {
      await setDoc(doc(db, 'users', u.uid), {
        email: u.email,
        name: u.name,
        role: u.role,
        createdAt: serverTimestamp()
      });
    }

    // 2. Seed Deliveries
    const mockDeliveries = [
      {
        medicineName: 'Metformin 500mg',
        quantity: '20 Strips',
        status: 'DELIVERED',
        donorId: 'seed_donor_1',
        receiverId: 'seed_receiver_1',
        deliveryPartnerId: 'seed_delivery_1',
        scheduledDate: serverTimestamp(),
        createdAt: serverTimestamp()
      },
      {
        medicineName: 'Amoxicillin 250mg',
        quantity: '15 Bottles',
        status: 'IN_TRANSIT',
        donorId: 'seed_donor_2',
        receiverId: 'seed_ngo_1',
        deliveryPartnerId: 'seed_delivery_1',
        scheduledDate: serverTimestamp(),
        createdAt: serverTimestamp()
      },
      {
        medicineName: 'Aspirin 100mg',
        quantity: '50 Strips',
        status: 'SCHEDULED',
        donorId: 'seed_donor_1',
        receiverId: 'seed_receiver_2',
        createdAt: serverTimestamp()
      }
    ];

    for (const d of mockDeliveries) {
      await addDoc(collection(db, 'deliveries'), d);
    }

    console.log("Seeding completed successfully!");
    return true;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "seed_data");
    return false;
  }
};
