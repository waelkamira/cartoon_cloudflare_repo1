const path = require('path');

module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude the fs module from the client-side bundle
      config.externals = config.externals || {};
      config.externals.fs = 'fs';

      // Optionally, exclude @mapbox/node-pre-gyp if it's not needed on the client
      config.module.rules.push({
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules\/@mapbox\/node-pre-gyp/,
      });
    } else {
      // Server-side specific configuration
      config.externals = [...(config.externals || []), '@mapbox/node-pre-gyp'];
    }

    return config;
  },
};
