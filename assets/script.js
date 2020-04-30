var instances;
document.addEventListener('DOMContentLoaded', function() {
 var elems = document.querySelectorAll('select');
 const options = [
 { name : 'Album',  value : 'album'},
 { name : 'Artist',  value : 'artist'},
 { name : 'Track',  value : 'track'},
 ]
  instances = M.FormSelect.init(elems, options);
});
    

