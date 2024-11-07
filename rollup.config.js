import typescript from 'rollup-plugin-typescript2';
import json from '@rollup/plugin-json';
import terser from '@rollup/plugin-terser';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist/cjs',
            format: 'cjs',
            sourcemap: true,
            compact: true,
        },
    ],
    external: ['fs', 'path'],
    plugins: [
        json(),
        nodeResolve(),
        commonjs(),
        typescript(),
        terser()
    ],
};
