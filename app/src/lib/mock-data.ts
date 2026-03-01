// Mock data for SafeLift HK MVP Demo

export interface Equipment {
  id: string;
  equipmentNumber: string;
  licensePlate: string;
  type: string;
  model: string;
  manufacturer: string;
  maxCapacity: number;
  maxRadius: number;
  certExpiryDate: string;
  lastInspectionDate: string;
  lastMaintenanceDate: string;
  status: "active" | "expired" | "maintenance" | "expiring";
  projectId: string;
  projectName: string;
}

export interface HazardReport {
  id: string;
  equipmentId: string;
  equipmentName: string;
  reportedBy: string;
  reportedAt: string;
  locationName: string;
  hazardType: string;
  severity: "critical" | "high" | "medium" | "low";
  status: "open" | "confirmed" | "resolved" | "in_review";
  description_zh: string;
  description_en: string;
  photoUrl: string;
}

export interface Document {
  id: string;
  fileName: string;
  fileType: "certificate" | "inspection-report" | "maintenance-record" | "safety-training" | "load-test" | "pdf" | "image";
  equipmentId: string;
  equipmentName: string;
  uploadedAt: string;
  expiryDate: string | null;
  status: "valid" | "expiring" | "expired";
  fileSize: string;
  uploadedBy: string;
  tags: string[];
}

export interface Alert {
  id: string;
  type: "cert-expiry" | "critical-hazard" | "maintenance-due" | "hazard-resolved";
  title_zh: string;
  title_en: string;
  message_zh: string;
  message_en: string;
  equipmentId: string;
  priority: "critical" | "high" | "normal" | "resolved";
  isRead: boolean;
  createdAt: string;
}

export interface MaintenanceRecord {
  id: string;
  equipmentId: string;
  type: "routine" | "repair" | "inspection" | "certification";
  date: string;
  performedBy: string;
  description: string;
  description_zh: string;
}

// ==========================================
// Equipment Data
// ==========================================
export const equipmentData: Equipment[] = [
  {
    id: "LC-2024-001",
    equipmentNumber: "LC-2024-001",
    licensePlate: "TN 3842",
    type: "Lorry Crane 貨車吊機",
    model: "Tadano TM-ZZ440",
    manufacturer: "Tadano",
    maxCapacity: 44,
    maxRadius: 31,
    certExpiryDate: "2026-09-15",
    lastInspectionDate: "2026-01-20",
    lastMaintenanceDate: "2026-01-20",
    status: "active",
    projectId: "P001",
    projectName: "Tseung Kwan O Site B",
  },
  {
    id: "TC-2023-015",
    equipmentNumber: "TC-2023-015",
    licensePlate: "—",
    type: "Tower Crane 塔式起重機",
    model: "Liebherr 280 EC-H",
    manufacturer: "Liebherr",
    maxCapacity: 12,
    maxRadius: 80,
    certExpiryDate: "2026-05-01",
    lastInspectionDate: "2025-11-03",
    lastMaintenanceDate: "2025-12-15",
    status: "expiring",
    projectId: "P001",
    projectName: "Tseung Kwan O Site B",
  },
  {
    id: "CB-2024-044",
    equipmentNumber: "CB-2024-044",
    licensePlate: "—",
    type: "Chain Block 鏈條葫蘆",
    model: "Nitchi CB-S97",
    manufacturer: "Nitchi",
    maxCapacity: 8,
    maxRadius: 0,
    certExpiryDate: "2026-12-01",
    lastInspectionDate: "2026-02-10",
    lastMaintenanceDate: "2026-02-10",
    status: "active",
    projectId: "P002",
    projectName: "North Point Phase 3",
  },
  {
    id: "LC-0039-042",
    equipmentNumber: "LC-0039-042",
    licensePlate: "AZ 7218",
    type: "Lorry Crane 貨車吊機",
    model: "UNIC URW-706",
    manufacturer: "UNIC",
    maxCapacity: 6,
    maxRadius: 21.3,
    certExpiryDate: "2026-04-13",
    lastInspectionDate: "2025-10-15",
    lastMaintenanceDate: "2025-10-15",
    status: "expiring",
    projectId: "P001",
    projectName: "Tseung Kwan O Site B",
  },
  {
    id: "MC-2024-003",
    equipmentNumber: "MC-2024-003",
    licensePlate: "—",
    type: "Mobile Crane 流動吊機",
    model: "Potain MCT 205",
    manufacturer: "Potain",
    maxCapacity: 10,
    maxRadius: 65,
    certExpiryDate: "2026-07-20",
    lastInspectionDate: "2026-01-10",
    lastMaintenanceDate: "2026-01-10",
    status: "active",
    projectId: "P003",
    projectName: "Kai Tak Runway",
  },
  {
    id: "CB-0003-019",
    equipmentNumber: "CB-0003-019",
    licensePlate: "—",
    type: "Chain Block 鏈條葫蘆",
    model: "Yale VSG1 3T",
    manufacturer: "Yale",
    maxCapacity: 3,
    maxRadius: 0,
    certExpiryDate: "2025-12-10",
    lastInspectionDate: "2025-06-10",
    lastMaintenanceDate: "2025-06-10",
    status: "expired",
    projectId: "P002",
    projectName: "North Point Phase 3",
  },
  {
    id: "GD-0001-003",
    equipmentNumber: "GD-0001-003",
    licensePlate: "—",
    type: "Gantry Crane 門式起重機",
    model: "Konecranes CXT",
    manufacturer: "Konecranes",
    maxCapacity: 16,
    maxRadius: 20,
    certExpiryDate: "2026-06-30",
    lastInspectionDate: "2025-12-20",
    lastMaintenanceDate: "2025-12-20",
    status: "active",
    projectId: "P003",
    projectName: "Kai Tak Runway",
  },
];

