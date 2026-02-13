"use client";

import { Category, RelationshipMode } from "@/types";
import { getAvailableCategories } from "@/lib/game";

interface CategoryFilterProps {
  activeCategories: Category[] | "all";
  onCategoryChange: (categories: Category[] | "all") => void;
  relationshipMode: RelationshipMode;
  customQuestionsExist: boolean;
}

const categoryColors: Record<Category, string> = {
  general: "bg-amber-500",
  funny: "bg-yellow-500",
  "would-you-rather": "bg-sky-500",
  deep: "bg-indigo-500",
  spicy: "bg-orange-500",
  nostalgia: "bg-teal-500",
  intimate: "bg-rose-500",
  nsfw: "bg-purple-500",
  custom: "bg-stone-500",
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
    <div className="flex flex-wrap gap-2">
      <button
        onClick={handleAllClick}
        className={`px-4 py-2 rounded-full font-sans font-medium text-sm transition-colors ${
          isAllActive
            ? "bg-stone-500 text-white"
            : "border border-border text-text-primary hover:bg-track"
        }`}
      >
        All
      </button>

      {allCategories.map((category) => {
        const isActive =
          activeCategories !== "all" && activeCategories.includes(category);
        const color = categoryColors[category];

        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-4 py-2 rounded-full font-sans font-medium text-sm transition-colors capitalize ${
              isActive
                ? `${color} text-white`
                : "border border-border text-text-primary hover:bg-track"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
