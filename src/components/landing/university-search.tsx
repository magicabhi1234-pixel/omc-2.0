"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Search } from "lucide-react";
import type { University } from "@/types/landing";

type Props = {
  universities: University[];
};

const HIGHLIGHT_CLASS = "university-card-highlight";
const HIGHLIGHT_DURATION_MS = 2000;

export default function UniversitySearch({ universities }: Props) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];
    return universities.filter((university) => university.name.toLowerCase().includes(trimmed));
  }, [query, universities]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const selectUniversity = (university: University) => {
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);

    const target = document.getElementById(`university-card-${university.id}`);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "center" });
    target.classList.add(HIGHLIGHT_CLASS);
    window.setTimeout(() => target.classList.remove(HIGHLIGHT_CLASS), HIGHLIGHT_DURATION_MS);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    if (!isOpen || results.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => (current - 1 + results.length) % results.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      const chosen = results[activeIndex] ?? results[0];
      if (chosen) selectUniversity(chosen);
    }
  };

  if (universities.length === 0) return null;

  return (
    <div ref={containerRef} className="relative mt-6 w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 transition focus-within:ring-2 focus-within:ring-[#F47C45]">
        <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden="true" />

        <label htmlFor="university-page-search" className="sr-only">
          Search universities on this page
        </label>

        <input
          id="university-page-search"
          type="text"
          role="combobox"
          aria-expanded={isOpen && results.length > 0}
          aria-controls="university-page-search-listbox"
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search University"
          className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul
          id="university-page-search-listbox"
          role="listbox"
          className="absolute z-[99999] mt-2 max-h-72 w-full overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-black/5"
        >
          {results.map((university, index) => (
            <li key={university.id} role="option" aria-selected={index === activeIndex}>
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectUniversity(university)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`block w-full px-4 py-3 text-left text-sm transition ${
                  index === activeIndex ? "bg-orange-50 text-[#0B3B68]" : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {university.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
