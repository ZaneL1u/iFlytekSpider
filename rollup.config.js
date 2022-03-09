import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import ts from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

// 配置
const rollupConfig = {
  input: "./src/index.ts",
  output: {
    name: "distinguish",
    format: "umd",
    dir: "./dist",
  },

  plugins: [
    resolve([".js", ".ts"]),
    commonjs(),
    ts({
      tsconfig: "./tsconfig.json",
      extensions: [".js", ".ts"],
    }),
    terser(),
  ],
};
export default rollupConfig;
