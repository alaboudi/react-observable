import typescript from '@rollup/plugin-typescript';

export default {
    input: 'src/index.ts',
    output: [
        {
            dir: 'dist',
            format: 'cjs'
        },
        {
            dir: 'dist',
            format: 'umd'
        },
        {
            dir: 'dist',
            format: 'es'
        }
    ],
    plugins: [typescript()]
};
