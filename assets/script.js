//---------------------------------------------------------
//------------LAST FM API CALLS SECTION--------------------
//---------------------------------------------------------

// modal function
document.addEventListener("DOMContentLoaded", function () {
  var elems = $(".modal");
  var instances = M.Modal.init(elems);
});

var userInput;

function callAPI() {
  if ($("#track-btn").is(":checked")) {
    $("#album-input>label").toggle();
    $("#artist-input>label").toggle();
    getTrackInfo(userInput);
  } else if ($("#artist-btn").is(":checked")) {
    $("#album-input>label").toggle();
    $("#artist-input>label").toggle();
    getArtistInfo(userInput);
    $("#artist-results-page").show(400);
  } else if ($("#album-btn").is(":checked")) {
    $("#album-input>label").toggle();
    $("#artist-input>label").toggle();
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
    if (tracks.length > 10) {
      var length = 10;
    } else {
      length = tracks.length;
    }
    //reset search result list
    $("#track-search-result>ol").html("");
    //build up search result list
    for (i = 0; i < length; i++) {
      $("#track-search-result>ol").append(
        "<li><a id='tracks' class='waves-effect waves-light collection-item modal-trigger' href='#track-modal'>" +
          tracks[i].name +
          " - " +
          tracks[i].artist +
          "</a></li>"
      );
    }
  });
  //show the result page after finish call
  $("#track-results-page").show(400);
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
    var albumName = response.album.name;
    $("#album-pic").attr("src", icon);
    $("#summaryHeading").text(albumName);
    $(".search-tracks>ol").html("");
    if (!response.album.wiki) {
      $("#summary").hide();
    } else {
      $("#summary").html(response.album.wiki.summary);
      $("#summary").show();
    }
    var tracks = response.album.tracks.track;
    for (i = 0; i < tracks.length; i++) {
      $(".search-tracks>ol").append(
        "<li><a id='tracks' class='waves-effect waves-light collection-item modal-trigger' href='#track-modal'>" +
          tracks[i].name +
          "</a></li>"
      );
    }
  });
  $("#album-results-page").show(400);
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
          '<li><a id="albums" class="waves-effect waves-light modal-trigger" href="#album-modal"><img src="' +
            response.topalbums.album[i].image[2]["#text"] +
            'alt="' +
            response.topalbums.album[i].name +
            "/></a>" +
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
    $(".result-page").hide(400);
    callAPI(userInput);
    $("#default-search-input>label").remove();
    $("#album-input>label").toggle();
    $("#artist-input>label").toggle();
  });

  //search on <enter key> pressed
  $(document).keypress(function (event) {
    var keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode == "13") {
      $(".result-page").hide(400);
      callAPI();
      $("#default-search-input>label").remove();
      $("#album-input>label").toggle();
      $("#artist-input>label").toggle();
    }
  });

  $("#album-search-icon").on("click", function () {
    $("#album-input>label").toggle();
    $("#artist-input>label").toggle();
    $(".result-page").hide(400);
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
