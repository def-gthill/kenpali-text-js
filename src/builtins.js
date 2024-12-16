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
    "startsWith",
    {
      params: [
        { name: "string", type: "string" },
        { name: "prefix", type: "string" },
      ],
    },
    function ([string, prefix]) {
      return string.startsWith(prefix);
    }
  ),
  builtin(
    "removePrefix",
    {
      params: [
        { name: "string", type: "string" },
        { name: "prefix", type: "string" },
      ],
    },
    function ([string, prefix]) {
      if (string.startsWith(prefix)) {
        return string.slice(prefix.length);
      } else {
        return string;
      }
    }
  ),
  builtin(
    "endsWith",
    {
      params: [
        { name: "string", type: "string" },
        { name: "suffix", type: "string" },
      ],
    },
    function ([string, suffix]) {
      return string.endsWith(suffix);
    }
  ),
  builtin(
    "removeSuffix",
    {
      params: [
        { name: "string", type: "string" },
        { name: "suffix", type: "string" },
      ],
    },
    function ([string, suffix]) {
      if (string.endsWith(suffix)) {
        return string.slice(0, string.length - suffix.length);
      } else {
        return string;
      }
    }
  ),
  builtin(
    "regex",
    { params: [{ name: "pattern", type: "string" }] },
    function ([pattern]) {
      return kpobject(
        [
          "findAll",
          builtin(
            "findAll",
            { params: [{ name: "string", type: "string" }] },
            function ([string]) {
              const regex = new RegExp(pattern, "g");
              const result = [];
              let match;
              while ((match = regex.exec(string)) !== null) {
                result.push(toKpMatch(match));
              }
              return result;
            }
          ),
        ],
        [
          "match",
          builtin(
            "match",
            { params: [{ name: "string", type: "string" }] },
            function ([string]) {
              const regex = new RegExp(pattern, "g");
              const match = regex.exec(string);
              if (match === null) {
                return null;
              }
              if (match.index !== 0 || regex.lastIndex !== string.length) {
                return null;
              }
              return toKpMatch(match);
            }
          ),
        ]
      );
    }
  ),
];

function toKpMatch(match) {
  return kpobject(
    ["match", match[0]],
    ["index", match.index + 1],
    ["numberedGroups", match.slice(1).map((group) => group ?? null)],
    [
      "namedGroups",
      match.groups ? kpobject(...Object.entries(match.groups)) : kpobject(),
    ]
  );
}

export function builtin(name, paramSpec, f) {
  f.builtinName = name;
  for (const property in paramSpec) {
    f[property] = paramSpec[property];
  }
  return f;
}

export const builtins = kpobject(...rawBuiltins.map((f) => [f.builtinName, f]));
