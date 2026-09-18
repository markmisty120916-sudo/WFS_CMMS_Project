"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import { inputStyle } from "../parts-manager-dashboard.styles";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"rounded-md border px-3 py-2 text-sm " + (props.className || "")} style={inputStyle} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={"rounded-md border px-3 py-2 text-sm " + (props.className || "")} style={inputStyle} />;
}
