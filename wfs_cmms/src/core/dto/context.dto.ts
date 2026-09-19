export interface ContextDto {
  tenant_id: string;
  user_id?: string;
}

export function freezeContextDto(dto: ContextDto): ContextDto {
  return Object.freeze(dto);
}