// ==========================================
// Hazard Reports
// ==========================================
export const hazardReports: HazardReport[] = [
  {
    id: "HR-001",
    equipmentId: "LC-2024-001",
    equipmentName: "Tower Crane TC-03",
    reportedBy: "陳大文",
    reportedAt: "2026-03-01 09:23",
    locationName: "Cheung Sha Wan 長沙灣",
    hazardType: "ZONE_VIOLATION",
    severity: "critical",
    status: "open",
    description_zh: "有人站在吊運範圍內，距離吊臂不足5米",
    description_en: "Person standing within crane swing zone, less than 5m from boom",
    photoUrl: "/photos/hazard-1.jpg",
  },
  {
    id: "HR-002",
    equipmentId: "TC-2023-015",
    equipmentName: "Mobile Crane MC-47",
    reportedBy: "李小明",
    reportedAt: "2026-02-28 14:15",
    locationName: "Tsuen Wan 荃灣",
    hazardType: "RIGGING_IMPROPER",
    severity: "high",
    status: "open",
    description_zh: "吊索用法不當，吊索打結使用",
    description_en: "Improper sling usage, wire rope knotted during operation",
    photoUrl: "/photos/hazard-2.jpg",
  },
  {
    id: "HR-003",
    equipmentId: "LC-0039-042",
    equipmentName: "Hoist H-12",
    reportedBy: "王志強",
    reportedAt: "2026-02-28 10:42",
    locationName: "Safety Zone 安全區域",
    hazardType: "PPE_MISSING",
    severity: "medium",
    status: "resolved",
    description_zh: "工人缺少安全帽，在吊運區域附近工作",
    description_en: "Workers missing hard hats near lifting zone",
    photoUrl: "/photos/hazard-3.jpg",
  },
  {
    id: "HR-004",
    equipmentId: "TC-2023-015",
    equipmentName: "Tower Crane TC-03",
    reportedBy: "張美玲",
    reportedAt: "2026-02-27 16:30",
    locationName: "Tseung Kwan O 將軍澳",
    hazardType: "GROUND_UNSTABLE",
    severity: "low",
    status: "resolved",
    description_zh: "吊機放置在不平穩地面，需要重新安裝墊板",
    description_en: "Crane placed on unstable ground, re-installation of base plates needed",
    photoUrl: "/photos/hazard-4.jpg",
  },
  {
    id: "HR-005",
    equipmentId: "CB-2024-044",
    equipmentName: "Gantry G1-45",
    reportedBy: "陳大文",
    reportedAt: "2026-02-27 08:50",
    locationName: "Kai Tak 啟德",
    hazardType: "LOAD_UNSAFE",
    severity: "high",
    status: "in_review",
    description_zh: "貨物偏斜嚴重，超出吊運半徑",
    description_en: "Severe load tilt detected, exceeding crane swing radius",
    photoUrl: "/photos/hazard-5.jpg",
  },
];

