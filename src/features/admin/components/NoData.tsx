import * as React from "react";
import { Inbox } from "lucide-react";

import { EmptyState, type EmptyStateProps } from "./EmptyState";

export interface NoDataProps extends Partial<Omit<EmptyStateProps, "title">> {
  title?: React.ReactNode;
}

/**
 * NoData — {@link EmptyState} preset for "no records" situations.
 */
export function NoData({ icon, title = "Không có dữ liệu", ...props }: NoDataProps) {
  return <EmptyState icon={icon ?? <Inbox />} title={title} {...props} />;
}
