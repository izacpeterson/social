module.exports = {
  proxy: "http://localhost:8080", // Your Node.js app
  files: ["public/**/*.*"], // Watch files in the 'public' directory
  port: 3001, // Port for Browser Sync
  open: true, // Prevent Browser Sync from automatically opening a browser window
};
