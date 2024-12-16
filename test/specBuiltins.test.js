import { kpcatch, kpeval, kpobject, kpparse } from "kenpali";
import { textModule } from "../src/textModule.js";
import { runSpecFile } from "./specRunner.js";

const specPath = "../kenpali-text/text-builtins.md";

runSpecFile(
  specPath,
  (input) =>
    kpcatch(() =>
      kpeval(kpparse(input), {
        modules: kpobject(["text", textModule]),
      })
    ),
  (t, actualOutputValue, expectedOutput) => {
    const expectedOutputValue = kpeval(kpparse(expectedOutput));
    t.deepEqual(actualOutputValue, expectedOutputValue);
  },
  (t) => t.fail("Error testing not implemented")
);
