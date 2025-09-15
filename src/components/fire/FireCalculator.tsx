"use client";

import React, {useEffect, useState} from "react";
import {useSearchParams} from "next/navigation";
import {AllocationTriple} from "@/components/ui/AllocationTriple";
import CurrencySelect from "@/components/ui/CurrencySelect";
import SituationBlock from "@/components/ui/SituationBlock";
import {CURRENCY_META} from "@/lib/currency";
import RetirementBlock from "@/components/ui/RetirementBlock";

type Currency = "EUR" | "USD" | "GBP";

export default function FireCalculator() {
    const search = useSearchParams();

    const [currency, setCurrency] = useState<Currency>("EUR");

    const [stocksPct, setStocksPct] = useState<number>(70);
    const [fixedPct, setFixedPct] = useState<number>(20);
    const symbol = CURRENCY_META[currency].symbol;
    const [age, setAge] = useState<number>(30);
    const [currentSavings, setCurrentSavings] = useState<number>(20000);
    const [savingMonthly, setSavingMonthly] = useState<number>(3000);

    const [annualSpend, setAnnualSpend] = useState<number>(0);


    useEffect(() => {
        const get = (k: string, d: number) => {
            const v = search.get(k);
            if (v == null) return d;
            const n = Number(v);
            return Number.isFinite(n) ? n : d;
        };
        const getStr = (k: string, d: string) => {
            const v = search.get(k);
            return v ?? d;
        };
        setCurrency((getStr("ccy", "EUR") as Currency) || "EUR");
        setStocksPct(get("sp", 70));
        setFixedPct(get("fp", 20));
    }, [search]);

    return (
        <>
            <div
                className="mx-auto py-6 grid gap-8 max-tablet:mx-4 max-tablet:w-[calc(100%-32px)] max-tablet:grid-cols-1 max-tablet:py-12 w-[1024px] grid-cols-1">
                <div className="relative flex flex-col">
                    <div className="flex flex-col items-center gap-12">

                        <div className="flex flex-col items-center gap-4 pb-4 pt-20">
                            <h1 className="text-7xl font-[Mulish]">FIRE calculator</h1>
                            <div className="mb-2 text-center">
                                <span>FIRE stands for Financial Independence Retire Early. Our calculator will help you work out an investment and savings strategy that could help you join the growing movement of people who aim to retire years earlier than expected.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div
                className="mx-auto grid gap-8 py-16 max-tablet:mx-4 max-tablet:w-[calc(100%-32px)] max-tablet:grid-cols-1 max-tablet:py-12 w-[1024px] grid-cols-1">
                <div className="relative flex flex-col">
                    <div className="flex flex-col gap-10">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col items-end">
                                <div className="flex justify-end">
                                    <CurrencySelect value={currency} onValueChangeAction={setCurrency}/>
                                </div>
                            </div>

                            <div className="flex gap-4 max-tablet:flex-col">
                                <div className="flex w-full flex-col gap-4">
                                    <div
                                        className="flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div
                                                    className="text-sm font-bold uppercase text-indigo-800 max-tablet:text-center">
                                                    Today
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center">
                                                    Your situation
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">

                                            <SituationBlock
                                                currencySymbol={symbol}
                                                age={age}
                                                setAge={setAge}
                                                currentSavings={currentSavings}
                                                setCurrentSavings={setCurrentSavings}
                                                savingMonthly={savingMonthly}
                                                setSavingMonthly={setSavingMonthly}
                                            />

                                        </div>

                                    </div>






                                    <div
                                        className="flex flex-1 flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)] ring-1 ring-gray-100/60">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div
                                                    className="text-sm font-bold uppercase text-indigo-800 max-tablet:text-center">
                                                    Later
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center">
                                                    Your retirement
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">



                                            <RetirementBlock
                                                currencySymbol={symbol}
                                                annualSpend={annualSpend}
                                                setAnnualSpend={setAnnualSpend}
                                            />



                                        {/*    <div*/}
                                        {/*        className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&amp;_&gt;_*:first-child]:flex-[1_1_30%] [&amp;_&gt;_*:nth-child(2)]:flex-[1_1_70%]">*/}
                                        {/*        <span*/}
                                        {/*            className="text-sm text-shadow-2xs  [&amp;_strong]:font-medium [&amp;_strong]:text-content">*/}
                                        {/*            <div className="flex flex-1 items-center gap-1">*/}
                                        {/*                <span>Projection mode</span>*/}
                                        {/*                <svg*/}
                                        {/*                    className="flex-[0_0_auto] size-3 fill-content-interactive-secondary"*/}
                                        {/*                    width="24" height="24" viewBox="0 0 24 24" fill="none"*/}
                                        {/*                    xmlns="http://www.w3.org/2000/svg">*/}
                                        {/*                    <path fill-rule="evenodd" clip-rule="evenodd"*/}
                                        {/*                          d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM14.5 6.5C14.5 7.88071 13.3807 9 12 9C10.6193 9 9.5 7.88071 9.5 6.5C9.5 5.11929 10.6193 4 12 4C13.3807 4 14.5 5.11929 14.5 6.5ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12V18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18V12Z">*/}
                                        {/*                    </path>*/}
                                        {/*                </svg>*/}
                                        {/*            </div>*/}
                                        {/*        </span>*/}
                                        {/*        <div className="flex w-full flex-col gap-2" data-state="closed"*/}
                                        {/*             aria-expanded="false" aria-haspopup="menu" id="«rp»">*/}
                                        {/*            <div className="flex flex-col gap-2">*/}
                                        {/*                <div*/}
                                        {/*                    className="group focus-within:-m-[1px] active:-m-[1px] data-[focus]:-m-[1px] relative min-h-12 rounded-lg border border-border-secondary  focus-within:border-2 focus-within:shadow-[0_0_0px_4px_rgb(var(--content-interactive-tertiary)/0.15)] active:border-2 active:shadow-[0_0_0px_4px_rgb(var(--content-interactive-tertiary)/0.15)] data-[focus]:border-2 data-[focus]:shadow-[0_0_0px_4px_rgb(var(--content-interactive-tertiary)/0.15)] hover:border-border-primary">*/}
                                        {/*                    <div className="flex items-center">*/}
                                        {/*                        <div*/}
                                        {/*                            className="flex w-full items-center rounded border-0 px-3 text-content outline-none h-[46px] cursor-pointer text-sm text-shadow-2xs"*/}
                                        {/*                            id="">Life Expectancy*/}
                                        {/*                        </div>*/}
                                        {/*                        <div className="mr-3 leading-[0]">*/}
                                        {/*                            <button type="button"*/}
                                        {/*                                    className="group inline-flex cursor-pointer flex-col items-center gap-2 rounded-full -translate-y-1/2 absolute top-1/2 right-3"*/}
                                        {/*                                    aria-label="Show options">*/}
                                        {/*                                <div*/}
                                        {/*                                    className="icon-wrapper flex cursor-pointer items-center justify-center rounded-full group-hover:bg-background-interactive-tertiary-hoverPress group-active:bg-background-interactive-tertiary-active size-8">*/}
                                        {/*                                    <svg width="24" height="24"*/}
                                        {/*                                         viewBox="0 0 24 24" fill="none"*/}
                                        {/*                                         xmlns="http://www.w3.org/2000/svg"*/}
                                        {/*                                         className="flex-[0_0_auto] size-5 fill-content-interactive-tertiary">*/}
                                        {/*                                        <path fill-rule="evenodd"*/}
                                        {/*                                              clip-rule="evenodd"*/}
                                        {/*                                              d="M7.29289 10.3034C7.68342 9.89888 8.31658 9.89888 8.70711 10.3034L12 13.714L15.2929 10.3034C15.6834 9.89888 16.3166 9.89888 16.7071 10.3034C17.0976 10.7079 17.0976 11.3637 16.7071 11.7681L13.0607 15.545C12.4749 16.1517 11.5251 16.1517 10.9393 15.545L7.29289 11.7681C6.90237 11.3637 6.90237 10.7079 7.29289 10.3034Z">*/}
                                        {/*                                        </path>*/}
                                        {/*                                    </svg>*/}
                                        {/*                                </div>*/}
                                        {/*                            </button>*/}
                                        {/*                        </div>*/}
                                        {/*                    </div>*/}
                                        {/*                </div>*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div*/}
                                        {/*        className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&amp;_&gt;_*:first-child]:flex-[1_1_30%] [&amp;_&gt;_*:nth-child(2)]:flex-[1_1_70%]">*/}
                                        {/*        <span*/}
                                        {/*            className="text-sm text-shadow-2xs  [&amp;_strong]:font-medium [&amp;_strong]:text-content">*/}
                                        {/*            <div className="flex flex-1 items-center gap-1">*/}
                                        {/*                <span>Annual spending</span>*/}
                                        {/*                <svg*/}
                                        {/*                    className="flex-[0_0_auto] size-3 fill-content-interactive-secondary"*/}
                                        {/*                    width="24" height="24" viewBox="0 0 24 24" fill="none"*/}
                                        {/*                    xmlns="http://www.w3.org/2000/svg">*/}
                                        {/*                    <path fill-rule="evenodd" clip-rule="evenodd"*/}
                                        {/*                          d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM14.5 6.5C14.5 7.88071 13.3807 9 12 9C10.6193 9 9.5 7.88071 9.5 6.5C9.5 5.11929 10.6193 4 12 4C13.3807 4 14.5 5.11929 14.5 6.5ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12V18C14 19.1046 13.1046 20 12 20C10.8954 20 10 19.1046 10 18V12Z">*/}
                                        {/*                    </path>*/}
                                        {/*                </svg>*/}
                                        {/*            </div>*/}
                                        {/*        </span>*/}
                                        {/*        <div className="flex w-full flex-col gap-2">*/}
                                        {/*            <div className="flex flex-col gap-2">*/}
                                        {/*                <div*/}
                                        {/*                    className="focus-within:-m-px relative min-h-12 rounded-lg border focus-within:border-2 focus-within:border-content-interactive-tertiary focus-within:shadow-[0_0_0_4px_rgb(var(--content-interactive-tertiary)/0.15)] focus:outline-none border-border-secondary">*/}
                                        {/*                    <input inputMode="decimal"*/}
                                        {/*                           className="flex h-full w-full items-center rounded-lg border-0  px-3 py-[14px] text-sm text-shadow-2xs text-content outline-none placeholder:text-content-tertiary focus:outline-none"*/}
                                        {/*                           type="text" value="€40,000"/>*/}
                                        {/*                </div>*/}
                                        {/*            </div>*/}
                                        {/*        </div>*/}
                                        {/*    </div>*/}
                                        {/*    <div*/}
                                        {/*        className="-mx-3 flex min-h-12 items-center justify-between gap-1 rounded bg-background-interactive-tertiary px-3 py-2 [&amp;_&gt;_*:first-child]:flex-[1_1_30%] [&amp;_&gt;_*:nth-child(2)]:flex-[1_1_70%] [&amp;&gt;*:nth-child(1)]:flex-[0_0_15%] [&amp;&gt;*:nth-child(2)]:flex-[0_0_15%] [&amp;&gt;*:nth-child(2)]:text-center [&amp;&gt;*:nth-child(3)]:flex-[0_0_70%]">*/}
                                        {/*        <span*/}
                                        {/*            className="text-sm text-shadow-2xs  [&amp;_strong]:font-medium [&amp;_strong]:text-content">*/}
                                        {/*            Life Expectancy*/}
                                        {/*        </span>*/}
                                        {/*        <div className="text-sm text-shadow-2xs-bold text-content">*/}
                                        {/*            58*/}
                                        {/*        </div>*/}
                                        {/*        /!*<span className="relative flex h-14 w-full touch-none select-none items-center" dir="ltr" data-orientation="horizontal" aria-disabled="false"*!/*/}
                                        {/*        /!*      style="--radix-slider-thumb-transform: translateX(-50%);">*!/*/}
                                        {/*        /!*    <span data-orientation="horizontal" className="relative h-1 flex-grow bg-background-neutral">*!/*/}
                                        {/*        /!*        <span data-orientation="horizontal" className="absolute h-full bg-background-interactive-primary"*!/*/}
                                        {/*        /!*              style="left: 0%; right: 57.4074%;"></span>*!/*/}
                                        {/*        /!*    </span>*!/*/}
                                        {/*        /!*    <span style="transform: var(--radix-slider-thumb-transform); position: absolute; left: calc(42.5926% + 2.37037px);">*!/*/}
                                        {/*        /!*        <span className="relative block rounded-full bg-background-interactive-primary hover:bg-background-interactive-primary-hoverPress focus:outline-none active:bg-background-interactive-primary-active size-8" role="slider" aria-valuemin="12" aria-valuemax="120" aria-orientation="horizontal" data-orientation="horizontal" tabIndex="0" aria-describedby="«ru»" data-radix-collection-item="" aria-valuenow="58" style=""></span>*!/*/}
                                        {/*        /!*    </span>*!/*/}
                                        {/*        /!*</span>*!/*/}
                                        {/*    </div>*/}
                                        {/*    <div className="text-body-small ">Withdrawal rate is*/}
                                        {/*        the percentage of your savings that you plan to spend each year of*/}
                                        {/*        retirement. 4% is a common target for a 30 year retirement.*/}
                                        {/*        Alternatively, you can determine your FIRE target based on how old you*/}
                                        {/*        plan to live until!*/}
                                        {/*    </div>*/}




                                        </div>

                                    </div>











                                </div>


                                <div className="flex w-full flex-col gap-4">
                                    <div className="flex flex-1 flex-col gap-6 rounded-2xl px-8 py-12 max-tablet:gap-4 max-tablet:px-4 max-tablet:py-6 border border-gray-100 red p-6 shadow-[0_10px_30px_-1px_rgba(16,24,40,0.12),0_2px_6px_rgba(16,24,40,0.04)]">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="flex flex-col items-center gap-2">
                                                <div
                                                    className="text-sm font-bold uppercase text-indigo-800 max-tablet:text-center">
                                                    The plan
                                                </div>
                                                <h5 className="text-2xl font-semibold max-tablet:text-center">
                                                    Your investing strategy
                                                </h5>
                                            </div>
                                        </div>
                                        <div className="flex flex-col">


                                            <AllocationTriple
                                                currency={currency}
                                                stocksPct={stocksPct}
                                                fixedPct={fixedPct}
                                                setStocksPct={setStocksPct}
                                                setFixedPct={setFixedPct}
                                            />

                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
