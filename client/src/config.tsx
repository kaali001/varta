const config = {
    backendUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://varta-server.onrender.com'
        : 'http://localhost:5000',
  };
  
  export default config;
  