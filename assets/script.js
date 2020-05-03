//---------------------------------------------------------
//------------LAST FM API CALLS SECTION--------------------
//---------------------------------------------------------

var userInput;

function callAPI() {
  if ($("#track-btn").is(":checked")) {
    getTrackInfo(userInput);
  } else if ($("#artist-btn").is(":checked")) {
    getArtistInfo(userInput);
    $(".artist-results-page").show(400);
  } else if ($("#album-btn").is(":checked")) {
    getAlbumInfo();
  }
}

function getTrackInfo(userInput) {
  userInput = $("#search-query").val();
  var trackURL =
    "http://ws.audioscrobbler.com/2.0/?method=track.search&track=" +
    userInput +
    "&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json";
  $.ajax({
    url: trackURL,
    method: "GET",
  }).then(function (response) {
    console.log("user searched for track: " + userInput);
    console.log(response);
    //Track search result shown
    var firstTrackName = response.results.trackmatches.track[0].name;
    var tracks = response.results.trackmatches.track;
    $("#track-name").text(firstTrackName);
    //if function to ensure max show track is 10
    if (tracks.length > 10){
      var length = 10;
    } else {
      length = tracks.length;
    }
    //reset search result list
    $("#track-search-result>ol").html("");
    //build up search result list
    for (i = 0; i < length; i++){
      $("#track-search-result>ol").append("<li>" + tracks[i].name + " --- By "+ tracks[i].artist + "</li>");
    }
  });
  //show the result page after finish call
  $(".track-results-page").show(400);
}

function getAlbumInfo() {
  var artist = $("#query-artist").val();
  var album = $("#query-album").val();
  var albumURL =
    "http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=1cdcc6e0cda44cee6b6571363c390279&artist=" +
    artist +
    "&album=" +
    album +
    "&format=json";
  $.ajax({
    url: albumURL,
    method: "GET",
  }).then(function (response) {
    console.log("user searched for " + album + " by " + artist);
    console.log(response);
    //album search result shown
    var icon = response.album.image[2]["#text"];
    var summary = response.album.wiki.summary;
    var albumName = response.album.name;
    $("#album-pic").attr("src", icon);
    $("#summaryHeading").text(albumName);
    $("#summary").html(summary);
    $(".search-tracks>ol").html("");
    var tracks = response.album.tracks.track;
    for (i = 0; i < tracks.length; i++) {
      $(".search-tracks>ol").append("<li>" + tracks[i].name + "</li>");
    }
  });
  $(".album-results-page").show(400);
}

function getArtistInfo(userInput) {
  userInput = $("#search-query").val();
  var artistURL =
    "http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=" +
    userInput +
    "&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json";
  $.ajax({
    url: artistURL,
    method: "GET",
  }).then(function (response) {
    $("#artist-name").text(response.artist.name);
    $("#artist-bio").html(response.artist.bio.summary);
    $("#artist-bio>a").attr("Target", "_blank");
    // Filling top 4 albums
    var topAlbumURL =
      "http://ws.audioscrobbler.com/2.0/?method=artist.gettopalbums&artist=" +
      userInput +
      "&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json";

    $.ajax({
      url: topAlbumURL,
      method: "GET",
    }).then(function (response) {
      $("#header-img").attr(
        "src",
        response.topalbums.album[0].image[2]["#text"]
      );
      $("#header-img").attr("alt", response.topalbums.album[0].name);
      $("#albums>ul").html("");

      for (var i = 0; i < 4; i++) {
        $("#albums>ul").append(
          '<li><img src="' +
          response.topalbums.album[i].image[2]["#text"] +
          'alt="' +
          response.topalbums.album[i].name +
          'class="responsive-img"/>' +
          "</li>"
        );
      }
    });

    // Getting top tracks
    var topTrackURL =
      "http://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=" +
      userInput +
      "&api_key=1cdcc6e0cda44cee6b6571363c390279&format=json";

    $.ajax({
      url: topTrackURL,
      method: "GET",
    }).then(function (response) {
      $("#top-tracks>ol").html("");
      for (i = 0; i < 5; i++) {
        $("#top-tracks>ol").append(
          '<li><a id="tracks" class="waves-effect waves-light collection-item modal-trigger" href="#track-modal">' +
          "<span>" +
          response.toptracks.track[i].name +
          "</span></a></li>"
        );
      }
    });
  });
}

//These apply on page load
$(function () {
  $("#search-icon").on("click", function () {
    var userInput = $("#search-query").val();
    console.log("user input is " + userInput);
    callAPI(userInput);
    $("#default-search-input>label").remove();
    $("#album-input>label").remove();
    $("#artist-input>label").remove();
  });

  //search on <enter key> pressed
  $(document).keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
      callAPI();
      $("#default-search-input>label").remove();
      $("#album-input>label").remove();
      $("#artist-input>label").remove();
    }
  });

  $("#album-search-icon").on("click", function () {
    $("#album-input>label").remove();
    $("#artist-input>label").remove();
    getAlbumInfo();
  });

  $("#album-btn").on("click", function () {
    $("#default-search-input").hide(400);
    $("#album-search-input").show(400);
  });

  $(".default-query").on("click", function () {
    $("#default-search-input").show(400);
    $("#album-search-input").hide(400);
  });
});