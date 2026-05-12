export const portfolioKPIs = {
  branches: 53,
  units: 632,
  vacant: 143,
  occupancy: 0.774,
  lostValue: 1780000,
  avgVacancyDays: 89
};

export const priorityConfig = {
  Critical: { bg: "rgba(127, 29, 29, 0.28)", text: "#FCA5A5", label: "حرج" },
  High: { bg: "rgba(146, 96, 10, 0.26)", text: "#FFD166", label: "مرتفع" },
  Medium: { bg: "rgba(107, 84, 48, 0.34)", text: "#E8D4A8", label: "متوسط" },
  Low: { bg: "rgba(45, 106, 79, 0.24)", text: "#95D5B2", label: "منخفض" }
};

export const actionLabels = {
  reprice: "إعادة تسعير فورية",
  promote: "تنشيط الحملات",
  renovate: "تحسين وتجهيز",
  hold: "استمرار المتابعة",
  premium: "تسعير فاخر موجه",
  audit: "مراجعة تشغيلية"
};

export const marketData = {
  "العقيق": { studio: { median: 3600, avg: 3720, min: 2800, max: 5200, samples: 44 }, "1BR": { median: 5200, avg: 5350, min: 3900, max: 7300, samples: 61 }, "2BR": { median: 7200, avg: 7440, min: 5600, max: 9800, samples: 52 } },
  "الملقا": { studio: { median: 4100, avg: 4260, min: 3100, max: 5900, samples: 58 }, "1BR": { median: 6100, avg: 6280, min: 4600, max: 8600, samples: 70 }, "2BR": { median: 8500, avg: 8820, min: 6500, max: 11800, samples: 49 } },
  "النرجس": { studio: { median: 3300, avg: 3480, min: 2500, max: 5000, samples: 39 }, "1BR": { median: 4900, avg: 5060, min: 3700, max: 7100, samples: 54 }, "2BR": { median: 6900, avg: 7040, min: 5200, max: 9300, samples: 45 } },
  "الياسمين": { studio: { median: 3500, avg: 3610, min: 2700, max: 5150, samples: 34 }, "1BR": { median: 5100, avg: 5290, min: 3900, max: 7600, samples: 42 }, "2BR": { median: 7600, avg: 7810, min: 5800, max: 10200, samples: 37 } },
  "السليمانية": { studio: { median: 3900, avg: 4050, min: 3000, max: 5600, samples: 47 }, "1BR": { median: 5600, avg: 5790, min: 4300, max: 7900, samples: 57 }, "2BR": { median: 7900, avg: 8160, min: 6100, max: 10800, samples: 41 } },
  "المروج": { studio: { median: 3000, avg: 3170, min: 2300, max: 4500, samples: 33 }, "1BR": { median: 4500, avg: 4680, min: 3400, max: 6500, samples: 46 }, "2BR": { median: 6500, avg: 6720, min: 4900, max: 8800, samples: 35 } },
  "النزهة": { studio: { median: 2850, avg: 2970, min: 2200, max: 4300, samples: 29 }, "1BR": { median: 4300, avg: 4460, min: 3200, max: 6200, samples: 40 }, "2BR": { median: 6100, avg: 6320, min: 4700, max: 8400, samples: 31 } },
  "العارض": { studio: { median: 2500, avg: 2640, min: 1900, max: 3800, samples: 25 }, "1BR": { median: 3700, avg: 3860, min: 2800, max: 5400, samples: 32 }, "2BR": { median: 5400, avg: 5580, min: 4100, max: 7600, samples: 28 } }
};

