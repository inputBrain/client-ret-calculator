const round2 = (x: number) => Math.round(x * 100) / 100;
const effMonthly = (apr: number) => Math.pow(1 + apr, 1 / 12) - 1;

export function effectiveAnnualRate(
    weights: { stocks: number; fixed: number; cash: number },
    rates: { stocks: number; fixed: number; cash: number }
) {
    const w = Math.max(0, Math.min(1, weights.stocks)) + Math.max(0, Math.min(1, weights.fixed)) + Math.max(0, Math.min(1, weights.cash));
    const ns = w === 0 ? { s: 0, f: 0, c: 0 } : {
        s: Math.max(0, Math.min(1, weights.stocks)) / w,
        f: Math.max(0, Math.min(1, weights.fixed)) / w,
        c: Math.max(0, Math.min(1, weights.cash)) / w
    };
    return ns.s * rates.stocks + ns.f * rates.fixed + ns.c * rates.cash;
}

export function realReturnFromNominal(R_nominal: number, i_infl: number) {
    return (1 + R_nominal) / (1 + i_infl) - 1;
}


type ProjectionRow = {
    yearIdx: number;
    age: number;
    depositStart: number;
    contribYear: number;
    interestYear: number;
    totalEnd: number;
    totalEndReal: number;
};

export function projectWithInflation(params: {
    startAge: number;
    years: number;
    principal: number;
    contribYear: number;
    nominalReturn: number;
    inflation: number;
}): ProjectionRow[] {
    const { startAge, years, principal, contribYear, nominalReturn, inflation } = params;

    const PM = round2(contribYear / 12);
    // const rM = effMonthly(nominalReturn);
    const rM = nominalReturn / 12;

    const rows: ProjectionRow[] = [];

    rows.push({
        yearIdx: 0,
        age: startAge,
        depositStart: round2(principal),
        contribYear: 0,
        interestYear: 0,
        totalEnd: round2(principal),
        totalEndReal: round2(principal),
    });

    let bal = round2(principal);
    for (let y = 1; y <= Math.max(0, years); y++) {
        const age = startAge + y;
        const depositStart = bal;

        let interestYear = 0;


        for (let m = 0; m < 12; m++) {
            const interest = round2(bal * rM);
            interestYear = round2(interestYear + interest);
            bal = round2(bal + interest);
            bal = round2(bal + PM);
        }

        const endNominal = round2(bal);

        const discount = inflation === 0 ? 1 : Math.pow(1 + inflation, y);
        const endReal = endNominal / discount;

        rows.push({
            yearIdx: y,
            age,
            depositStart: round2(depositStart),
            contribYear: round2(PM * 12),
            interestYear: round2(interestYear),
            totalEnd: endNominal,
            totalEndReal: endReal,
        });
    }

    return rows;
}
export function monthsToTargetLifeExp_LY(
    P0: number, C_year: number, R_nominal: number,
    W_today: number, currentAge: number, lifeExpectancyAge: number
) {

    const C = C_year;
    let n = monthsToTargetStandard(P0, C, R_nominal, W_today / 0.04);
    for (let i = 0; i < 120; i++) {
        const yearsToFi = n / 12;
        const yearsInRet = Math.max(0, lifeExpectancyAge - (currentAge + yearsToFi));
        const target = W_today * yearsInRet;
        const n2 = monthsToTargetStandard(P0, C, R_nominal, target);
        if (!isFinite(n2)) return Infinity;
        if (Math.abs(n2 - n) < 0.5) return n2;
        n = n2;
    }
    return n;
}
export function pvAtRetirementPerpetualReal(W_today: number, r_real: number) {
    if (r_real <= 0) return Infinity;
    return W_today / r_real;
}

export function pvAtRetirementFiniteGrowing(W_at_retirement: number, R_nominal: number, g_infl: number, years: number) {
    if (years <= 0) return 0;
    if (Math.abs(R_nominal - g_infl) < 1e-9) return W_at_retirement * years;
    const ratio = (1 + g_infl) / (1 + R_nominal);
    return W_at_retirement * (1 - Math.pow(ratio, years)) / (R_nominal - g_infl);
}

export function monthsToTargetStandard(P0: number, C: number, annualReturn: number, target: number) {
    // const r = Math.pow(1 + annualReturn, 1 / 12) - 1;
    const r = annualReturn / 12;

    if (!isFinite(target)) return Infinity;
    if (C <= 0 && P0 >= target) return 0;
    if (r === 0) {
        if (C === 0) return Infinity;
        const n = (target - P0) / C;
        return n < 0 ? 0 : n;
    }
    const A = (target + C / r) / (P0 + C / r);
    if (A <= 0) return Infinity;
    const n = Math.log(A) / Math.log(1 + r);
    return n < 0 ? 0 : n;
}

export function monthsToTargetLifeExpGrowing(P0: number, C: number, R_nominal: number, g_infl: number, W_today: number, currentAge: number, lifeExpectancyAge: number) {
    let n = monthsToTargetStandard(P0, C, R_nominal, W_today / 0.04);
    let iter = 0;
    while (iter < 80) {
        const yearsToFi = n / 12;
        const retirementAge = currentAge + yearsToFi;
        const yearsInRetirement = Math.max(0, lifeExpectancyAge - retirementAge);
        const spendingAtRetirement = W_today * Math.pow(1 + g_infl, yearsToFi);
        const target = pvAtRetirementFiniteGrowing(spendingAtRetirement, R_nominal, g_infl, yearsInRetirement);
        const n2 = monthsToTargetStandard(P0, C, R_nominal, target);
        if (!isFinite(n2)) return Infinity;
        if (Math.abs(n2 - n) < 1) return n2;
        n = n2;
        iter++;
    }
    return n;
}

export function projectSeries(P0: number, C: number, annualReturn: number, months: number) {
    // const r = effMonthly(annualReturn);
    const r = annualReturn / 12;
    const out: { month: number; value: number }[] = [];
    let fv = P0;
    for (let m = 0; m <= months; m++) {
        out.push({ month: m, value: fv });
        fv = fv * (1 + r) + C;
    }
    return out;
}
