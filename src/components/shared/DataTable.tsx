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
import { Skeleton } from "@/components/ui/skeleton";
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
    <div className={cn("w-full overflow-x-auto rounded-xl border border-border", className)}>
      <Table>
        {caption && (
          <caption className="p-2 text-sm text-muted-foreground">{caption}</caption>
        )}
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                style={column.width ? { width: column.width } : undefined}
                className={cn(column.align && ALIGN[column.align], column.headerClassName)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, rowIndex) => (
              <TableRow key={`skeleton-${rowIndex}`}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    <Skeleton className="h-4 w-full" />
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
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(column.align && ALIGN[column.align], column.className)}
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
