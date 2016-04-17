var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.env.PORT || 8080,
    ip = process.env.IP || 'localhost';

http.createServer(function(request, response) {

  var uri = url.parse(request.url).pathname
    , filename = path.join(process.cwd(), 'client/' + uri);

  var contentTypesByExtension = {
    '.html':    "text/html",
    '.css':     "text/css",
    '.js':      "application/javascript",
    '.json':    "text/json",
    '.jpeg':    "image/jpeg",
    '.jpg':     "image/jpeg",
    '.png':     "image/png",
    '.ico':     "image/x-icon",
    '.svg':     "image/svg-xml",
    '.appcache':"text/cache-manifest",
    '.webapp':  "application/x-web-app-manifest+json",
    '.xml':     "application/xml",
  };

  fs.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

    if (fs.statSync(filename).isDirectory()) filename += '/index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      var headers = {};
      var contentType = contentTypesByExtension[path.extname(filename)];
      if (contentType) headers["Content-Type"] = contentType;
      headers["Cache-Control"] = 'no-transform';
      response.writeHead(200, headers);
      response.write(file, "binary");
      response.end();
    });
  });

  console.log(request.method, response.statusCode, uri);
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://" + ip + ":" + port + "/\nCTRL + C to shutdown");