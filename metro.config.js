// Learn more https://docs.expo.io/guides/customizing-metro
// const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);

// module.exports = config;
const { getDefaultConfig } = require('@expo/metro-config');


module.exports = (async () => {
    const {
      resolver: { sourceExts, assetExts }
    } = await getDefaultConfig(__dirname);
    return {
      transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer')
      },
      resolver: {
        assetExts: assetExts.filter((ext) => ext !== 'svg'),
        sourceExts: [...sourceExts, 'svg']
      }
    };
})();
// defaultConfig.resolver.sourceExts.push('cjs');

// module.exports = defaultConfig;