// ==========================================
// Documents
// ==========================================
export const documents: Document[] = [
  {
    id: "DOC-001",
    fileName: "Form 3 Certificate 表格三證書",
    fileType: "certificate",
    equipmentId: "LC-2024-001",
    equipmentName: "LC-2024-001 / TN 3842",
    uploadedAt: "2025-09-20",
    expiryDate: "2026-09-15",
    status: "valid",
    fileSize: "2.4 MB",
    uploadedBy: "Admin",
    tags: ["Form 3", "Annual", "Certificate"],
  },
  {
    id: "DOC-002",
    fileName: "Annual Inspection Report 年度檢驗報告",
    fileType: "inspection-report",
    equipmentId: "LC-2024-001",
    equipmentName: "LC-2024-001 / TN 3842",
    uploadedAt: "2025-09-20",
    expiryDate: null,
    status: "valid",
    fileSize: "5.1 MB",
    uploadedBy: "Inspector Wong",
    tags: ["Inspection", "Annual"],
  },
  {
    id: "DOC-003",
    fileName: "Maintenance Record Q4 維修紀錄Q4",
    fileType: "maintenance-record",
    equipmentId: "TC-2023-015",
    equipmentName: "TC-2023-015",
    uploadedAt: "2025-12-15",
    expiryDate: null,
    status: "valid",
    fileSize: "1.8 MB",
    uploadedBy: "Engineer Chan",
    tags: ["Maintenance", "Q4"],
  },
  {
    id: "DOC-004",
    fileName: "Operator Certificate 操作員資格證書",
    fileType: "certificate",
    equipmentId: "LC-0039-042",
    equipmentName: "LC-0039-042 / AZ 7218",
    uploadedAt: "2025-07-01",
    expiryDate: "2026-07-01",
    status: "valid",
    fileSize: "0.8 MB",
    uploadedBy: "Admin",
    tags: ["Operator", "Certificate"],
  },
  {
    id: "DOC-005",
    fileName: "Form 5 Load Test Cert 表格五負重測試證書",
    fileType: "load-test",
    equipmentId: "CB-2024-044",
    equipmentName: "CB-2024-044",
    uploadedAt: "2026-01-14",
    expiryDate: "2026-07-14",
    status: "valid",
    fileSize: "3.2 MB",
    uploadedBy: "Inspector Lee",
    tags: ["Form 5", "Load Test"],
  },
  {
    id: "DOC-006",
    fileName: "Safety Training Record 安全培訓紀錄",
    fileType: "safety-training",
    equipmentId: "GD-0001-003",
    equipmentName: "GD-0001-003",
    uploadedAt: "2025-11-14",
    expiryDate: null,
    status: "valid",
    fileSize: "4.5 MB",
    uploadedBy: "Training Dept",
    tags: ["Training", "Safety"],
  },
  {
    id: "DOC-007",
    fileName: "Insurance Policy 保險合約",
    fileType: "pdf",
    equipmentId: "LC-2024-001",
    equipmentName: "LC-2024-001 / TN 3842",
    uploadedAt: "2025-06-01",
    expiryDate: "2026-06-01",
    status: "expiring",
    fileSize: "1.2 MB",
    uploadedBy: "Admin",
    tags: ["Insurance", "Policy"],
  },
];

