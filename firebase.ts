// In-memory and LocalStorage reactive state store (Zero external dependencies)

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.warn(`[Local Store Info] ${operationType} on ${path}:`, error);
}

// In-Memory Database collections initialization
const STORAGE_KEY = 'medroute_local_db_v2';

const defaultSeedData = {
  users: [
    { id: 'user_donor_1', uid: 'user_donor_1', email: 'demo.donor@medroute.org', name: 'Elegance Donor', role: 'DONOR', createdAt: new Date().toISOString() },
    { id: 'user_receiver_1', uid: 'user_receiver_1', email: 'demo.receiver@medroute.org', name: 'Kashmir Health Center', role: 'RECEIVER', createdAt: new Date().toISOString() },
    { id: 'user_ngo_1', uid: 'user_ngo_1', email: 'demo.ngo@medroute.org', name: 'NGO MedAid Partners', role: 'NGO', createdAt: new Date().toISOString() },
    { id: 'user_gov_1', uid: 'user_gov_1', email: 'gov.official@medroute.gov.in', name: 'J&K Health Department', role: 'ADMIN', createdAt: new Date().toISOString() },
    { id: 'user_delivery_1', uid: 'user_delivery_1', email: 'demo.delivery@medroute.org', name: 'Express Courier India', role: 'DELIVERY', createdAt: new Date().toISOString() },
    { id: 'user_admin_1', uid: 'user_admin_1', email: 'harsheenkour19@gmail.com', name: 'System Admin', role: 'ADMIN', createdAt: new Date().toISOString() }
  ],
  deliveries: [
    {
      id: 'del_1',
      name: 'Metformin 500mg',
      medicineName: 'Metformin 500mg',
      quantity: 30,
      status: 'VERIFIED',
      donorId: 'user_donor_1',
      otp: '8192',
      receiptNumber: 'MR-902814',
      impactMessage: 'Your donated Metformin 500mg travelled 42 km to Kashmir Health Center, helping provide diabetes treatment.',
      thankYouMessage: 'Thank you for your kindness! Medicine received safely.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'del_2',
      name: 'Paracetamol 650mg',
      medicineName: 'Paracetamol 650mg',
      quantity: 15,
      status: 'VERIFIED',
      donorId: 'user_donor_1',
      otp: '4819',
      receiptNumber: 'MR-382910',
      impactMessage: 'Your medicine helped a patient recovering from fever in Budgam district.',
      thankYouMessage: 'Thank you for helping someone in need!',
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString()
    }
  ],
  requests: [
    {
      id: 'req_1',
      requestId: 'MR-20481',
      medicineName: 'Metformin 500mg',
      quantity: '30 Tablets',
      status: 'Pending Verification',
      receiverId: 'user_receiver_1',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'req_2',
      requestId: 'MR-19024',
      medicineName: 'Pantoprazole 40mg',
      quantity: '15 Tablets',
      status: 'Pending Verification',
      receiverId: 'user_receiver_1',
      createdAt: new Date(Date.now() - 7200000).toISOString()
    }
  ]
};

function getLocalStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading localStorage data:', e);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultSeedData));
  return defaultSeedData;
}

function saveLocalStore(data: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('medroute_store_change'));
  } catch (e) {
    console.error('Error saving localStorage data:', e);
  }
}

// Reactive Event Listeners
const listeners: Array<() => void> = [];
if (typeof window !== 'undefined') {
  window.addEventListener('medroute_store_change', () => {
    listeners.forEach(cb => cb());
  });
}

export const db: any = { isLocal: true };
export const auth: any = { currentUser: { uid: 'demo_user', email: 'demo@medroute.org' } };

// Mock Firestore exported functions matching Firebase SDK interface
export const collection = (database: any, name: string) => name;

export const query = (colName: string, ...clauses: any[]) => {
  return { colName, clauses };
};

export const where = (field: string, op: string, value: any) => ({ type: 'where', field, op, value });
export const orderBy = (field: string, dir: string = 'asc') => ({ type: 'orderBy', field, dir });

export const limit = (num: number) => ({ type: 'limit', num });

export const getDocs = async (q: any) => {
  const colName = typeof q === 'string' ? q : q?.colName || 'requests';
  const clauses = q?.clauses || [];

  const store = getLocalStore();
  let records = store[colName] || [];

  clauses.forEach((c: any) => {
    if (c.type === 'where') {
      records = records.filter((r: any) => r[c.field] === c.value);
    }
  });

  const docs = records.map((rec: any) => ({
    id: rec.id,
    data: () => ({
      ...rec,
      createdAt: rec.createdAt ? { toDate: () => new Date(rec.createdAt) } : { toDate: () => new Date() }
    })
  }));

  return { docs };
};

export const onSnapshot = (q: any, callback: (snapshot: any) => void, errorCallback?: any) => {
  const colName = typeof q === 'string' ? q : q?.colName || 'requests';
  const clauses = q?.clauses || [];

  const updateSnapshot = () => {
    const store = getLocalStore();
    let records = store[colName] || [];

    // Apply where filter
    clauses.forEach((c: any) => {
      if (c.type === 'where') {
        records = records.filter((r: any) => r[c.field] === c.value);
      }
    });

    const docs = records.map((rec: any) => ({
      id: rec.id,
      data: () => ({
        ...rec,
        createdAt: rec.createdAt ? { toDate: () => new Date(rec.createdAt) } : { toDate: () => new Date() }
      })
    }));

    callback({ docs });
  };

  updateSnapshot();

  const handleStoreChange = () => updateSnapshot();
  listeners.push(handleStoreChange);

  return () => {
    const idx = listeners.indexOf(handleStoreChange);
    if (idx !== -1) listeners.splice(idx, 1);
  };
};

export const addDoc = async (colName: string, data: any) => {
  const store = getLocalStore();
  if (!store[colName]) store[colName] = [];
  const id = 'id_' + Math.random().toString(36).substr(2, 9);
  const record = { id, ...data, createdAt: new Date().toISOString() };
  store[colName].unshift(record);
  saveLocalStore(store);
  return { id };
};

export const setDoc = async (docRef: any, data: any) => {
  const store = getLocalStore();
  const colName = docRef.colName || 'users';
  const id = docRef.id;
  if (!store[colName]) store[colName] = [];
  
  const existingIdx = store[colName].findIndex((r: any) => r.id === id || r.uid === id);
  if (existingIdx !== -1) {
    store[colName][existingIdx] = { ...store[colName][existingIdx], ...data };
  } else {
    store[colName].unshift({ id, ...data });
  }
  saveLocalStore(store);
};

export const doc = (database: any, colName: string, id: string) => ({ colName, id });

export const getDoc = async (docRef: any) => {
  const store = getLocalStore();
  const colName = docRef.colName || 'users';
  const id = docRef.id;
  const item = (store[colName] || []).find((r: any) => r.id === id || r.uid === id);
  return {
    exists: () => !!item,
    data: () => item
  };
};

export const updateDoc = async (docRef: any, updates: any) => {
  const store = getLocalStore();
  const colName = docRef.colName || 'requests';
  const id = docRef.id;
  if (store[colName]) {
    const item = store[colName].find((r: any) => r.id === id);
    if (item) {
      Object.assign(item, updates, { updatedAt: new Date().toISOString() });
      saveLocalStore(store);
    }
  }
};

export const serverTimestamp = () => new Date().toISOString();

