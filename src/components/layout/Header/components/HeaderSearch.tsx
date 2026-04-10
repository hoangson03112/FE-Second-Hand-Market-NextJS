import { IconSearch } from "@tabler/icons-react";

interface HeaderSearchProps {
  query: string;
  setQuery: (value: string) => void;
  submitSearch: (event?: React.FormEvent) => void;
}

export function HeaderSearch({ query, setQuery, submitSearch }: HeaderSearchProps) {
  return (
    <form
      onSubmit={submitSearch}
      role="search"
      className="hidden xl:flex min-w-0 flex-1 max-w-[320px] 2xl:max-w-[420px]"
    >
      <div className="relative w-full">
        <IconSearch
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none text-muted-foreground"
        />
        <input
          id="header-search"
          name="search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Tìm kiếm..."
          className="h-9 w-full rounded-full border border-taupe-200 bg-white pl-9 pr-4 text-[13px] font-medium text-taupe-900 placeholder:text-taupe-400 transition-all duration-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      </div>
    </form>
  );
}
