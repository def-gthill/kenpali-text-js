import { kpcatch, kpcompile, kpeval, kpobject, kpparse, kpvm } from "kenpali";
import { textModule } from "../src/textModule.js";
import { runSpecFile } from "./specRunner.js";
const specPath = "../kenpali-text/text-builtins.md";

runSpecFile(
  specPath,
  (input) =>
    kpcatch(() => {
      const ast = kpparse(input);
      const program = kpcompile(ast, {
        modules: kpobject(["text", textModule]),
      });
      // const program = kpcompile(ast, {
      //   modules: kpobject(["text", textModule]),
      //   trace: true,
      // });
      const result = kpvm(program);
      // const result = kpvm(program, { trace: true });
      return result;
    }),
  (t, actualOutputValue, expectedOutput) => {
    const expectedOutputValue = kpeval(kpparse(expectedOutput));
    t.deepEqual(actualOutputValue, expectedOutputValue);
  },
  (t) => t.fail("Error testing not implemented")
);
