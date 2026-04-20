module.exports = {
  apps: [
    {
      name: 'unikart-backend',
      script: './backend/server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
        PORT: process.env.PORT || 80
      }
    }
  ]
};