const branchSeed = [
  ["MTH-001", "مثوى العقيق 01", "العقيق", "استثمار", 14, 5, 0.64, -82000, "reprice", "Critical", "العقيق"],
  ["MTH-002", "مثوى العقيق 02", "العقيق", "ادارة وتشغيل", 10, 1, 0.9, 43000, "hold", "Low", "العقيق"],
  ["MTH-003", "مثوى العقيق التنفيذي", "العقيق", "تنفيذي فاخر", 8, 3, 0.625, -51000, "premium", "High", "العقيق"],
  ["MTH-004", "مثوى الملقا 01", "الملقا", "استثمار", 16, 2, 0.875, 98000, "promote", "Medium", "الملقا"],
  ["MTH-005", "مثوى الملقا 02", "الملقا", "ادارة وتشغيل", 12, 5, 0.583, -96000, "reprice", "Critical", "الملقا"],
  ["MTH-006", "مثوى الملقا بلازا", "الملقا", "تنفيذي فاخر", 9, 1, 0.889, 112000, "premium", "Low", "الملقا"],
  ["MTH-007", "مثوى النرجس 01", "النرجس", "استثمار", 13, 4, 0.692, -43000, "renovate", "High", "النرجس"],
  ["MTH-008", "مثوى النرجس 02", "النرجس", "ادارة وتشغيل", 12, 2, 0.833, 27000, "promote", "Medium", "النرجس"],
  ["MTH-009", "مثوى الياسمين 01", "الياسمين", "استثمار", 15, 3, 0.8, 22000, "promote", "Medium", "الياسمين"],
  ["MTH-010", "مثوى الياسمين 02", "الياسمين", "ادارة وتشغيل", 11, 0, 1, 76000, "hold", "Low", "الياسمين"],
  ["MTH-011", "مثوى السليمانية 01", "السليمانية", "استثمار", 18, 6, 0.667, -123000, "reprice", "Critical", "السليمانية"],
  ["MTH-012", "مثوى السليمانية 02", "السليمانية", "تنفيذي فاخر", 7, 1, 0.857, 65000, "premium", "Low", "السليمانية"],
  ["MTH-013", "مثوى المروج 01", "المروج", "ادارة وتشغيل", 13, 5, 0.615, -72000, "audit", "Critical", "المروج"],
  ["MTH-014", "مثوى المروج 02", "المروج", "استثمار", 9, 2, 0.778, 12000, "promote", "Medium", "المروج"],
  ["MTH-015", "مثوى النزهة 01", "النزهة", "استثمار", 12, 4, 0.667, -45000, "renovate", "High", "النزهة"],
  ["MTH-016", "مثوى النزهة 02", "النزهة", "ادارة وتشغيل", 10, 1, 0.9, 39000, "hold", "Low", "النزهة"],
  ["MTH-017", "مثوى العارض 01", "العارض", "استثمار", 11, 5, 0.545, -58000, "reprice", "Critical", "العارض"],
  ["MTH-018", "مثوى العارض 02", "العارض", "ادارة وتشغيل", 10, 2, 0.8, 18000, "promote", "Medium", "العارض"],
  ["MTH-019", "مثوى الملك فيصل 01", "الملك فيصل", "استثمار", 12, 2, 0.833, 31000, "hold", "Medium", null],
  ["MTH-020", "مثوى الملك فيصل 02", "الملك فيصل", "ادارة وتشغيل", 10, 2, 0.8, 21000, "promote", "Medium", null],
  ["MTH-021", "مثوى الصحافة", "الصحافة", "تنفيذي فاخر", 9, 1, 0.889, 71000, "premium", "Low", null],
  ["MTH-022", "مثوى حطين", "حطين", "تنفيذي فاخر", 8, 0, 1, 132000, "hold", "Low", null],
  ["MTH-023", "مثوى الربيع", "الربيع", "ادارة وتشغيل", 11, 3, 0.727, -9000, "promote", "High", null],
  ["MTH-024", "مثوى الروضة", "الروضة", "استثمار", 13, 2, 0.846, 36000, "hold", "Medium", null],
  ["MTH-025", "مثوى الرحمانية", "الرحمانية", "ادارة وتشغيل", 10, 3, 0.7, -18000, "renovate", "High", null],
  ["MTH-026", "مثوى العليا", "العليا", "تنفيذي فاخر", 7, 0, 1, 148000, "premium", "Low", null],
  ["MTH-027", "مثوى الورود", "الورود", "استثمار", 12, 3, 0.75, 4000, "promote", "Medium", null],
  ["MTH-028", "مثوى الازدهار", "الازدهار", "ادارة وتشغيل", 11, 4, 0.636, -42000, "audit", "High", null],
  ["MTH-029", "مثوى قرطبة", "قرطبة", "استثمار", 14, 4, 0.714, -27000, "renovate", "High", null],
  ["MTH-030", "مثوى غرناطة", "غرناطة", "ادارة وتشغيل", 10, 1, 0.9, 41000, "hold", "Low", null],
  ["MTH-031", "مثوى اليرموك", "اليرموك", "استثمار", 12, 2, 0.833, 26000, "promote", "Medium", null],
  ["MTH-032", "مثوى المونسية", "المونسية", "ادارة وتشغيل", 13, 5, 0.615, -68000, "reprice", "Critical", null],
  ["MTH-033", "مثوى اشبيلية", "اشبيلية", "استثمار", 10, 2, 0.8, 15000, "promote", "Medium", null],
  ["MTH-034", "مثوى الندى", "الندى", "ادارة وتشغيل", 9, 1, 0.889, 33000, "hold", "Low", null],
  ["MTH-035", "مثوى النفل", "النفل", "استثمار", 11, 2, 0.818, 19000, "promote", "Medium", null],
  ["MTH-036", "مثوى الوادي", "الوادي", "ادارة وتشغيل", 12, 3, 0.75, -6000, "renovate", "High", null],
  ["MTH-037", "مثوى التعاون", "التعاون", "استثمار", 10, 1, 0.9, 37000, "hold", "Low", null],
  ["MTH-038", "مثوى المحمدية", "المحمدية", "تنفيذي فاخر", 8, 2, 0.75, 22000, "premium", "Medium", null],
  ["MTH-039", "مثوى الملك عبدالله", "الملك عبدالله", "ادارة وتشغيل", 11, 3, 0.727, -12000, "audit", "High", null],
  ["MTH-040", "مثوى القدس", "القدس", "استثمار", 12, 2, 0.833, 25000, "promote", "Medium", null],
  ["MTH-041", "مثوى المرسلات", "المرسلات", "ادارة وتشغيل", 9, 0, 1, 54000, "hold", "Low", null],
  ["MTH-042", "مثوى المعذر", "المعذر", "تنفيذي فاخر", 7, 1, 0.857, 59000, "premium", "Low", null],
  ["MTH-043", "مثوى الملز", "الملز", "استثمار", 13, 4, 0.692, -31000, "reprice", "High", null],
  ["MTH-044", "مثوى الربوة", "الربوة", "ادارة وتشغيل", 10, 2, 0.8, 14000, "promote", "Medium", null],
  ["MTH-045", "مثوى النسيم", "النسيم", "استثمار", 12, 5, 0.583, -61000, "audit", "Critical", null],
  ["MTH-046", "مثوى السعادة", "السعادة", "ادارة وتشغيل", 8, 1, 0.875, 28000, "hold", "Low", null],
  ["MTH-047", "مثوى الريان", "الريان", "استثمار", 11, 3, 0.727, -11000, "renovate", "High", null],
  ["MTH-048", "مثوى الروابي", "الروابي", "ادارة وتشغيل", 10, 2, 0.8, 17000, "promote", "Medium", null],
  ["MTH-049", "مثوى الشفا", "الشفا", "استثمار", 14, 6, 0.571, -74000, "reprice", "Critical", null],
  ["MTH-050", "مثوى بدر", "بدر", "ادارة وتشغيل", 9, 2, 0.778, 6000, "promote", "Medium", null],
  ["MTH-051", "مثوى ظهرة لبن", "ظهرة لبن", "استثمار", 12, 4, 0.667, -26000, "renovate", "High", null],
  ["MTH-052", "مثوى طويق", "طويق", "ادارة وتشغيل", 10, 3, 0.7, -17000, "audit", "High", null],
  ["MTH-053", "مثوى المهدية", "المهدية", "استثمار", 11, 3, 0.727, -8000, "promote", "High", null]
];

