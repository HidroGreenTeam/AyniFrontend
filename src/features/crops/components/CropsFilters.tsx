"use client";

import { Filter, ChevronDown } from "lucide-react";

interface CropsFiltersProps {
    filterType: string;
    filterStatus: string;
    cropTypes: string[];
    onFilterTypeChange: (type: string) => void;
    onFilterStatusChange: (status: string) => void;
}

export default function CropsFilters({
    filterType,
    filterStatus,
    cropTypes,
    onFilterTypeChange,
    onFilterStatusChange
}: CropsFiltersProps) {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm flex flex-wrap gap-3 items-center border border-gray-100 dark:border-gray-700">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar por:
            </div>

            <div className="relative">
                <select 
                    value={filterType}
                    onChange={(e) => onFilterTypeChange(e.target.value)}
                    className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="all">Todos los cultivos</option>
                    {cropTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
                <select 
                    value={filterStatus}
                    onChange={(e) => onFilterStatusChange(e.target.value)}
                    className="appearance-none bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                    <option value="all">Todos los estados</option>
                    <option value="healthy">Saludable</option>
                    <option value="risk">En riesgo</option>
                    <option value="sick">Enfermo</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
        </div>
    );
}
