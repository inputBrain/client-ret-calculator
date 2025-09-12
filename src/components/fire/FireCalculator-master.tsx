// "use client";
//
// import { useEffect, useMemo, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import ResultsHeader from "./ResultsHeader";
// import NumberField from "./NumberField";
// import AllocationSliders from "./AllocationSliders";
// import GrowthRateInputs from "./GrowthRateInputs";
// import ToggleGroup from "./ToggleGroup";
// import JourneyChart from "./JourneyChart";
// import DividendInflationChart from "./DividendInflationChart";
// import { currencyFormat } from "@/lib/format";
// import {
//     effectiveAnnualRate,
//     realReturnFromNominalAndInflation,
//     monthsToTargetStandard,
//     monthsToTargetLifeExpGrowing,
//     projectSeries,
//     pvAtRetirementPerpetualReal,
//     pvAtRetirementFiniteGrowing,
// } from "@/lib/finance";
//
// type Currency = "EUR" | "USD" | "GBP";
//
// export default function FireCalculator() {
//     const search = useSearchParams();
//
//     const [currency, setCurrency] = useState<Currency>("EUR");
//
//     const [currentAge, setCurrentAge] = useState<number>(30);
//     const [currentSavings, setCurrentSavings] = useState<number>(10000);
//     const [monthlySavings, setMonthlySavings] = useState<number>(1000);
//
//     const [annualSpending, setAnnualSpending] = useState<number>(40000);
//
//     const [calcMode, setCalcMode] = useState<"withdrawal" | "lifeexp">("withdrawal");
//     const [targetMode, setTargetMode] = useState<"safeRate" | "realReturn">("realReturn");
//     const [withdrawalRate, setWithdrawalRate] = useState<number>(4);
//     const [lifeExpectancyAge, setLifeExpectancyAge] = useState<number>(90);
//
//     const [stocksPct, setStocksPct] = useState<number>(70);
//     const [fixedPct, setFixedPct] = useState<number>(20);
//     const cashPct = useMemo(() => Math.max(0, 100 - stocksPct - fixedPct), [stocksPct, fixedPct]);
//
//     const [stocksRate, setStocksRate] = useState<number>(6.5);
//     const [fixedRate, setFixedRate] = useState<number>(2.5);
//     const [cashRate, setCashRate] = useState<number>(0);
//
//     const [inflationRate, setInflationRate] = useState<number>(2.8);
//     const [dividendYield, setDividendYield] = useState<number>(2);
//
//     useEffect(() => {
//         const get = (k: string, d: number) => {
//             const v = search.get(k);
//             if (v == null) return d;
//             const n = Number(v);
//             return Number.isFinite(n) ? n : d;
//         };
//         const getStr = (k: string, d: string) => {
//             const v = search.get(k);
//             return v ?? d;
//         };
//         setCurrency((getStr("ccy", "EUR") as Currency) || "EUR");
//         setCurrentAge(get("age", 30));
//         setCurrentSavings(get("ps", 10000));
//         setMonthlySavings(get("ms", 1000));
//         setAnnualSpending(get("as", 40000));
//         setCalcMode((getStr("mode", "withdrawal") as "withdrawal" | "lifeexp") || "withdrawal");
//         setTargetMode((getStr("tmode", "realReturn") as "safeRate" | "realReturn") || "realReturn");
//         setWithdrawalRate(get("wr", 4));
//         setLifeExpectancyAge(get("lea", 90));
//         setStocksPct(get("sp", 70));
//         setFixedPct(get("fp", 20));
//         setStocksRate(get("sr", 6.5));
//         setFixedRate(get("fr", 2.5));
//         setCashRate(get("cr", 0));
//         setInflationRate(get("inf", 2.8));
//         setDividendYield(get("dy", 2));
//     }, [search]);
//
//     const annRate = useMemo(
//         () =>
//             effectiveAnnualRate(
//                 { stocks: stocksPct / 100, fixed: fixedPct / 100, cash: cashPct / 100 },
//                 { stocks: stocksRate / 100, fixed: fixedRate / 100, cash: cashRate / 100 }
//             ),
//         [stocksPct, fixedPct, cashPct, stocksRate, fixedRate, cashRate]
//     );
//
//     const realRate = useMemo(() => realReturnFromNominalAndInflation(annRate, inflationRate / 100), [annRate, inflationRate]);
//     const realRatePositive = realRate > 0;
//
//     const annualSavings = useMemo(() => monthlySavings * 12, [monthlySavings]);
//
//     const fireTarget = useMemo(() => {
//         if (calcMode === "withdrawal") {
//             if (targetMode === "safeRate" || !realRatePositive) {
//                 const wr = withdrawalRate / 100;
//                 return wr > 0 ? annualSpending / wr : Infinity;
//             }
//             return pvAtRetirementPerpetualReal(annualSpending, realRate);
//         } else {
//             return 0;
//         }
//     }, [calcMode, targetMode, annualSpending, withdrawalRate, realRate, realRatePositive]);
//
//     const monthsToFI = useMemo(() => {
//         if (calcMode === "withdrawal") {
//             return monthsToTargetStandard(currentSavings, monthlySavings, annRate, fireTarget);
//         } else {
//             return monthsToTargetLifeExpGrowing(
//                 currentSavings,
//                 monthlySavings,
//                 annRate,
//                 inflationRate / 100,
//                 annualSpending,
//                 currentAge,
//                 lifeExpectancyAge
//             );
//         }
//     }, [calcMode, currentSavings, monthlySavings, annRate, fireTarget, annualSpending, currentAge, lifeExpectancyAge, inflationRate]);
//
//     const yearsToFI = useMemo(() => (Number.isFinite(monthsToFI) ? monthsToFI / 12 : Infinity), [monthsToFI]);
//     const retirementAge = useMemo(() => (Number.isFinite(yearsToFI) ? currentAge + yearsToFI : Infinity), [currentAge, yearsToFI]);
//
//     const resolvedTarget = useMemo(() => {
//         if (calcMode === "withdrawal") return fireTarget;
//         if (!Number.isFinite(yearsToFI)) return Infinity;
//         const nYears = Math.max(0, lifeExpectancyAge - (currentAge + yearsToFI));
//         const atRetSpending = annualSpending * Math.pow(1 + inflationRate / 100, yearsToFI);
//         return pvAtRetirementFiniteGrowing(atRetSpending, annRate, inflationRate / 100, nYears);
//     }, [calcMode, fireTarget, yearsToFI, lifeExpectancyAge, currentAge, annualSpending, annRate, inflationRate]);
//
//     const currencySymbol: Record<Currency, string> = { EUR: "€", USD: "$", GBP: "£" };
//
//     const series = useMemo(() => {
//         const horizonMonths = Number.isFinite(monthsToFI) ? Math.min(12 * 60, Math.ceil(monthsToFI)) : 12 * 60;
//         return projectSeries(currentSavings, monthlySavings, annRate, horizonMonths);
//     }, [currentSavings, monthlySavings, annRate, monthsToFI]);
//
//     const divInflSeries = useMemo(() => {
//         const months = series.length ? series[series.length - 1].month : 360;
//         const out: { month: number; dividend: number; spending: number }[] = [];
//         for (let m = 0; m <= months; m++) {
//             const value = projectSeries(currentSavings, monthlySavings, annRate, m).at(-1)!.value;
//             const dividend = value * (dividendYield / 100);
//             const years = m / 12;
//             const spending = annualSpending * Math.pow(1 + inflationRate / 100, years);
//             out.push({ month: m, dividend, spending });
//         }
//         return out;
//     }, [series, currentSavings, monthlySavings, annRate, dividendYield, annualSpending, inflationRate]);
//
//     const shareUrl = useMemo(() => {
//         const p = new URLSearchParams();
//         p.set("ccy", currency);
//         p.set("age", String(currentAge));
//         p.set("ps", String(currentSavings));
//         p.set("ms", String(monthlySavings));
//         p.set("as", String(annualSpending));
//         p.set("mode", calcMode);
//         p.set("tmode", targetMode);
//         p.set("wr", String(withdrawalRate));
//         p.set("lea", String(lifeExpectancyAge));
//         p.set("sp", String(stocksPct));
//         p.set("fp", String(fixedPct));
//         p.set("sr", String(stocksRate));
//         p.set("fr", String(fixedRate));
//         p.set("cr", String(cashRate));
//         p.set("inf", String(inflationRate));
//         p.set("dy", String(dividendYield));
//         const base = typeof window !== "undefined" ? window.location.origin + window.location.pathname : "";
//         return `${base}?${p.toString()}`;
//     }, [
//         currency,
//         currentAge,
//         currentSavings,
//         monthlySavings,
//         annualSpending,
//         calcMode,
//         targetMode,
//         withdrawalRate,
//         lifeExpectancyAge,
//         stocksPct,
//         fixedPct,
//         stocksRate,
//         fixedRate,
//         cashRate,
//         inflationRate,
//         dividendYield,
//     ]);
//
//     return (
//         <div className="mx-auto py-6 grid gap-8 max-tablet:mx-4 max-tablet:w-[calc(100%-32px)] max-tablet:grid-cols-1 max-tablet:py-12 w-[1024px] grid-cols-1">
//             <div className="relative flex flex-col">
//                 <div className="flex flex-col items-center gap-12">
//                     {/*<div className="flex flex-col gap-2">*/}
//                         {/*<div className="flex flex-col items-end">*/}
//                         {/*    <div className="flex items-center gap-2">*/}
//                         {/*        <button*/}
//                         {/*            type="button"*/}
//                         {/*            className="decoration-none relative m-0 flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-[radial-gradient(circle_at_var(--xPos,50%)_var(--yPos,50%),var(--bg2),var(--bg))] text-title-small transition duration-fast ease-curve [--bg2:var(--bg)] disabled:pointer-events-none text-content-interactive-tertiary [--bg:rgb(var(--background-interactive-tertiary-normal))] hover:[--bg2:rgb(var(--background-interactive-tertiary-hoverPress))] disabled:text-content-interactive-tertiary-disabled disabled:[--bg:rgb(var(--background-interactive-tertiary-disabled))] h-8 px-3"*/}
//                         {/*            style={{ "--xPos": "50%", "--yPos": "50%" } as any}*/}
//                         {/*        >*/}
//                         {/*            {currency === "EUR" ? "Euro" : currency === "USD" ? "US Dollar" : "British Pound"}*/}
//                         {/*        </button>*/}
//                         {/*        <select*/}
//                         {/*            className="h-8 rounded-full bg-background-interactive-tertiary text-title-small px-3"*/}
//                         {/*            value={currency}*/}
//                         {/*            onChange={(e) => setCurrency(e.target.value as Currency)}*/}
//                         {/*        >*/}
//                         {/*            <option value="EUR">EUR</option>*/}
//                         {/*            <option value="USD">USD</option>*/}
//                         {/*            <option value="GBP">GBP</option>*/}
//                         {/*        </select>*/}
//                         {/*    </div>*/}
//                         {/*</div>*/}
//
//                         <div className="flex flex-col items-center gap-4 pb-4 pt-20">
//                             <h1 className="text-7xl">FIRE calculator</h1>
//                             <div className="mb-2 text-center">
//                                 <span>FIRE stands for Financial Independence Retire Early. Our calculator will help you work out an investment and savings strategy that could help you join the growing movement of people who aim to retire years earlier than expected.</span>
//                             </div>
//                         </div>
//                     {/*</div>*/}
//
//                     {/*<ResultsHeader*/}
//                     {/*    currency={currency}*/}
//                     {/*    currencySymbol={currencySymbol[currency]}*/}
//                     {/*    target={resolvedTarget}*/}
//                     {/*    retirementAge={retirementAge}*/}
//                     {/*    annualSavings={annualSavings}*/}
//                     {/*/>*/}
//
//                     {/*<div className="grid grid-cols-1 gap-10">*/}
//                     {/*    <div className="rounded-2xl bg-background-screen p-6 shadow-prominent-card">*/}
//                     {/*        <div className="flex flex-col gap-6">*/}
//                     {/*            <div className="text-title-small text-content">Add some information about yourself today:</div>*/}
//                     {/*            <div className="grid grid-cols-1 gap-4 max-tablet:grid-cols-1 tablet:grid-cols-2">*/}
//                     {/*                <NumberField label="Age" value={currentAge} onChange={setCurrentAge} min={0} max={100} suffix="years" />*/}
//                     {/*                <NumberField*/}
//                     {/*                    label="Current savings"*/}
//                     {/*                    value={currentSavings}*/}
//                     {/*                    onChange={setCurrentSavings}*/}
//                     {/*                    min={0}*/}
//                     {/*                    step={100}*/}
//                     {/*                    format={(v) => currencyFormat(v, currency)}*/}
//                     {/*                    parse={(s) => Number(String(s).replace(/[^\d.-]/g, ""))}*/}
//                     {/*                />*/}
//                     {/*                <NumberField*/}
//                     {/*                    label="Monthly savings"*/}
//                     {/*                    value={monthlySavings}*/}
//                     {/*                    onChange={setMonthlySavings}*/}
//                     {/*                    min={0}*/}
//                     {/*                    step={50}*/}
//                     {/*                    format={(v) => currencyFormat(v, currency)}*/}
//                     {/*                    parse={(s) => Number(String(s).replace(/[^\d.-]/g, ""))}*/}
//                     {/*                />*/}
//                     {/*            </div>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//
//                     {/*    <div className="rounded-2xl bg-background-screen p-6 shadow-prominent-card">*/}
//                     {/*        <div className="flex flex-col gap-6">*/}
//                     {/*            <div className="text-title-small text-content">Set your retirement spending and target</div>*/}
//                     {/*            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 max-tablet:grid-cols-1">*/}
//                     {/*                <div className="col-span-2 grid grid-cols-1 gap-4">*/}
//                     {/*                    <NumberField*/}
//                     {/*                        label="Annual retirement spending (today)"*/}
//                     {/*                        value={annualSpending}*/}
//                     {/*                        onChange={setAnnualSpending}*/}
//                     {/*                        min={0}*/}
//                     {/*                        step={500}*/}
//                     {/*                        format={(v) => currencyFormat(v, currency)}*/}
//                     {/*                        parse={(s) => Number(String(s).replace(/[^\d.-]/g, ""))}*/}
//                     {/*                    />*/}
//                     {/*                    <ToggleGroup*/}
//                     {/*                        options={[*/}
//                     {/*                            { value: "withdrawal", label: "Withdrawal mode" },*/}
//                     {/*                            { value: "lifeexp", label: "Life expectancy mode" },*/}
//                     {/*                        ]}*/}
//                     {/*                        value={calcMode}*/}
//                     {/*                        onChange={(v) => setCalcMode(v as any)}*/}
//                     {/*                    />*/}
//                     {/*                </div>*/}
//                     {/*                <div className="col-span-1 grid grid-cols-1 gap-4">*/}
//                     {/*                    {calcMode === "withdrawal" ? (*/}
//                     {/*                        <div className="grid grid-cols-1 gap-3">*/}
//                     {/*                            <ToggleGroup*/}
//                     {/*                                options={[*/}
//                     {/*                                    { value: "realReturn", label: "Real-return formula" },*/}
//                     {/*                                    { value: "safeRate", label: "Safe withdrawal %" },*/}
//                     {/*                                ]}*/}
//                     {/*                                value={targetMode}*/}
//                     {/*                                onChange={(v) => setTargetMode(v as any)}*/}
//                     {/*                            />*/}
//                     {/*                            {targetMode === "safeRate" ? (*/}
//                     {/*                                <NumberField label="Withdrawal rate" value={withdrawalRate} onChange={setWithdrawalRate} min={1} max={10} step={0.1} suffix="% p/a" />*/}
//                     {/*                            ) : null}*/}
//                     {/*                        </div>*/}
//                     {/*                    ) : (*/}
//                     {/*                        <NumberField label="Life expectancy age" value={lifeExpectancyAge} onChange={setLifeExpectancyAge} min={currentAge + 1} max={120} suffix="years" />*/}
//                     {/*                    )}*/}
//                     {/*                </div>*/}
//                     {/*            </div>*/}
//                     {/*            <div className="text-body-small text-content-secondary">*/}
//                     {/*                Real-return formula uses P = W / r where r = (1+R)/(1+i) − 1, withdrawals grow with inflation. Safe withdrawal uses your chosen % on today’s spending.*/}
//                     {/*            </div>*/}
//                     {/*            {!realRatePositive && calcMode === "withdrawal" && targetMode === "realReturn" ? (*/}
//                     {/*                <div className="rounded bg-background-interactive-tertiary px-3 py-2 text-body-small text-content-interactive-secondary">*/}
//                     {/*                    Real return ≤ 0 with current inputs. Target is calculated using Safe withdrawal % instead.*/}
//                     {/*                </div>*/}
//                     {/*            ) : null}*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//
//                     {/*    <div className="rounded-2xl bg-background-screen p-6 shadow-prominent-card">*/}
//                     {/*        <div className="flex flex-col gap-6">*/}
//                     {/*            <div className="text-title-small text-content">Configure your investment strategy:</div>*/}
//                     {/*            <AllocationSliders*/}
//                     {/*                stocksPct={stocksPct}*/}
//                     {/*                fixedPct={fixedPct}*/}
//                     {/*                onChange={(s, f) => {*/}
//                     {/*                    setStocksPct(s);*/}
//                     {/*                    setFixedPct(f);*/}
//                     {/*                }}*/}
//                     {/*            />*/}
//                     {/*            <GrowthRateInputs*/}
//                     {/*                stocksRate={stocksRate}*/}
//                     {/*                fixedRate={fixedRate}*/}
//                     {/*                cashRate={cashRate}*/}
//                     {/*                onChange={(a) => {*/}
//                     {/*                    setStocksRate(a.stocksRate);*/}
//                     {/*                    setFixedRate(a.fixedRate);*/}
//                     {/*                    setCashRate(a.cashRate);*/}
//                     {/*                }}*/}
//                     {/*            />*/}
//                     {/*            <div className="grid grid-cols-1 gap-4 tablet:grid-cols-3 max-tablet:grid-cols-1">*/}
//                     {/*                <NumberField label="Inflation" value={inflationRate} onChange={setInflationRate} min={0} max={20} step={0.1} suffix="% p/a" />*/}
//                     {/*                <NumberField label="Dividend yield" value={dividendYield} onChange={setDividendYield} min={0} max={20} step={0.1} suffix="% p/a" />*/}
//                     {/*                <div className="flex items-center text-title-small text-content">Effective overall rate: {(annRate * 100).toFixed(1)}% • Real rate: {(realRate * 100).toFixed(1)}%</div>*/}
//                     {/*            </div>*/}
//                     {/*            <div className="text-body-small text-content-secondary">Returns, dividend yield and inflation are inputs only. Calculations ignore taxes, fees and slippage.</div>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//
//                     {/*    <div className="flex flex-col gap-8 rounded-2xl bg-background-screen p-10 shadow-prominent-card max-tablet:gap-6 max-tablet:p-4">*/}
//                     {/*        <div className="flex flex-col items-center gap-2">*/}
//                     {/*            <div className="text-caption-small text-content-interactive-secondary max-tablet:text-center"><span>The journey ahead</span></div>*/}
//                     {/*            <h2 className="text-headline-small text-content">Projection</h2>*/}
//                     {/*        </div>*/}
//                     {/*        <JourneyChart*/}
//                     {/*            currency={currency}*/}
//                     {/*            currencySymbol={currencySymbol[currency]}*/}
//                     {/*            series={series}*/}
//                     {/*            target={Number.isFinite(resolvedTarget) ? resolvedTarget : undefined}*/}
//                     {/*        />*/}
//                     {/*        <DividendInflationChart*/}
//                     {/*            currency={currency}*/}
//                     {/*            currencySymbol={currencySymbol[currency]}*/}
//                     {/*            series={divInflSeries}*/}
//                     {/*        />*/}
//                     {/*        <div className="flex gap-3">*/}
//                     {/*            <button*/}
//                     {/*                type="button"*/}
//                     {/*                className="decoration-none relative m-0 flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-[radial-gradient(circle_at_var(--xPos,50%)_var(--yPos,50%),var(--bg2),var(--bg))] text-title-small transition duration-fast ease-curve [--bg2:var(--bg)] disabled:pointer-events-none blur-4 text-content-interactive-secondary [--bg:rgb(var(--background-interactive-secondary-normal))] hover:[--bg2:rgb(var(--background-interactive-secondary-hoverPress))] disabled:text-content-interactive-secondary-disabled disabled:[--bg:rgb(var(--background-interactive-secondary-disabled))] h-12 px-4 w-full"*/}
//                     {/*                style={{ "--xPos": "50%", "--yPos": "50%" } as any}*/}
//                     {/*                onClick={() => navigator.clipboard.writeText(shareUrl)}*/}
//                     {/*            >*/}
//                     {/*                Share*/}
//                     {/*            </button>*/}
//                     {/*            <a*/}
//                     {/*                href={shareUrl}*/}
//                     {/*                className="decoration-none relative m-0 flex cursor-pointer select-none items-center justify-center gap-2 overflow-hidden rounded-full border-none bg-[radial-gradient(circle_at_var(--xPos,50%)_var(--yPos,50%),var(--bg2),var(--bg))] text-title-small transition duration-fast ease-curve [--bg2:var(--bg)] disabled:pointer-events-none text-content-inverse [--bg:rgb(var(--background-interactive-primary-normal))] hover:[--bg2:rgb(var(--background-interactive-primary-hoverPress))] disabled:text-content-inverse disabled:[--bg:rgb(var(--background-interactive-primary-disabled))] h-12 px-4 w-full text-center"*/}
//                     {/*                style={{ "--xPos": "50%", "--yPos": "50%" } as any}*/}
//                     {/*            >*/}
//                     {/*                Open shared link*/}
//                     {/*            </a>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//
//                     {/*    <div className="flex flex-col px-[70px] text-body-medium text-content max-tablet:px-4">*/}
//                     {/*        <div>*/}
//                     {/*            <p className="pb-4 last:pb-0">The calculator excludes any current pension arrangements. Future income available to you may increase if you have a pension, once you reach the age at which you are able to access these investments.</p>*/}
//                     {/*            <p className="pb-4 last:pb-0">The calculation assumes you invest savings monthly, that the rate of return remains constant, and that interest compounds monthly. Forecasts are not a reliable indicator of future performance.</p>*/}
//                     {/*        </div>*/}
//                     {/*    </div>*/}
//
//                     {/*    <div className="text-body-large text-content-secondary">*/}
//                     {/*        <div className="pb-2">Based on this information, the FIRE calculator will give you:</div>*/}
//                     {/*        <ul className="list-disc pl-6">*/}
//                     {/*            <li><strong>your FIRE target</strong> using either a real-return or safe withdrawal approach</li>*/}
//                     {/*            <li><strong>projected annual savings</strong> and expected retirement age</li>*/}
//                     {/*            <li><strong>dividends vs inflation</strong> comparison over time</li>*/}
//                     {/*        </ul>*/}
//                     {/*    </div>*/}
//                     {/*</div>*/}
//                 </div>
//             </div>
//         </div>
//     );
// }
