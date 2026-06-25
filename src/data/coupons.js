export const INITIAL_COUPONS = [
  {
    id: "c1", code: "SAVE10",     type: "percentage", value: 10, minOrder: 20,  maxUses: 100, usedCount: 34, isActive: true,  expiresAt: "2025-12-31T23:59:59Z",
  },
  {
    id: "c2", code: "FLAT5",      type: "fixed",      value: 5,  minOrder: 25,  maxUses: 200, usedCount: 87, isActive: true,  expiresAt: "2025-12-31T23:59:59Z",
  },
  {
    id: "c3", code: "WELCOME20",  type: "percentage", value: 20, minOrder: 30,  maxUses: 50,  usedCount: 12, isActive: true,  expiresAt: "2025-12-31T23:59:59Z",
  },
  {
    id: "c4", code: "SUMMER15",   type: "percentage", value: 15, minOrder: 40,  maxUses: 150, usedCount: 150,isActive: false, expiresAt: "2024-08-31T23:59:59Z",
  },
]
