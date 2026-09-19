"use client";

import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { inputStyle } from "../driver-portal.styles";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"rounded-md border px-3 py-2 " + (props.className || "")} style={inputStyle} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={"rounded-md border px-3 py-2 " + (props.className || "")} style={inputStyle} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={"rounded-md border px-3 py-2 " + (props.className || "")} style={inputStyle} />;
}
