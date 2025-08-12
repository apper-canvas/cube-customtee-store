const savedDesignsMockData = [
  {
    Id: 1,
    name: "Summer Vibes",
    style: "Tank Top",
    color: { name: "Royal Blue", value: "#2563EB" },
    size: "L",
    designAreas: {
      Front: [
        {
          id: 1001,
          type: "text",
          content: "Summer Vibes",
          font: "Arial",
          color: "#FFFFFF",
          size: 28,
          stroke: 1,
          strokeColor: "#000000",
          shadow: 2,
          shadowColor: "#333333",
          rotation: 0,
          opacity: 100,
          x: 90,
          y: 120,
          visible: true,
          zIndex: 1
        },
        {
          id: 1002,
          type: "text",
          content: "☀️",
          font: "Arial",
          color: "#F59E0B",
          size: 32,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 0,
          shadowColor: "#000000",
          rotation: 0,
          opacity: 100,
          x: 140,
          y: 80,
          visible: true,
          zIndex: 2
        }
      ],
      Back: [],
      Sleeve: []
    },
    price: 28.99,
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-15T10:30:00.000Z"
  },
  {
    Id: 2,
    name: "Corporate Logo Design",
    style: "Crew Neck",
    color: { name: "Navy", value: "#1F2937" },
    size: "M",
    designAreas: {
      Front: [
        {
          id: 2001,
          type: "text",
          content: "ACME CORP",
          font: "Impact",
          color: "#FFFFFF",
          size: 24,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 1,
          shadowColor: "#666666",
          rotation: 0,
          opacity: 100,
          x: 100,
          y: 100,
          visible: true,
          zIndex: 1
        },
        {
          id: 2002,
          type: "text",
          content: "Excellence in Innovation",
          font: "Arial",
          color: "#F59E0B",
          size: 14,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 0,
          shadowColor: "#000000",
          rotation: 0,
          opacity: 100,
          x: 80,
          y: 130,
          visible: true,
          zIndex: 2
        }
      ],
      Back: [
        {
          id: 2003,
          type: "text",
          content: "Est. 2024",
          font: "Georgia",
          color: "#D1D5DB",
          size: 16,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 0,
          shadowColor: "#000000",
          rotation: 0,
          opacity: 100,
          x: 120,
          y: 320,
          visible: true,
          zIndex: 1
        }
      ],
      Sleeve: []
    },
    price: 32.50,
    createdAt: "2024-01-18T14:20:00.000Z",
    updatedAt: "2024-01-18T14:20:00.000Z"
  },
  {
    Id: 3,
    name: "Motivational Quote",
    style: "V-Neck",
    color: { name: "Black", value: "#000000" },
    size: "S",
    designAreas: {
      Front: [
        {
          id: 3001,
          type: "text",
          content: "Dream Big",
          font: "Impact",
          color: "#F59E0B",
          size: 32,
          stroke: 1,
          strokeColor: "#FFFFFF",
          shadow: 3,
          shadowColor: "#333333",
          rotation: -5,
          opacity: 100,
          x: 85,
          y: 110,
          visible: true,
          zIndex: 1
        },
        {
          id: 3002,
          type: "text",
          content: "Work Hard",
          font: "Impact",
          color: "#10B981",
          size: 28,
          stroke: 1,
          strokeColor: "#FFFFFF",
          shadow: 2,
          shadowColor: "#333333",
          rotation: 5,
          opacity: 100,
          x: 90,
          y: 150,
          visible: true,
          zIndex: 2
        },
        {
          id: 3003,
          type: "text",
          content: "Stay Humble",
          font: "Impact",
          color: "#EF4444",
          size: 24,
          stroke: 1,
          strokeColor: "#FFFFFF",
          shadow: 2,
          shadowColor: "#333333",
          rotation: -3,
          opacity: 100,
          x: 95,
          y: 185,
          visible: true,
          zIndex: 3
        }
      ],
      Back: [],
      Sleeve: []
    },
    price: 35.75,
    createdAt: "2024-01-20T09:15:00.000Z",
    updatedAt: "2024-01-22T16:45:00.000Z"
  },
  {
    Id: 4,
    name: "Birthday Special 2024",
    style: "Long Sleeve",
    color: { name: "White", value: "#FFFFFF" },
    size: "XL",
    designAreas: {
      Front: [
        {
          id: 4001,
          type: "text",
          content: "🎉 Birthday Girl 🎉",
          font: "Georgia",
          color: "#EC4899",
          size: 26,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 1,
          shadowColor: "#999999",
          rotation: 0,
          opacity: 100,
          x: 70,
          y: 120,
          visible: true,
          zIndex: 1
        },
        {
          id: 4002,
          type: "text",
          content: "2024",
          font: "Impact",
          color: "#8B5CF6",
          size: 48,
          stroke: 2,
          strokeColor: "#FFFFFF",
          shadow: 3,
          shadowColor: "#666666",
          rotation: 0,
          opacity: 100,
          x: 120,
          y: 160,
          visible: true,
          zIndex: 2
        }
      ],
      Back: [
        {
          id: 4003,
          type: "text",
          content: "Another Year Wiser",
          font: "Arial",
          color: "#6B7280",
          size: 18,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 0,
          shadowColor: "#000000",
          rotation: 0,
          opacity: 100,
          x: 80,
          y: 200,
          visible: true,
          zIndex: 1
        }
      ],
      Sleeve: [
        {
          id: 4004,
          type: "text",
          content: "🎂",
          font: "Arial",
          color: "#F59E0B",
          size: 20,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 0,
          shadowColor: "#000000",
          rotation: 0,
          opacity: 100,
          x: 10,
          y: 50,
          visible: true,
          zIndex: 1
        }
      ]
    },
    price: 42.99,
    createdAt: "2024-01-25T11:00:00.000Z",
    updatedAt: "2024-01-25T11:00:00.000Z"
  },
  {
    Id: 5,
    name: "Minimalist Design",
    style: "Crew Neck",
    color: { name: "Gray", value: "#6B7280" },
    size: "M",
    designAreas: {
      Front: [
        {
          id: 5001,
          type: "text",
          content: "Less is More",
          font: "Helvetica",
          color: "#FFFFFF",
          size: 20,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 0,
          shadowColor: "#000000",
          rotation: 0,
          opacity: 100,
          x: 100,
          y: 150,
          visible: true,
          zIndex: 1
        }
      ],
      Back: [],
      Sleeve: []
    },
    price: 26.50,
    createdAt: "2024-01-28T08:30:00.000Z",
    updatedAt: "2024-01-28T08:30:00.000Z"
  },
  {
    Id: 6,
    name: "Team Spirit",
    style: "Tank Top",
    color: { name: "Red", value: "#EF4444" },
    size: "L",
    designAreas: {
      Front: [
        {
          id: 6001,
          type: "text",
          content: "TEAM",
          font: "Impact",
          color: "#FFFFFF",
          size: 36,
          stroke: 2,
          strokeColor: "#000000",
          shadow: 2,
          shadowColor: "#333333",
          rotation: 0,
          opacity: 100,
          x: 110,
          y: 100,
          visible: true,
          zIndex: 1
        },
        {
          id: 6002,
          type: "text",
          content: "CHAMPIONS",
          font: "Impact",
          color: "#F59E0B",
          size: 24,
          stroke: 1,
          strokeColor: "#000000",
          shadow: 1,
          shadowColor: "#333333",
          rotation: 0,
          opacity: 100,
          x: 85,
          y: 140,
          visible: true,
          zIndex: 2
        },
        {
          id: 6003,
          type: "text",
          content: "🏆",
          font: "Arial",
          color: "#F59E0B",
          size: 28,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 0,
          shadowColor: "#000000",
          rotation: 0,
          opacity: 100,
          x: 140,
          y: 170,
          visible: true,
          zIndex: 3
        }
      ],
      Back: [
        {
          id: 6004,
          type: "text",
          content: "Victory 2024",
          font: "Arial",
          color: "#FFFFFF",
          size: 16,
          stroke: 0,
          strokeColor: "#000000",
          shadow: 1,
          shadowColor: "#666666",
          rotation: 0,
          opacity: 100,
          x: 105,
          y: 300,
          visible: true,
          zIndex: 1
        }
      ],
      Sleeve: []
    },
    price: 38.25,
    createdAt: "2024-02-01T13:45:00.000Z",
    updatedAt: "2024-02-01T13:45:00.000Z"
  }
];

export default savedDesignsMockData;