module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/api': './src/api',
            '@/store': './src/store',
            '@/features': './src/features',
            '@/components': './src/components',
            '@/utils': './src/utils',
          },
        },
      ],
    ],
  };
};
