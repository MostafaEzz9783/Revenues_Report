import { useMemo, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "recharts";
import {
  ArrowDownUp,
  Building2,
  ChevronDown,
  Download,
  ExternalLink,
  Gauge,
  Home,
  Layers3,
  MapPin,
  SearchCheck,
  ShieldAlert,
  TrendingDown,
  X
} from "lucide-react";
import { useCountUp } from "../hooks/useCountUp";
import { useReveal } from "../hooks/useReveal";
import {
  actionLabels,
  branches,
  districtSummary,
  portfolioKPIs,
  priorityConfig,
  topVacantUnits,
  vacancyBuckets
} from "../lib/mathwaData";

const nf = new Intl.NumberFormat("ar-SA");
const compact = new Intl.NumberFormat("ar-SA", { notation: "compact", maximumFractionDigits: 1 });
const sar = new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 0 });

const priorityOptions = [
  { value: "all", label: "كل" },
  { value: "Critical", label: "حرج" },
  { value: "High", label: "مرتفع" },
  { value: "Medium", label: "متوسط" },
  { value: "Low", label: "منخفض" }
];

const typeOptions = ["كل", "استثمار", "ادارة و تشغيل", "تنفيذي فاخر"];
const vacantUnitsSheetUrl = "https://docs.google.com/spreadsheets/d/1o81wiw_brD1oWzrxJ-2Y-af2qCfLf0VbEM6ugIbIN4s/edit?usp=sharing";

function DashboardHeader({ onExport, exporting, exportError }) {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-8 pt-8 md:flex-row md:items-center md:justify-between md:px-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center border border-gold/30 bg-card-elevated shadow-gold">
          <Home className="h-7 w-7 text-gold-light" strokeWidth={1.6} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-normal text-gold-light md:text-5xl">Mathwa <span className="text-gold">مثوى</span></h1>
          <p className="mt-2 text-sm font-medium text-gold-light/62">لوحة استخبارات الشواغر العقارية</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <span className="border border-gold/20 bg-card-bg px-4 py-3 text-gold-light/75">الفترة: الربع الثاني ٢٠٢٦</span>
        <div className="flex flex-col gap-2">
          <button
            onClick={onExport}
            disabled={exporting}
            className="inline-flex items-center justify-center gap-2 bg-gold px-4 py-3 font-bold text-espresso transition hover:bg-gold-light disabled:cursor-wait disabled:opacity-70"
          >
            <Download className="h-4 w-4" />
            {exporting ? "جاري التصدير..." : "تصدير التقرير"}
          </button>
          {exportError && <span className="text-xs font-bold text-danger-light">{exportError}</span>}
        </div>
      </div>
    </header>
  );
}

function Shell({ children, className = "" }) {
  return (
    <div className={`card-shell ${className}`}>
      <div className="card-core h-full">{children}</div>
    </div>
  );
}

function KPICard({ icon: Icon, label, target, suffix = "", mode = "number", note }) {
  const countTarget = mode === "percent" ? target * 10 : target;
  const { ref, value } = useCountUp(countTarget);
  const revealRef = useReveal();
  const shown = mode === "percent"
    ? `${(value / 10).toLocaleString("ar-SA", { maximumFractionDigits: 1 })}%`
    : `${mode === "money" ? compact.format(value) : nf.format(Math.round(value))}${suffix}`;

  return (
    <div ref={revealRef}>
      <Shell className="h-full">
        <div ref={ref} className="gold-line flex h-full flex-col gap-5 p-5">
          <div className="flex items-center justify-between">
            <span className="grid h-11 w-11 place-items-center bg-card-elevated text-gold">
              <Icon className="h-5 w-5" strokeWidth={1.6} />
            </span>
            <span className="font-mono text-xs text-gold-dim">{note}</span>
          </div>
          <div>
            <div className="numeric font-playfair text-4xl font-bold italic text-gold-light md:text-5xl">{shown}</div>
            <p className="mt-2 text-sm font-bold text-gold-light/70">{label}</p>
          </div>
        </div>
      </Shell>
    </div>
  );
}

