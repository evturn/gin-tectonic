import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/js/index.js',
  dest: 'dist/bundle.js',
  plugins: [
    babel({
      runtimeHelpers: true,
      include: 'node_modules/rx/**',
      plugins: ['transform-runtime'],
      presets: ['es2015-rollup']
    })
  ],
  format: 'iife'
};