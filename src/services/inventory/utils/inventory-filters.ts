import type { Part, PartRequest } from "../inventory.interface";

export function filterPartsByLocation(parts: readonly Part[], location: string): readonly Part[] {
  if (location === "") {
    return parts;
  }
  const filtered: Part[] = [];
  let index = 0;
  while (index < parts.length) {
    if (parts[index].location === location) {
      filtered.push(parts[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterRequestsByPart(
  requests: readonly PartRequest[],
  part_id: string,
): readonly PartRequest[] {
  if (part_id === "") {
    return requests;
  }
  const filtered: PartRequest[] = [];
  let index = 0;
  while (index < requests.length) {
    if (requests[index].part_id === part_id) {
      filtered.push(requests[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterRequestsByWorkorder(
  requests: readonly PartRequest[],
  workorder_id: string,
): readonly PartRequest[] {
  if (workorder_id === "") {
    return requests;
  }
  const filtered: PartRequest[] = [];
  let index = 0;
  while (index < requests.length) {
    if (requests[index].workorder_id === workorder_id) {
      filtered.push(requests[index]);
    }
    index = index + 1;
  }
  return filtered;
}