function HeroKPIBar() {
  return (
    <section className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-5 md:px-6">
      <KPICard icon={Building2} label="الفروع" target={portfolioKPIs.branches} note="BR" />
      <KPICard icon={Layers3} label="الوحدات" target={portfolioKPIs.units} note="UNITS" />
      <KPICard icon={TrendingDown} label="الشواغر" target={portfolioKPIs.vacant} note="VAC" />
      <KPICard icon={Gauge} label="الإشغال" target={portfolioKPIs.occupancy * 100} mode="percent" note="OCC" />
      <KPICard icon={ShieldAlert} label="قيمة مفقودة" target={portfolioKPIs.lostValue} mode="money" suffix=" ر.س" note="LOSS" />
    </section>
  );
}

function FiltersBar({ filters, setFilters }) {
  const districts = useMemo(() => ["كل", ...new Set(branches.map((branch) => branch.district))], []);
  return (
    <section className="sticky top-0 z-30 mt-8 border-y border-gold/10 bg-espresso/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div className="flex flex-wrap items-center gap-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilters((current) => ({ ...current, priority: option.value }))}
              className={`px-4 py-2 text-sm font-bold transition ${filters.priority === option.value ? "bg-gold text-espresso" : "border border-gold/15 bg-card-bg text-gold-light/70 hover:border-gold/40"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="relative min-w-52 text-sm text-gold-light/70">
          <select
            value={filters.district}
            onChange={(event) => setFilters((current) => ({ ...current, district: event.target.value }))}
            className="w-full appearance-none border border-gold/15 bg-card-bg px-4 py-2.5 text-gold-light outline-none focus:border-gold"
          >
            {districts.map((district) => <option key={district}>{district}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gold" />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {typeOptions.map((type) => (
            <button
              key={type}
              onClick={() => setFilters((current) => ({ ...current, type }))}
              className={`px-4 py-2 text-sm font-bold transition ${filters.type === type ? "bg-gold text-espresso" : "border border-gold/15 bg-card-bg text-gold-light/70 hover:border-gold/40"}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExecutiveAnalysis({ branchesView, vacantUnitsView }) {
  const revealRef = useReveal();
  const insights = useMemo(() => {
    const totalVacant = branchesView.reduce((sum, branch) => sum + branch.vacant, 0);
    const topVacancy = [...branchesView]
      .filter((branch) => branch.vacant > 0)
      .sort((a, b) => b.vacant - a.vacant)
      .slice(0, 5);
    const lostByBranch = vacantUnitsView.reduce((map, unit) => {
      map.set(unit.branch, (map.get(unit.branch) || 0) + unit.lostValue);
      return map;
    }, new Map());
    const topLost = [...lostByBranch.entries()]
      .map(([branch, lostValue]) => ({ branch, lostValue }))
      .sort((a, b) => b.lostValue - a.lostValue)
      .slice(0, 5);
    const critical = branchesView.filter((branch) => branch.occupancy < 0.4);
    const watch = branchesView.filter((branch) => branch.occupancy < 0.6);
    const topFiveVacancy = topVacancy.reduce((sum, branch) => sum + branch.vacant, 0);
    const concentration = totalVacant > 0 ? Math.round((topFiveVacancy / totalVacant) * 100) : 0;
    const totalLost = topLost.reduce((sum, item) => sum + item.lostValue, 0);
    const recommendation = critical.length >= 5
      ? "الأولوية الفورية هي إعادة التسعير وتنشيط الحملات للفروع الأقل من ٤٠٪ إشغال، مع متابعة أسبوعية حتى تعود لمستوى تشغيل مستقر."
      : concentration >= 50
        ? "الشواغر مركزة في عدد محدود من الفروع، لذلك الأفضل اعتماد خطط تنفيذية على مستوى كل فرع بدل معالجة عامة للمحفظة."
        : totalLost >= 500000
          ? "ينبغي ترتيب المعالجة حسب الوحدات الأعلى إيجارا والأطول شغورا لخفض الفاقد النقدي بأسرع أثر ممكن."
          : "الوضع يتطلب ضبطا انتقائيا للأسعار ومتابعة للفروع تحت المراقبة قبل تحولها إلى أولوية حرجة.";

    return { topVacancy, topLost, critical, watch, concentration, recommendation };
  }, [branchesView, vacantUnitsView]);

  const topVacancyText = insights.topVacancy.length
    ? `تتركز الشواغر في ${insights.topVacancy.map((branch) => `${branch.name} (${nf.format(branch.vacant)})`).join("، ")}.`
    : "لا توجد شواغر ضمن التصفية الحالية.";
  const topLostText = insights.topLost.length
    ? `أعلى فاقد مالي ظاهر في ${insights.topLost.map((item) => `${item.branch} (${sar.format(item.lostValue)} ر.س)`).join("، ")}.`
    : "لا يوجد فاقد مالي ضمن التصفية الحالية.";

  return (
    <section ref={revealRef} className="mx-auto mt-8 w-full max-w-7xl px-4 md:px-6">
      <Shell>
        <div className="p-5 md:p-6">
          <SectionTitle icon={ShieldAlert} title="تحليل تنفيذي للشواغر" subtitle="قراءة ديناميكية حسب الفلاتر الحالية" />
          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
            <AnalysisCard title="أعلى الفروع من حيث عدد الشواغر" body={topVacancyText} />
            <AnalysisCard title="أعلى الفروع من حيث الفاقد المالي" body={topLostText} />
            <AnalysisCard title="الفروع الحرجة" body={`${nf.format(insights.critical.length)} فرع تحت ٤٠٪ إشغال ويحتاج قرارا تنفيذيا سريعا.`} metric={nf.format(insights.critical.length)} />
            <AnalysisCard title="الفروع تحت المراقبة" body={`${nf.format(insights.watch.length)} فرع تحت ٦٠٪ إشغال ويحتاج متابعة أسبوعية.`} metric={nf.format(insights.watch.length)} />
            <AnalysisCard title="تركيز الشواغر" body={`${nf.format(insights.concentration)}٪ من الشواغر الحالية متركزة في أعلى ٥ فروع.`} metric={`${nf.format(insights.concentration)}٪`} />
            <AnalysisCard title="توصية تنفيذية مختصرة" body={insights.recommendation} highlight />
          </div>
        </div>
      </Shell>
    </section>
  );
}

function AnalysisCard({ title, body, metric, highlight }) {
  return (
    <div className={`border border-gold/12 p-4 ${highlight ? "bg-gold/10" : "bg-espresso/42"}`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-extrabold text-gold-light">{title}</h3>
        {metric && <span className="numeric font-playfair text-3xl italic text-gold">{metric}</span>}
      </div>
      <p className="mt-3 text-sm leading-7 text-gold-light/68">{body}</p>
    </div>
  );
}

function OccupancyBar({ value, wide = false }) {
  const color = value > 0.85 ? "#95D5B2" : value > 0.7 ? "#E8D4A8" : value > 0.5 ? "#FFD166" : "#FCA5A5";
  return (
    <div className={`flex items-center gap-3 ${wide ? "w-full" : "min-w-36"}`}>
      <div className="h-2 flex-1 bg-espresso">
        <div className="h-full transition-all" style={{ width: `${Math.round(value * 100)}%`, backgroundColor: color }} />
      </div>
      <span className="numeric w-12 text-center font-mono text-xs" style={{ color }}>{nf.format(Math.round(value * 100))}%</span>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const config = priorityConfig[priority];
  return (
    <span className="inline-flex min-w-16 justify-center px-3 py-1 text-xs font-extrabold" style={{ backgroundColor: config.bg, color: config.text }}>
      {config.label}
    </span>
  );
}

function BranchDrawer({ branch, onClose }) {
  if (!branch) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="إغلاق" className="absolute inset-0 bg-black/62 backdrop-blur-sm" onClick={onClose} />
      <aside className="absolute right-0 top-0 h-full w-full max-w-md overflow-y-auto border-l border-gold/20 bg-card-bg p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-gold">{branch.district}</p>
            <h2 className="mt-2 text-2xl font-extrabold text-gold-light">{branch.name}</h2>
          </div>
          <button className="grid h-10 w-10 place-items-center border border-gold/20 text-gold-light hover:bg-card-elevated" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Info label="النوع" value={branch.type} />
          <Info label="الأولوية" value={<PriorityBadge priority={branch.priority} />} />
          <Info label="الوحدات" value={nf.format(branch.units)} />
          <Info label="الشاغرة" value={nf.format(branch.vacant)} danger={branch.vacant > 0} />
        </div>

        <div className="mt-6 border border-gold/12 bg-espresso/50 p-4">
          <p className="mb-3 text-sm font-bold text-gold-light/70">مؤشر الإشغال</p>
          <OccupancyBar value={branch.occupancy} wide />
        </div>

        <div className="mt-6 border border-gold/12 bg-card-elevated p-4">
          <p className="text-sm font-bold text-gold-light/70">الإجراء المقترح</p>
          <p className="mt-2 text-lg font-extrabold text-gold-light">{actionLabels[branch.action]}</p>
        </div>


        <div className="mt-6 border-t border-gold/10 pt-5">
          <p className="text-sm text-gold-light/60">الأثر الربحي</p>
          <p className={`numeric mt-1 font-playfair text-3xl italic ${branch.profit >= 0 ? "text-success-light" : "text-danger-light"}`}>
            {sar.format(branch.profit)} ر.س
          </p>
        </div>
      </aside>
    </div>
  );
}

function Info({ label, value, danger }) {
  return (
    <div className="border border-gold/12 bg-espresso/40 p-3">
      <p className="text-xs font-bold text-gold-light/52">{label}</p>
      <div className={`mt-1 font-mono text-lg font-bold ${danger ? "text-danger-light" : "text-gold-light"}`}>{value}</div>
    </div>
  );
}

function BranchHeatmap({ filteredBranches }) {
  const [sort, setSort] = useState({ key: "vacant", direction: "desc" });
  const [selected, setSelected] = useState(null);
  const revealRef = useReveal();

  const filtered = useMemo(() => {
    return [...filteredBranches].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const result = typeof av === "string" ? av.localeCompare(bv, "ar") : av - bv;
      return sort.direction === "asc" ? result : -result;
    });
  }, [filteredBranches, sort]);

  const setSortKey = (key) => {
    setSort((current) => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc"
    }));
  };

  const headers = [
    ["name", "الفرع"],
    ["district", "الحي"],
    ["type", "النوع"],
    ["units", "الوحدات"],
    ["vacant", "الشاغرة"],
    ["occupancy", "الإشغال"],
    ["priority", "الأولوية"]
  ];

  return (
    <section ref={revealRef} className="mx-auto mt-8 w-full max-w-7xl px-4 md:px-6">
      <Shell>
        <div className="p-4 md:p-6">
          <SectionTitle icon={ArrowDownUp} title="خريطة الفروع الحرارية" subtitle={`${nf.format(filtered.length)} فرع ضمن التصفية الحالية`} />
          <div className="mt-5 overflow-x-auto">
            <table className="data-table w-full min-w-[1040px] border-separate border-spacing-y-2 text-sm">
              <colgroup>
                <col className="w-[170px]" />
                <col className="w-[120px]" />
                <col className="w-[130px]" />
                <col className="w-[90px]" />
                <col className="w-[90px]" />
                <col className="w-[150px]" />
                <col className="w-[110px]" />
                <col className="w-[150px]" />
              </colgroup>
              <thead className="text-gold-light/58">
                <tr>
                  {headers.map(([key, label]) => (
                    <th key={key} className="px-3 py-2 text-center">
                      <button className="inline-flex w-full items-center justify-center gap-2 font-bold" onClick={() => setSortKey(key)}>
                        {label}
                        <ChevronDown className={`h-3.5 w-3.5 transition ${sort.key === key && sort.direction === "asc" ? "rotate-180" : ""}`} />
                      </button>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((branch) => (
                  <tr key={branch.id} onClick={() => setSelected(branch)} className="cursor-pointer bg-card-elevated/64 text-gold-light transition hover:bg-[#392513]">
                    <td className="p-3 font-extrabold"><div className="cell-center">{branch.name}</div></td>
                    <td className="p-3 text-gold-light/72"><div className="cell-center">{branch.district}</div></td>
                    <td className="p-3 text-gold-light/72"><div className="cell-center">{branch.type}</div></td>
                    <td className="numeric p-3 font-mono"><div className="cell-center">{nf.format(branch.units)}</div></td>
                    <td className={`numeric p-3 font-mono font-bold ${branch.vacant > 0 ? "text-danger-light" : "text-success-light"}`}><div className="cell-center">{nf.format(branch.vacant)}</div></td>
                    <td className="p-3"><div className="cell-center"><OccupancyBar value={branch.occupancy} /></div></td>
                    <td className="p-3"><div className="cell-center"><PriorityBadge priority={branch.priority} /></div></td>
                    <td className="p-3 text-gold"><div className="cell-center">{actionLabels[branch.action]}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Shell>
      <BranchDrawer branch={selected} onClose={() => setSelected(null)} />
    </section>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center bg-gold/12 text-gold">
          <Icon className="h-5 w-5" strokeWidth={1.7} />
        </span>
        <h2 className="text-2xl font-extrabold text-gold-light">{title}</h2>
      </div>
      <p className="text-sm font-medium text-gold-light/55">{subtitle}</p>
    </div>
  );
}


function VacancyTracker() {
  const revealRef = useReveal();
  const data = vacancyBuckets;

  return (
    <section ref={revealRef} className="mx-auto mt-8 grid w-full max-w-7xl grid-cols-1 gap-4 px-4 lg:grid-cols-[0.85fr_1.15fr] md:px-6">
      <Shell>
        <div className="p-5">
          <SectionTitle icon={SearchCheck} title="تتبع الشواغر" subtitle="توزيع مدة الشغور" />
          <div className="relative mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={70} outerRadius={110} paddingAngle={3} stroke="none">
                  {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip content={<DonutTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="numeric font-playfair text-4xl italic text-gold-light">{nf.format(portfolioKPIs.vacant)}</p>
                <p className="text-sm font-bold text-gold-light/60">وحدة</p>
              </div>
            </div>
          </div>
        </div>
      </Shell>
      <Shell>
        <div className="p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <SectionTitle icon={TrendingDown} title="جميع الوحدات الشاغرة" subtitle={`${nf.format(topVacantUnits.length)} وحدة بعد الاستبعاد`} />
            <a
              href={vacantUnitsSheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-gold/25 bg-card-elevated px-4 py-2.5 text-sm font-extrabold text-gold-light transition hover:border-gold hover:bg-gold/10"
            >
              <ExternalLink className="h-4 w-4" />
              فتح ملف جميع الوحدات الشاغرة
            </a>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="data-table w-full min-w-[760px] border-separate border-spacing-y-2 text-sm">
              <colgroup>
                <col className="w-[150px]" />
                <col className="w-[150px]" />
                <col className="w-[100px]" />
                <col className="w-[150px]" />
                <col className="w-[150px]" />
              </colgroup>
              <thead className="text-gold-light/55">
                <tr>
                  <th className="p-2 text-center">الفرع</th>
                  <th className="p-2 text-center">الوحدة</th>
                  <th className="p-2 text-center">الأيام</th>
                  <th className="p-2 text-center">السعر الشهري</th>
                  <th className="p-2 text-center">الفاقد</th>
                </tr>
              </thead>
              <tbody>
                {topVacantUnits.map((unit) => (
                  <tr key={unit.unitId} className={`${unit.daysVacant > 365 ? "bg-danger/20" : unit.daysVacant >= 180 ? "bg-warning/16" : "bg-card-elevated/70"}`}>
                    <td className="p-3 font-bold text-gold-light"><div className="cell-center">{unit.branch}</div></td>
                    <td className="numeric p-3 font-mono text-gold"><div className="cell-center">{unit.unitId}</div></td>
                    <td className="numeric p-3 font-mono text-danger-light"><div className="cell-center">{nf.format(unit.daysVacant)}</div></td>
                    <td className="numeric p-3 font-mono"><div className="cell-center">{sar.format(unit.monthlyPrice)} ر.س</div></td>
                    <td className="numeric p-3 font-mono text-danger-light"><div className="cell-center">{sar.format(unit.lostValue)} ر.س</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Shell>
    </section>
  );
}

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="border border-gold/25 bg-espresso p-3 font-bold text-gold-light">
      {item.name}: <span className="numeric font-mono">{nf.format(item.value)}</span>
    </div>
  );
}

function DistrictLeaderboard() {
  const revealRef = useReveal();
  const rows = useMemo(() => [...districtSummary].sort((a, b) => b.avgOccupancy - a.avgOccupancy), []);
  return (
    <section ref={revealRef} className="mx-auto mt-8 w-full max-w-7xl px-4 md:px-6">
      <Shell>
        <div className="p-5 md:p-6">
          <SectionTitle icon={MapPin} title="ترتيب الأحياء" subtitle={`${nf.format(rows.length)} حي مرتبة حسب متوسط الإشغال`} />
          <div className="mt-5 space-y-2">
            {rows.map((row, index) => (
              <div key={row.district} className="grid grid-cols-[3rem_1fr] gap-3 border border-gold/10 bg-card-elevated/58 p-3 md:grid-cols-[3rem_10rem_1fr_8rem_7rem] md:items-center">
                <div className="text-center text-lg font-extrabold text-gold-light">{index < 3 ? ["🥇", "🥈", "🥉"][index] : nf.format(index + 1)}</div>
                <div className="font-extrabold text-gold-light">{row.district}</div>
                <OccupancyBar value={row.avgOccupancy} wide />
                <div className="numeric font-mono text-sm text-gold-light/80">{nf.format(row.vacant)} شاغرة</div>
                <div>{row.criticalCount > 0 && <span className="bg-danger/25 px-3 py-1 text-xs font-bold text-danger-light">{nf.format(row.criticalCount)} حرج</span>}</div>
                <div className="text-center text-xs font-bold text-gold-light/62">{nf.format(row.branchCount)} فروع</div>
              </div>
            ))}
          </div>
        </div>
      </Shell>
    </section>
  );
}

function DashboardFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-4 py-10 text-center text-sm text-gold-light/45 md:px-6">
      مصادر البيانات: ملف محفظة مثوى التشغيلي وحسابات الشواغر والفقد الداخلي. جميع البيانات مضمنة محليا دون أي طلبات خارجية.
    </footer>
  );
}

export default function Dashboard() {
  const [filters, setFilters] = useState({ priority: "all", district: "كل", type: "كل" });
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");

  const filteredBranches = useMemo(() => branches.filter((branch) => (
    (filters.priority === "all" || branch.priority === filters.priority) &&
    (filters.district === "كل" || branch.district === filters.district) &&
    (filters.type === "كل" || branch.type === filters.type)
  )), [filters]);

  const filteredVacantUnits = useMemo(() => {
    const branchNames = new Set(filteredBranches.map((branch) => branch.name));
    return topVacantUnits.filter((unit) => branchNames.has(unit.branch));
  }, [filteredBranches]);

  const exportReportToPDF = async () => {
    const element = document.getElementById("report-export-root");
    if (!element || exporting) return;
    setExporting(true);
    setExportError("");
    element.classList.add("pdf-export-mode");

    try {
      await new Promise((resolve) => requestAnimationFrame(resolve));
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        backgroundColor: "#120c05",
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        scrollX: 0,
        scrollY: 0
      });
      const imgData = canvas.toDataURL("image/jpeg", 0.88);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("mathwa-vacancy-intelligence-report-q2-2026.pdf");
    } catch (error) {
      console.error("PDF export failed", error);
      setExportError("تعذر تصدير التقرير. يرجى المحاولة مرة أخرى.");
    } finally {
      element.classList.remove("pdf-export-mode");
      setExporting(false);
    }
  };

  return (
    <main className="min-h-screen bg-espresso font-tajawal text-gold-light">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-gold to-transparent opacity-70" />
      <div id="report-export-root">
        <DashboardHeader onExport={exportReportToPDF} exporting={exporting} exportError={exportError} />
        <HeroKPIBar />
        <FiltersBar filters={filters} setFilters={setFilters} />
        <ExecutiveAnalysis branchesView={filteredBranches} vacantUnitsView={filteredVacantUnits} />
        <BranchHeatmap filteredBranches={filteredBranches} />
        <VacancyTracker />
        <DistrictLeaderboard />
        <DashboardFooter />
      </div>
    </main>
  );
}
