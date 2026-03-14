"use client";

import { Category, RelationshipMode } from "@/types";
import { getAvailableCategories } from "@/lib/game";

interface CategoryFilterProps {
  activeCategories: Category[] | "all";
  onCategoryChange: (categories: Category[] | "all") => void;
  relationshipMode: RelationshipMode;
  customQuestionsExist: boolean;
}

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
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          isAllActive
            ? "bg-accent text-white"
            : "bg-track text-text-primary hover:bg-border"
        }`}
      >
        All
      </button>

      {allCategories.map((category) => {
        const isActive =
          activeCategories !== "all" && activeCategories.includes(category);

        return (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`px-3 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              isActive
                ? "bg-accent text-white"
                : "bg-track text-text-primary hover:bg-border"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
