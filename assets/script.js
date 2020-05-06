//---------------------------------------------------------
//------------LAST FM API CALLS SECTION--------------------
//---------------------------------------------------------

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
    // Handling errors with the api call
    error: function (xhr, _ajaxOptions, _thrownError) {
      if (xhr.status == 400) {
        M.toast({ html: "400: Invalid Input.", classes: "error-message" });
      } else if (xhr.status == 404) {
        M.toast({ html: "404: Not Found.", classes: "error-message" });
      }
    },
  }).then(function (response) {
    if (response.error) {
      var error = response.message;
      M.toast({ html: error, classes: "error-message" });
    } else if (response.results["opensearch:totalResults"] == "0") {
      M.toast({
        html: "The track you supplied could not be found",
        classes: "error-message",
      });
    } else {
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
          "<li><a class='waves-effect waves-light collection-item modal-trigger' href='#track-modal'>" +
            tracks[i].name +
            " - " +
            tracks[i].artist +
            "</a></li>"
        );
      }
      //show the result page after finish call
      $("#track-results-page").show(400);
    }
  });
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
    // Handling errors with the api call
    error: function (xhr, _ajaxOptions, _thrownError) {
      if (xhr.status == 400) {
        M.toast({ html: "400: Invalid Input.", classes: "error-message" });
      } else if (xhr.status == 404) {
        M.toast({ html: "404: Not Found.", classes: "error-message" });
      }
    },
  }).then(function (response) {
    // Checking for error response
    if (response.error) {
      var error = response.message;
      M.toast({ html: error, classes: "error-message" });
      $("#toast-container").css("top", "44%");
    } else {
      var albumName = response.album.name;
      var icon = response.album.image[2]["#text"];
      var tracks = response.album.tracks.track;
      // Checking if an empty album was returned
      if (!icon && !tracks.length) {
        M.toast({
          html: "The album you supplied could not be found",
          classes: "error-message",
        });
        $("#toast-container").css("top", "44%");
      } else {
        //album search result shown
        $("#album-pic").attr("src", icon);
        $("#summaryHeading").text(albumName);
        // create title attribute
        $("#album-pic").attr("title", response.album.artist);
        //function for setting attribute to each link
        $("a.img").each(function () {
          $(this).attr("title", $(this).find("img").attr("title"));
        });
        $(".search-tracks>ol").html("");
        if (!response.album.wiki) {
          $("#summary").hide();
        } else {
          $("#summary").html(response.album.wiki.summary);
          $("#summary").show();
        }
        for (i = 0; i < tracks.length; i++) {
          $(".search-tracks>ol").append(
            "<li><a class='waves-effect waves-light collection-item modal-trigger' href='#track-modal'>" +
              tracks[i].name +
              "</a></li>"
          );
        }
        $("#album-results-page").show(400);
      }
    }
  });
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
    // Handling errors with the api call
    error: function (xhr, _ajaxOptions, _thrownError) {
      if (xhr.status == 400) {
        M.toast({ html: "400: Invalid Input.", classes: "error-message" });
      } else if (xhr.status == 404) {
        M.toast({ html: "404: Not Found.", classes: "error-message" });
      }
    },
  }).then(function (response) {
    // Handling LastFM error response
    if (response.error) {
      var error = response.message;
      M.toast({ html: error, classes: "error-message" });
    } else {
      // Determining if artist exists
      var name = response.artist.name;
      var bio = response.artist.bio;
      var image = response.artist.image[0]["#text"];
      if (!bio.content && !image) {
        M.toast({
          html: "The artist you supplied could not be found",
          classes: "error-message",
        });
      } else {
        $("#artist-name").text(name);
        $("#artist-bio").html(bio.summary);
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
          console.log(response);
          //iterating through albums for a header image
          for (i = 0; i < 50; i++) {
            var albumImage = response.topalbums.album[i].image[2]["#text"];
            var albumName = response.topalbums.album[i].name;
            if (!albumImage || !albumName) {
              continue;
            } else {
              $("#header-img").attr("src", albumImage);
              $("#header-img").attr("alt", albumName);
              $("#albums>ul").html("");
              break;
            }
          }
          for (i = 0, a = 0; i < 50, a < 4; i++) {
            var albumImage = response.topalbums.album[i].image[2]["#text"];
            var albumName = response.topalbums.album[i].name;
            if (!albumImage || !albumName) {
              // Checking if album has both img and alt text
              continue;
            } else {
              // Appending the album
              $("#albums>ul").append(
                '<li><a class="image waves-effect waves-light modal-trigger" href="#album-modal"><img src="' +
                  albumImage +
                  'alt="' +
                  albumName +
                  ' title="' +
                  albumName +
                  '"' +
                  "/></a>" +
                  "</li>"
              );
              //function for setting attribute to each link
              $("a.image").each(function () {
                $(this).attr("title", $(this).find("img").attr("title"));
              });
              // Incrimenting album count
              a++;
            }
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
              '<li><a class="waves-effect waves-light collection-item modal-trigger" href="#track-modal">' +
                "<span>" +
                response.toptracks.track[i].name +
                "</span></a></li>"
            );
          }
        });
        $("#artist-results-page").show(400);
      }
    }
  });
}

//These apply on page load
$(function () {
  $("#search-icon").on("click", function () {
    var userInput = $("#search-query").val();
    $(".result-page").hide(400);
    callAPI(userInput);
    $("#default-search-input>label").remove();
    $("#album-input>label").toggle();
    $("#artist-input>label").toggle();
  });

  // Event listeners

  // Search on <enter key> pressed
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

  // Toggling the label for the search bar on search
  $("#album-search-icon").on("click", function () {
    $("#album-input>label").toggle();
    $("#artist-input>label").toggle();
    $(".result-page").hide(400);
    getAlbumInfo();
  });

  // Changing inputs for album search to incorporate artist input
  $("#album-btn").on("click", function () {
    $("#default-search-input").hide(400);
    $("#album-search-input").show(400);
  });

  $(".default-query").on("click", function () {
    $("#default-search-input").show(400);
    $("#album-search-input").hide(400);
  });
});
// Modal function
document.addEventListener("DOMContentLoaded", function () {
  var elems = $(".modal");
  var instances = M.Modal.init(elems);
});
