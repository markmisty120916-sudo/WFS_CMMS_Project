export interface TelematicsEventDto {
  tenant_id: string;
  event_id?: string;
}

export interface GpsLocationDto {
  tenant_id: string;
  latitude?: string;
  longitude?: string;
}