export const branches = branchSeed.map(([id, name, district, type, units, vacant, occupancy, profit, action, priority, market_district]) => ({
  id,
  name,
  district,
  type,
  units,
  vacant,
  occupancy,
  profit,
  action,
  priority,
  market_district
}));

export const topVacantUnits = [
  { branch: "مثوى السليمانية 01", unitId: "SL-1402", daysVacant: 512, monthlyPrice: 6200, lostValue: 105813 },
  { branch: "مثوى العارض 01", unitId: "AR-0308", daysVacant: 471, monthlyPrice: 4100, lostValue: 64370 },
  { branch: "مثوى النسيم", unitId: "NS-1101", daysVacant: 438, monthlyPrice: 3900, lostValue: 56940 },
  { branch: "مثوى الملقا 02", unitId: "ML-0905", daysVacant: 396, monthlyPrice: 6900, lostValue: 91080 },
  { branch: "مثوى المروج 01", unitId: "MR-0702", daysVacant: 351, monthlyPrice: 4800, lostValue: 56160 },
  { branch: "مثوى الشفا", unitId: "SH-0612", daysVacant: 309, monthlyPrice: 3300, lostValue: 33990 },
  { branch: "مثوى النرجس 01", unitId: "NJ-0209", daysVacant: 287, monthlyPrice: 5200, lostValue: 49747 },
  { branch: "مثوى النزهة 01", unitId: "NZ-0504", daysVacant: 244, monthlyPrice: 4300, lostValue: 34973 },
  { branch: "مثوى ظهرة لبن", unitId: "DL-1010", daysVacant: 211, monthlyPrice: 3600, lostValue: 25320 },
  { branch: "مثوى الازدهار", unitId: "AZ-0107", daysVacant: 188, monthlyPrice: 4500, lostValue: 28200 }
];

const districtNames = [
  "العقيق", "الملقا", "النرجس", "الياسمين", "السليمانية", "المروج", "النزهة", "العارض", "الملك فيصل", "الصحافة",
  "حطين", "الربيع", "الروضة", "الرحمانية", "العليا", "الورود", "الازدهار", "قرطبة", "غرناطة", "المونسية"
];

export const districtSummary = districtNames.map((district) => {
  const related = branches.filter((branch) => branch.district === district);
  const totalUnits = related.reduce((sum, branch) => sum + branch.units, 0);
  const vacant = related.reduce((sum, branch) => sum + branch.vacant, 0);
  const critical = related.filter((branch) => branch.priority === "Critical").length;
  return {
    district,
    branchCount: related.length,
    totalUnits,
    vacant,
    avgOccupancy: totalUnits ? 1 - vacant / totalUnits : 0.82,
    criticalCount: critical,
    hasMarketData: Boolean(marketData[district])
  };
});
