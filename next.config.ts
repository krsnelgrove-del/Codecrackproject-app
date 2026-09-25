const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true, // Set to true if you want a permanent 308 redirect
      },
    ]
  },
};

module.exports = nextConfig;