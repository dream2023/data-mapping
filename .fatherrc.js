import nodePolyfills from 'rollup-plugin-node-polyfills';

export default {
  cjs: 'rollup',
  esm: {
    type: 'rollup',
    importLibToEs: true
  },
  umd: {
    name: 'dataMapping'
  },
  extraRollupPlugins: [nodePolyfills()],
};
