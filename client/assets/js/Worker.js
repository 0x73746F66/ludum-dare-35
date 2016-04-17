(function(){
  "use strict";
  importScripts(
      '/assets/js/xhr.js'
  );
  var fetch = new XhrHelper();

  self.onmessage = function(e) {
    var data     = e.data;
    if (data.start) {
      this.postMessage('WORKER STARTED');
    } else if (data.stop) {
      this.postMessage('WORKER STOPPED');
      this.close();
    }
  }
})();