import typescript from 'rollup-plugin-typescript2';

export default {
    input: 'index.ts',
    plugins: [typescript()],
    output: [
        {
            file: 'dist/simple-plot-iife.js',
            format: 'iife',
            name: 'SimplePlot',
        },
        {
            file: 'dist/simple-plot-cjs.js',
            format: 'cjs',
        },
        {
            file: 'dist/simple-plot-mjs.js',
            format: 'es',
        },
    ],
};
