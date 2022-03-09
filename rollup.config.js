import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import ts from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";
import cleaner from "rollup-plugin-cleaner";

// 配置
const rollupConfig = {
  input: "./src/index.ts",
  output: {
    name: "iflytek-spider-api",
    format: "umd",
    dir: "./dist",
  },
  plugins: [
    cleaner({
      targets: ["./dist"],
    }),
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
