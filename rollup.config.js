import babel from 'rollup-plugin-babel';
import cjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'src/js/index.js',
  dest: 'dist/bundle.js',
  plugins: [
    babel({
      runtimeHelpers: true,
      include: 'node_modules/**',
      plugins: [
        'transform-runtime',
        'react-transform'
      ],
      presets: [
        'es2015-rollup',
        'react',
        'evturn'
      ]
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      skip: [],
      browser: true,
      extensions: [ '.js', '.json' ],
      preferBuiltins: true
    }),
    cjs({
      include: 'node_modules/**/*.js'
    })
  ],
  format: 'umd'
};