// ==========================================
// Alerts
// ==========================================
export const alerts: Alert[] = [
  {
    id: "ALT-001",
    type: "critical-hazard",
    title_zh: "嚴重危害偵測 Critical Hazard Detected",
    title_en: "Critical Hazard Detected",
    message_zh: "在長沙灣工地偵測到有人進入吊運危險範圍，距離吊臂不足5米，需要立即處理。",
    message_en: "Person detected in crane swing zone at Cheung Sha Wan site, less than 5m from boom. Immediate action required.",
    equipmentId: "LC-2024-001",
    priority: "critical",
    isRead: false,
    createdAt: "2026-03-01 09:25",
  },
  {
    id: "ALT-002",
    type: "cert-expiry",
    title_zh: "證書即將到期 Certificate Expiring Soon",
    title_en: "Certificate Expiring Soon",
    message_zh: "塔式起重機 TC-2023-015 的法定檢驗證書將於 2026-05-01 到期，距今僅餘 61 日。請盡快安排重新檢驗。",
    message_en: "Tower Crane TC-2023-015 certificate expires 2026-05-01, only 61 days remaining. Please arrange re-inspection.",
    equipmentId: "TC-2023-015",
    priority: "high",
    isRead: false,
    createdAt: "2026-03-01 06:00",
  },
  {
    id: "ALT-003",
    type: "critical-hazard",
    title_zh: "吊索危害報告待處理 Rigging Hazard Report Pending",
    title_en: "Rigging Hazard Report Pending",
    message_zh: "在荃灣工地偵測到吊索不當用法，吊索打結使用，已由李小明報告。需要主管確認並跟進。",
    message_en: "Improper rigging detected at Tsuen Wan site, wire rope knotted. Reported by Li Siu Ming. Supervisor review required.",
    equipmentId: "TC-2023-015",
    priority: "high",
    isRead: false,
    createdAt: "2026-02-28 14:20",
  },
  {
    id: "ALT-004",
    type: "maintenance-due",
    title_zh: "維修保養到期 Maintenance Due",
    title_en: "Maintenance Due",
    message_zh: "鏈條葫蘆 CB-0003-019 的例行維修保養已逾期，原定維修日期為 2025-11-10。請安排維修。",
    message_en: "Chain block CB-0003-019 routine maintenance overdue. Originally due 2025-11-10. Please schedule maintenance.",
    equipmentId: "CB-0003-019",
    priority: "normal",
    isRead: true,
    createdAt: "2026-02-27 06:00",
  },
  {
    id: "ALT-005",
    type: "hazard-resolved",
    title_zh: "危害已處理 Hazard Resolved",
    title_en: "Hazard Resolved",
    message_zh: "在將軍澳工地的PPE缺失危害已處理完畢，所有工人已佩戴安全裝備。由安全主任確認關閉。",
    message_en: "PPE violation at Tseung Kwan O site has been resolved. All workers now wearing safety equipment. Confirmed closed by Safety Officer.",
    equipmentId: "LC-0039-042",
    priority: "resolved",
    isRead: true,
    createdAt: "2026-02-26 17:30",
  },
];

// ==========================================
// Maintenance Records
// ==========================================
export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: "MR-001",
    equipmentId: "LC-0039-042",
    type: "routine",
    date: "2026-01-20",
    performedBy: "Engineer Lee",
    description: "Annual inspection — Passed 月例檢查 — 合格",
    description_zh: "年度例行檢查 — 全部合格",
  },
  {
    id: "MR-002",
    equipmentId: "LC-0039-042",
    type: "repair",
    date: "2025-11-03",
    performedBy: "Hydraulic Workshop",
    description: "Hydraulic Hose Replacement 液壓軟管更換",
    description_zh: "更換液壓軟管，修復洩漏問題",
  },
  {
    id: "MR-003",
    equipmentId: "LC-0039-042",
    type: "certification",
    date: "2025-10-15",
    performedBy: "Certified Inspector",
    description: "Load Test — SWL Confirmed 負重測試確認安全工作負荷",
    description_zh: "負重測試完成，安全工作負荷確認",
  },
  {
    id: "MR-004",
    equipmentId: "LC-0039-042",
    type: "repair",
    date: "2025-06-20",
    performedBy: "Wire Specialist",
    description: "Wire Rope Defect Found — Replaced 鋼纜缺陷 — 已更換",
    description_zh: "發現鋼纜磨損缺陷，已全部更換",
  },
];

// ==========================================
// Dashboard Stats
// ==========================================
export const dashboardStats = {
  activeEquipment: 24,
  expiringCertificates: 3,
  openHazards: 7,
  reportsThisMonth: 42,
};

// ==========================================
// Upcoming Expirations
// ==========================================
export const upcomingExpirations = [
  { equipment: "Tower Crane TC-03", daysLeft: 7, type: "critical" },
  { equipment: "Mobile Crane MC-02", daysLeft: 14, type: "high" },
  { equipment: "Hoist H-17", daysLeft: 25, type: "normal" },
  { equipment: "Gantry G1-03", daysLeft: 45, type: "normal" },
];
