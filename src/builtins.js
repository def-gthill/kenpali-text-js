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
  builtin(
    "regex",
    { params: [{ name: "pattern", type: "string" }] },
    function ([pattern]) {
      const regex = new RegExp(pattern, "g");
      return kpobject([
        "findAll",
        builtin(
          "findAll",
          { params: [{ name: "string", type: "string" }] },
          function ([string]) {
            const result = [];
            let match;
            while ((match = regex.exec(string)) !== null) {
              result.push(
                kpobject(
                  ["match", match[0]],
                  ["index", match.index + 1],
                  [
                    "numberedGroups",
                    match.slice(1).map((group) => group ?? null),
                  ],
                  [
                    "namedGroups",
                    match.groups
                      ? kpobject(...Object.entries(match.groups))
                      : kpobject(),
                  ]
                )
              );
            }
            return result;
          }
        ),
      ]);
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
