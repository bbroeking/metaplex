const withPlugins = require('next-compose-plugins');
const withLess = require('next-with-less');

const assetPrefix = process.env.ASSET_PREFIX || '';

const plugins = [
  [
    withLess,
    {
      lessLoaderOptions: {
        lessOptions: {
          modifyVars: {
            '@primary-color': '#768BF9',
            '@text-color': 'rgba(255, 255, 255)',
            '@assetPrefix': assetPrefix || "''",
          },
          javascriptEnabled: true,
        },
      },
    },
  ],
];

module.exports = withPlugins(plugins, {
  assetPrefix,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, {isServer}) => {
    if(!isServer){
      config.resolve.fallback.fs =false;
    }
    return config;
  },
  env: {
    NEXT_PUBLIC_STORE_OWNER_ADDRESS:
      process.env.STORE_OWNER_ADDRESS ||
      process.env.REACT_APP_STORE_OWNER_ADDRESS_ADDRESS,
    NEXT_PUBLIC_STORE_ADDRESS: process.env.STORE_ADDRESS,
    NEXT_PUBLIC_BIG_STORE: process.env.REACT_APP_BIG_STORE,
    NEXT_PUBLIC_CLIENT_ID: process.env.REACT_APP_CLIENT_ID,
    REACT_APP_CANDY_MACHINE_CONFIG: process.env.REACT_APP_CANDY_MACHINE_CONFIG,
    REACT_APP_CANDY_MACHINE_ID: process.env.REACT_APP_CANDY_MACHINE_ID,
    REACT_APP_TREASURY_ADDRESS: process.env.REACT_APP_TREASURY_ADDRESS,
    REACT_APP_CANDY_START_DATE: process.env.REACT_APP_CANDY_START_DATE,
    REACT_APP_SOLANA_NETWORK: "devnet",
    REACT_APP_SOLANA_RPC_HOST:"https://explorer-api.devnet.solana.com"
  },
  async rewrites() {
    return [
      {
        source: '/:any*',
        destination: '/',
      },
    ];
  },
});
