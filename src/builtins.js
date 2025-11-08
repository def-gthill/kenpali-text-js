import {
  kpobject,
  platformClass,
  platformFunction,
  stringClass,
} from "kenpali";

const rawBuiltins = [
  platformFunction(
    "trim",
    { posParams: [{ name: "string", type: stringClass }] },
    function ([string]) {
      return string.trim();
    }
  ),
  platformFunction(
    "toLowerCase",
    { posParams: [{ name: "string", type: stringClass }] },
    function ([string]) {
      return string.toLowerCase();
    }
  ),
  platformFunction(
    "toUpperCase",
    { posParams: [{ name: "string", type: stringClass }] },
    function ([string]) {
      return string.toUpperCase();
    }
  ),
  platformFunction(
    "startsWith",
    {
      posParams: [
        { name: "string", type: stringClass },
        { name: "prefix", type: stringClass },
      ],
    },
    function ([string, prefix]) {
      return string.startsWith(prefix);
    }
  ),
  platformFunction(
    "removePrefix",
    {
      posParams: [
        { name: "string", type: stringClass },
        { name: "prefix", type: stringClass },
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
  platformFunction(
    "endsWith",
    {
      posParams: [
        { name: "string", type: stringClass },
        { name: "suffix", type: stringClass },
      ],
    },
    function ([string, suffix]) {
      return string.endsWith(suffix);
    }
  ),
  platformFunction(
    "removeSuffix",
    {
      posParams: [
        { name: "string", type: stringClass },
        { name: "suffix", type: stringClass },
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
  ...platformClass("Regex", {
    constructors: {
      newRegex: {
        posParams: [{ name: "pattern", type: stringClass }],
        body: ([pattern], { getMethod }) => ({
          internals: { pattern },
          properties: {
            findAll: getMethod("findAll"),
            match: getMethod("match"),
          },
        }),
      },
    },
    methods: {
      findAll: {
        posParams: [{ name: "string", type: stringClass }],
        body: ([self, string]) => {
          const regex = new RegExp(self.pattern, "g");
          const result = [];
          let match;
          while ((match = regex.exec(string)) !== null) {
            result.push(toKpMatch(match));
          }
          return result;
        },
      },
      match: {
        posParams: [{ name: "string", type: stringClass }],
        body: ([self, string]) => {
          const regex = new RegExp(self.pattern, "g");
          const match = regex.exec(string);
          if (match === null) {
            return null;
          }
          if (match.index !== 0 || regex.lastIndex !== string.length) {
            return null;
          }
          return toKpMatch(match);
        },
      },
    },
  }),
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

export const builtins = kpobject(
  ...rawBuiltins.map((builtin) =>
    typeof builtin === "function" ? [builtin.functionName, builtin] : builtin
  )
);
