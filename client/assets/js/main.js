var SideScroller = {};
// Check if a new cache is available on page load.
window.addEventListener('load', function(e) {
  window.applicationCache.addEventListener('updateready', function(e) {
    if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
      info("New version available.\nReloading AppCache");
      window.location.reload();
    }
  }, false);
  window.applicationCache.addEventListener('noupdate', function(e){
    warn("Loaded from AppCache\nForget to update .appcache file version?");
  }, false);
}, false);
document.addEventListener("DOMContentLoaded", function(e) {
  SideScroller.game = new Phaser.Game(746, 420, Phaser.AUTO, '');
  SideScroller.game.state.add('Boot', SideScroller.Boot);
  SideScroller.game.state.add('Preload', SideScroller.Preload);
  SideScroller.game.state.add('Game', SideScroller.Game);
  SideScroller.game.state.start('Boot');
}, false);

// if (typeof Worker != 'undefined') {
//     var worker = new Worker('/assets/js/Worker.js');
//     worker.onerror = function(e) {
//         //document.getElementById('log').insertAdjacentHTML('beforeEnd','error encountered'+"\n"); 
//         error('Ops, something bad occurred!', e);
//     };
//     worker.onmessage = function(e) {
//         //document.getElementById('log').insertAdjacentHTML('beforeEnd', JSON.stringify(e.data)+"\n" ); 
//         debug(e.data);
//     };
    
//     worker.postMessage({start:true});
// }