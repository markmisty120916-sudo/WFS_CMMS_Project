import type { PartsRequest } from "../parts-request.interface";

export function filterRequestsByWorkorder(
  requests: readonly PartsRequest[],
  workorder_id: string,
): readonly PartsRequest[] {
  if (workorder_id === "") {
    return requests;
  }
  const filtered: PartsRequest[] = [];
  let index = 0;
  while (index < requests.length) {
    if (requests[index].workorder_id === workorder_id) {
      filtered.push(requests[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterRequestsByPart(
  requests: readonly PartsRequest[],
  part_id: string,
): readonly PartsRequest[] {
  if (part_id === "") {
    return requests;
  }
  const filtered: PartsRequest[] = [];
  let index = 0;
  while (index < requests.length) {
    if (requests[index].part_id === part_id) {
      filtered.push(requests[index]);
    }
    index = index + 1;
  }
  return filtered;
}

export function filterRequestsByStatus(
  requests: readonly PartsRequest[],
  status: string,
): readonly PartsRequest[] {
  if (status === "") {
    return requests;
  }
  const filtered: PartsRequest[] = [];
  let index = 0;
  while (index < requests.length) {
    if (requests[index].status === status) {
      filtered.push(requests[index]);
    }
    index = index + 1;
  }
  return filtered;
}
