const config = {
    backendUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://varta-server.vercel.app'
        : 'http://localhost:5000',
  };
  
  export default config;
  