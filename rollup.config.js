import typescript from "rollup-plugin-typescript2";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import pkg from "./package.json";

const input = "src/index.ts";
const plugins = [
    peerDepsExternal(),
    typescript({
        typescript: require("typescript"),
        useTsconfigDeclarationDir: true
    }),
];

export default {
    input,
    plugins,
    output: [
        {
            format: 'cjs',
            file: pkg.main,
        },
        {
            format: 'esm',
            file: pkg.module,
        }
    ],
}

