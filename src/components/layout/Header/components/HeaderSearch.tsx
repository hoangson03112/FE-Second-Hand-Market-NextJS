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
          className="w-full h-9 pl-9 pr-4 text-[13px] font-medium text-taupe-900 placeholder:text-taupe-400 focus:outline-none transition-all duration-200"
          style={{ background: "var(--secondary)", border: "1.5px solid transparent", borderRadius: "9999px" }}
          onFocus={(event) => {
            event.target.style.background = "var(--card)";
            event.target.style.borderColor = "var(--primary)";
            event.target.style.boxShadow = "0 0 0 3px color-mix(in oklch, var(--primary) 13%, transparent)";
          }}
          onBlur={(event) => {
            event.target.style.background = "var(--secondary)";
            event.target.style.borderColor = "transparent";
            event.target.style.boxShadow = "none";
          }}
        />
      </div>
    </form>
  );
}
