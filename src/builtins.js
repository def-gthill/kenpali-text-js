import { kpobject } from "kenpali";

const rawBuiltins = [
  builtin(
    "trim",
    { params: [{ name: "string", type: "string" }] },
    function ([string]) {
      return string.trim();
    }
  ),
  builtin(
    "toLowerCase",
    { params: [{ name: "string", type: "string" }] },
    function ([string]) {
      return string.toLowerCase();
    }
  ),
  builtin(
    "toUpperCase",
    { params: [{ name: "string", type: "string" }] },
    function ([string]) {
      return string.toUpperCase();
    }
  ),
];

export function builtin(name, paramSpec, f) {
  f.builtinName = name;
  for (const property in paramSpec) {
    f[property] = paramSpec[property];
  }
  return f;
}

export const builtins = kpobject(...rawBuiltins.map((f) => [f.builtinName, f]));
