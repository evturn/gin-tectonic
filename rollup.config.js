import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/js/index.js',
  dest: 'dist/bundle.js',
  plugins: [
    babel({
      runtimeHelpers: true
    })
  ],
  format: 'umd'
};