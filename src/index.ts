import app from "./server";
import load from "./load";

if(process.argv.length > 2){
  const fileName = process.argv[2];
  if(!/.*\.jar/.test(fileName)){
    throw new Error(`Invalid file name "${fileName}"`);
  }
  load(fileName);
}else{
  const fs = require('fs');
  const https = require('https');

  const server = https.createServer({
    cert: fs.readFileSync(process.env.CERT),
    key: fs.readFileSync(process.env.KEY)
  }, app);

  server.listen(8443, () => {
    console.log("Server listening on port 8443");
  });
}