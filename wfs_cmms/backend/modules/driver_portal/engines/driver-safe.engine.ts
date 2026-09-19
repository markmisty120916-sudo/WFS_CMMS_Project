export function driverSafeHealthScore(health_score: string, status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "out of service") {
    return "out of service";
  }
  if (normalized === "oos") {
    return "out of service";
  }
  if (health_score === "") {
    return "ready";
  }
  return "ready";
}

export function driverSafeOperationalStatus(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "out of service") {
    return "Out of Service";
  }
  if (normalized === "oos") {
    return "Out of Service";
  }
  return "In Service";
}

export function driverSafeFaultLevel(severity: string): string {
  if (severity === "S1") {
    return "critical";
  }
  if (severity === "critical") {
    return "critical";
  }
  if (severity === "S2") {
    return "major";
  }
  if (severity === "major") {
    return "major";
  }
  return "minor";
}

export function driverSafeFaultWording(level: string): string {
  if (level === "critical") {
    return "stop and report";
  }
  if (level === "major") {
    return "report before next trip";
  }
  return "note for shop";
}

export function driverSafeWorkorderStatus(status: string): string {
  const normalized = status.toLowerCase();
  if (normalized === "completed") {
    return "Completed";
  }
  if (normalized === "closed") {
    return "Completed";
  }
  if (normalized === "in progress") {
    return "In Progress";
  }
  if (normalized === "in_progress") {
    return "In Progress";
  }
  if (normalized === "started") {
    return "In Progress";
  }
  return "Open";
}

export function driverSafeWorkorderSeverity(severity: string): string {
  if (severity === "S1") {
    return "safety hold";
  }
  if (severity === "S2") {
    return "needs attention";
  }
  if (severity === "") {
    return "logged";
  }
  return "service notice";
}

export function driverSafeScheduledWindow(start: string, end: string): string {
  if (start === "") {
    if (end === "") {
      return "window not posted";
    }
  }
  return "service window posted";
}

export function driverSafeS1Wording(): string {
  return "safety hold — do not operate";
}

export function allowedDefectCategory(category: string): string {
  if (category === "mechanical") {
    return "mechanical";
  }
  if (category === "electrical") {
    return "electrical";
  }
  if (category === "safety") {
    return "safety";
  }
  if (category === "comfort") {
    return "comfort";
  }
  if (category === "operational") {
    return "operational";
  }
  if (category === "noise") {
    return "noise";
  }
  if (category === "smell") {
    return "smell";
  }
  if (category === "vibration") {
    return "vibration";
  }
  if (category === "dashboard") {
    return "dashboard";
  }
  return "operational";
}
