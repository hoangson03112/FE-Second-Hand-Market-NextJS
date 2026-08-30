"use client";

import * as React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/Skeleton";
import { NoData } from "./NoData";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  /** Unique key for the column. */
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
  headerClassName?: string;
  width?: string | number;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  getRowId?: (row: T, index: number) => string | number;
  onRowClick?: (row: T, index: number) => void;
  emptyTitle?: React.ReactNode;
  emptyDescription?: React.ReactNode;
  emptyIcon?: React.ReactNode;
  caption?: React.ReactNode;
  className?: string;
}

const ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

/**
 * DataTable — generic, config-driven table wrapping shadcn `Table` with built-in
 * loading (skeleton rows) and empty ({@link NoData}) states.
 */
export function DataTable<T>({
  columns,
  data,
  loading,
  skeletonRows = 5,
  getRowId,
  onRowClick,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  caption,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-xs", className)}>
      <Table>
        {caption && (
          <caption className="p-3 text-sm text-muted-foreground">{caption}</caption>
        )}
        <TableHeader>
          <TableRow className="border-b border-border/80 bg-muted/40 hover:bg-muted/40">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className={cn(
                  "py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground/80",
                  column.align && ALIGN[column.align],
                  column.headerClassName
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`} className="border-b border-border/60">
                {columns.map((column) => (
                  <TableCell key={column.key} className={cn("py-3.5 px-4", column.className)}>
                    <Skeleton className="h-4 w-full rounded-md" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                <NoData
                  title={emptyTitle ?? "Không có dữ liệu"}
                  description={emptyDescription}
                  icon={emptyIcon}
                  size="sm"
                />
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={getRowId ? getRowId(row, index) : index}
                onClick={onRowClick ? () => onRowClick(row, index) : undefined}
                className={cn(
                  "border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors",
                  onRowClick && "cursor-pointer"
                )}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "py-3.5 px-4 text-sm text-foreground",
                      column.align && ALIGN[column.align],
                      column.className
                    )}
                  >
                    {column.cell(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
