"use client";

import { useMemo } from "react";
import type { TechnicianQueueFilter, TechnicianSession, TechnicianTask } from "../technician.interface";
import { canViewTechnicianWorkorders } from "../technician.rbac";
import { filterAssignedTasks } from "../utils/technician-filters";
import { mapTask } from "../utils/technician-mapper";
import { useMyWorkorders } from "./useMyWorkorders";

export function useAssignedTasks(filter: TechnicianQueueFilter): {
  readonly session: TechnicianSession | null;
  readonly allowed: boolean;
  readonly items: readonly TechnicianTask[];
  readonly loading: boolean;
  readonly refresh: () => Promise<void>;
} {
  const workorders = useMyWorkorders(filter);
  const items = useMemo(() => {
    if (workorders.session === null) {
      return [];
    }
    const tasks: TechnicianTask[] = [];
    let index = 0;
    while (index < workorders.items.length) {
      tasks.push(mapTask(workorders.items[index]));
      index = index + 1;
    }
    return filterAssignedTasks(tasks, workorders.session);
  }, [workorders.items, workorders.session]);

  const allowed = workorders.session !== null && canViewTechnicianWorkorders(workorders.session.role);
  return {
    session: workorders.session,
    allowed,
    items,
    loading: workorders.loading,
    refresh: workorders.refresh,
  };
}
