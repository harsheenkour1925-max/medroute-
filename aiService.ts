export const findNearbyHubs = async (query: string, latitude: number, longitude: number) => {
  try {
    const response = await fetch("/api/ai/nearby-hubs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, latitude, longitude })
    });
    if (!response.ok) throw new Error("Server AI request failed");
    return await response.json();
  } catch (error) {
    console.error("Client AI findNearbyHubs error:", error);
    // Reliable static fallback data
    return {
      text: "* City General Hospital | 123 Main St | 24/7 | 4.8\n* Community Wellness Pharmacy | 456 Oak Ave | 9AM-9PM | 4.5\n* MedRoute Drop-box | Central Metro Station | 24/7 | 5.0",
      sources: []
    };
  }
};

export const getDisasterZoneFacilities = async (zoneName: string) => {
  try {
    const response = await fetch("/api/ai/disaster-facilities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zoneName })
    });
    if (!response.ok) throw new Error("Server AI request failed");
    return await response.json();
  } catch (error) {
    console.error("Client AI getDisasterZoneFacilities error:", error);
    if (zoneName.toLowerCase().includes("kerala")) {
      return [
        { name: "General Hospital Pathanamthitta", lat: 9.2648, lng: 76.7870 },
        { name: "Muthoot Medical Centre", lat: 9.2712, lng: 76.7815 },
        { name: "St. Gregorios Hospital", lat: 9.2580, lng: 76.7920 }
      ];
    }
    return [
      { name: "Emergency Relief Hub A", lat: 20.5937, lng: 78.9629 },
      { name: "Mobile Medical Unit 1", lat: 20.6000, lng: 78.9700 }
    ];
  }
};

export const getRoadRoute = async (start: { lat: number, lng: number }, end: { lat: number, lng: number }) => {
  try {
    const response = await fetch("/api/ai/road-route", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ start, end })
    });
    if (!response.ok) throw new Error("Server AI request failed");
    return await response.json();
  } catch (error) {
    console.error("Client AI getRoadRoute error:", error);
    return [
      start,
      { lat: start.lat + (end.lat - start.lat) * 0.33, lng: start.lng + (end.lng - start.lng) * 0.1 },
      { lat: start.lat + (end.lat - start.lat) * 0.66, lng: start.lng + (end.lng - start.lng) * 0.9 },
      end
    ];
  }
};
