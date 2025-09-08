"use client";

import { Button } from "@/components/ui/button";

export default function Footer() {
    return (
        <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="text-xl font-bold text-gray-900">Lightyear</div>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline">Log in</Button>
                        <Button className="bg-violet-600 hover:bg-violet-700">Sign up</Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
