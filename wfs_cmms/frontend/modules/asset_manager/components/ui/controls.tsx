"use client";

import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { buttonStyle, inputStyle } from "../asset-manager.styles";

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={"inline-flex items-center rounded-md px-4 py-2 text-sm font-bold " + (props.className || "")} style={buttonStyle} />;
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={"w-full rounded-md border bg-transparent px-3 py-2 text-sm " + (props.className || "")} style={inputStyle} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={"w-full rounded-md border bg-transparent px-3 py-2 text-sm " + (props.className || "")} style={{ ...inputStyle, minHeight: "160px" }} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={"w-full rounded-md border bg-transparent px-3 py-2 text-sm " + (props.className || "")} style={inputStyle} />;
}
