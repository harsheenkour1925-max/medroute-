
export interface Node {
  id: string;
  name: string;
  x?: number;
  y?: number;
  lat?: number;
  lng?: number;
  type?: 'DONOR' | 'HUB' | 'WAREHOUSE' | 'RECEIVER';
  inventory?: Array<{ name: string; quantity: number }>;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
}

export const dijkstra = (nodes: Node[], edges: Edge[], startNodeId: string, endNodeId: string) => {
  const distances: { [key: string]: number } = {};
  const previous: { [key: string]: string | null } = {};
  const queue: string[] = [];

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    queue.push(node.id);
  });

  distances[startNodeId] = 0;

  while (queue.length > 0) {
    // Sort queue by distance
    queue.sort((a, b) => distances[a] - distances[b]);
    const u = queue.shift()!;

    if (u === endNodeId) break;

    const neighbors = edges.filter(e => e.from === u || e.to === u);
    neighbors.forEach(edge => {
      const v = edge.from === u ? edge.to : edge.from;
      if (queue.includes(v)) {
        const alt = distances[u] + edge.weight;
        if (alt < distances[v]) {
          distances[v] = alt;
          previous[v] = u;
        }
      }
    });
  }

  const path: string[] = [];
  let curr: string | null = endNodeId;
  while (curr !== null) {
    path.unshift(curr);
    curr = previous[curr];
  }

  return {
    path: path.length > 1 ? path : [],
    distance: distances[endNodeId]
  };
};

// Expanded map data for MedRoute network
export const medRouteMap = {
  nodes: [
    { id: 'DONOR_LOC', name: 'Donor Location', x: 10, y: 10, lat: 34.08, lng: 74.80, type: 'DONOR', inventory: [{ name: 'metformin', quantity: 100 }, { name: 'paracetamol', quantity: 50 }] },
    { id: 'HUB_1', name: 'Srinagar Hub', x: 30, y: 40, lat: 34.0837, lng: 74.7973, type: 'HUB', inventory: [{ name: 'metformin', quantity: 60 }, { name: 'pantoprazole', quantity: 30 }] },
    { id: 'HUB_2', name: 'Budgam Hub', x: 50, y: 20, lat: 34.0150, lng: 74.7170, type: 'HUB', inventory: [{ name: 'amlodipine', quantity: 40 }] },
    { id: 'WAREHOUSE', name: 'Central Warehouse', x: 70, y: 50, lat: 33.7311, lng: 75.1492, type: 'WAREHOUSE', inventory: [{ name: 'combiflam', quantity: 100 }] },
    { id: 'RECEIVER_LOC', name: 'Receiver Location', x: 90, y: 80, lat: 34.02, lng: 74.82, type: 'RECEIVER', inventory: [] }
  ] as Node[],
  edges: [
    { from: 'DONOR_LOC', to: 'HUB_1', weight: 12 },
    { from: 'DONOR_LOC', to: 'HUB_2', weight: 18 },
    { from: 'HUB_1', to: 'WAREHOUSE', weight: 25 },
    { from: 'HUB_2', to: 'WAREHOUSE', weight: 15 },
    { from: 'WAREHOUSE', to: 'RECEIVER_LOC', weight: 30 },
    { from: 'HUB_1', to: 'RECEIVER_LOC', weight: 28 }
  ] as Edge[]
};

/**
 * Allocate medicine directly using Dijkstra's algorithm across network hubs.
 * If no matching stock is found near, returns status "SEARCHING".
 */
export const allocateMedicineWithDijkstra = (medicineName: string, requiredQty: number = 1) => {
  const queryName = (medicineName || '').toLowerCase().trim();

  // Find hubs/nodes that have stock of this medicine
  const supplierNodes = medRouteMap.nodes.filter(node => {
    if (!node.inventory || node.inventory.length === 0) return false;
    return node.inventory.some(item => 
      item.name.toLowerCase().includes(queryName) || queryName.includes(item.name.toLowerCase())
    );
  });

  if (supplierNodes.length === 0) {
    return {
      status: 'SEARCHING' as const,
      message: 'Searching in nearby hubs...',
      allocatedHub: null,
      distance: null,
      path: ['RECEIVER_LOC']
    };
  }

  // Find supplier node with shortest Dijkstra distance to receiver
  let bestSupplier: Node | null = null;
  let bestPath: string[] = [];
  let minDistance = Infinity;

  supplierNodes.forEach(supplier => {
    const route = dijkstra(medRouteMap.nodes, medRouteMap.edges, supplier.id, 'RECEIVER_LOC');
    if (route.distance < minDistance) {
      minDistance = route.distance;
      bestPath = route.path;
      bestSupplier = supplier;
    }
  });

  if (bestSupplier && bestPath.length > 0) {
    return {
      status: 'ALLOCATED' as const,
      message: `Allocated from ${bestSupplier.name} via shortest route (${minDistance} km)`,
      allocatedHub: bestSupplier.name,
      distance: minDistance,
      path: bestPath
    };
  }

  return {
    status: 'SEARCHING' as const,
    message: 'Searching in nearby hubs...',
    allocatedHub: null,
    distance: null,
    path: ['RECEIVER_LOC']
  };
};

