"use client";

import { Category, RelationshipMode } from "@/types";
import { getAvailableCategories } from "@/lib/game";

interface CategoryFilterProps {
  activeCategories: Category[] | "all";
  onCategoryChange: (categories: Category[] | "all") => void;
  relationshipMode: RelationshipMode;
  customQuestionsExist: boolean;
}

const categoryConfig: Record<Category, { icon: string; gradient: string }> = {
  general: { icon: "💡", gradient: "from-amber-400 to-yellow-500" },
  funny: { icon: "😄", gradient: "from-yellow-400 to-yellow-500" },
  "would-you-rather": { icon: "🤔", gradient: "from-blue-400 to-cyan-500" },
  deep: { icon: "🌊", gradient: "from-indigo-400 to-purple-500" },
  spicy: { icon: "🔥", gradient: "from-orange-400 to-red-500" },
  nostalgia: { icon: "🎬", gradient: "from-teal-400 to-cyan-500" },
  intimate: { icon: "💕", gradient: "from-rose-400 to-pink-500" },
  nsfw: { icon: "⚡", gradient: "from-purple-400 to-pink-500" },
  custom: { icon: "✨", gradient: "from-slate-400 to-slate-500" },
};

export function CategoryFilter({
  activeCategories,
  onCategoryChange,
  relationshipMode,
  customQuestionsExist,
}: CategoryFilterProps) {
  const availableCategories = getAvailableCategories(relationshipMode);
  const allCategories = customQuestionsExist
    ? availableCategories
    : availableCategories.filter((c) => c !== "custom");

  const handleAllClick = () => {
    onCategoryChange("all");
  };

  const handleCategoryClick = (category: Category) => {
    if (activeCategories === "all") {
      onCategoryChange([category]);
    } else {
      const newCategories = activeCategories.includes(category)
        ? activeCategories.filter((c) => c !== category)
        : [...activeCategories, category];

      if (newCategories.length === 0) {
        onCategoryChange([category]);
      } else {
        onCategoryChange(newCategories);
      }
    }
  };

  const isAllActive = activeCategories === "all";

  return (
    <div className="flex flex-wrap gap-3">
      <button
        onClick={handleAllClick}
        className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
          isAllActive
            ? "bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-400 dark:to-slate-500 text-white shadow-lg"
            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
        }`}
      >
        All
      </button>

      {allCategories.map((category) => {
        const isActive =
          activeCategories !== "all" && activeCategories.includes(category);
        const config = categoryConfig[category];

        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 flex items-center gap-1.5 capitalize ${
              isActive
                ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg`
                : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
            }`}
          >
            <span>{config.icon}</span>
            <span className="hidden xs:inline">{category}</span>
          </button>
        );
      })}
    </div>
  );
}
