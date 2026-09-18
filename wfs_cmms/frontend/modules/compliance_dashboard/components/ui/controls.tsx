"use client";

import type { InputHTMLAttributes } from "react";
import { inputStyle } from "../compliance-dashboard.styles";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"rounded-md border px-3 py-2 text-sm " + (props.className || "")} style={inputStyle} />;
}
