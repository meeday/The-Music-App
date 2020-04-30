
//API key 1cdcc6e0cda44cee6b6571363c390279
//http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=<<artist name>>&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json

var userInput;
// userInput = $("#search-query").val(); 


$("#search-icon").on("click", function(){
    var userInput = $("#search-query").val();
    console.log("user input is " + userInput);
    callAPI(userInput);
})



function callAPI(){
    if($('.track-btn').is(':checked')) {
        getTrackInfo(userInput);
    } else if ($('.album-btn').is(':checked')) {
        getAlbumInfo(userInput);
    } else if ($('.artist-btn').is(':checked')) {
        getArtistInfo(userInput)
    }
};




function getTrackInfo(userInput){
    userInput = $("#search-query").val();
    let trackURL = "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" + userInput + 
    "&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json"
    $.ajax({
        url: trackURL,
        method: 'GET', 
    }).then(function(response){
        console.log("user searched for track: " + userInput);
        console.log(response);
    })
};



function getAlbumInfo(userInput){
    userInput = $("#search-query").val();
    let albumURL = "http://ws.audioscrobbler.com/2.0/?method=album.search&album=" + userInput + 
    "&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json"
    $.ajax({
        url: albumURL,
        method: 'GET',
    }).then(function(response) {
        console.log("user searched for album: " + userInput);
        console.log(response);
    })
}; 



function getArtistInfo(userInput){
    userInput = $("#search-query").val();
    let artistURL = "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" + userInput + 
    "&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json";
    $.ajax({
        url: artistURL,
        method: 'GET',
    }).then(function (response) {
        console.log("user searched for artist: " + userInput);
        console.log(response);
})
};












