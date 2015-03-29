var pageNumber = 1;
var pageSize = 5;

function loadMore() {
    $.mobile.loading( "show", {
	text: "Loading...",
	textVisible: true,
	theme: "z",
	html: ""
    });

    $("#btnAdd").button('disable');
    if (navigator && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showData);
    } else {
        document.getElementById("appTitle").innerHTML = "Geolocation is not supported by this browser.";
	$.mobile.loading( "hide" );
    }
}

$( document ).on( "mobileinit", function() {
    $.mobile.loader.prototype.options.text = "loading";
    $.mobile.loader.prototype.options.textVisible = false;
    $.mobile.loader.prototype.options.theme = "a";
    $.mobile.loader.prototype.options.html = "";
});

function showData( position ) {
    var URL = "https://api.car.ma/v1/object/trip/nearbyUsers?pageSize=" + pageSize + "&pageNum=" + pageNumber + "&currentLon=" + position.coords.longitude + "&currentLat=" + position.coords.latitude;
    pageNumber += 1;
    var request = $.ajax({
	dataType: "json",
	url: URL,
	success: function( data ) { 
	    if( data["nearbyUsers"].length <= 0 && pageNumber <= 2 ) {
		//no data at first page
		document.getElementById("appTitle").innerHTML = "No local Carma Users found";
	    }
	    
	    var totalPages = data["paginator"]["totalPages"];
	    if( pageNumber <= totalPages ) {
		$("#btnAdd").button('enable');
	    }

	    $.each( data["nearbyUsers"], function( key, val ) {
		var liStr = "<li> <img src='" + val["photoURL"] + "'> <h2> " + val["firstName"] + "</h2> <p> Last seen  " + ( new Date(val["lastSeen"]) ).toLocaleDateString() + " " + ( new Date(val["lastSeen"]) ).toLocaleTimeString()  + "</p> </li>";
		//console.log( liStr );
		$("#mylist").append(liStr);
		$("#mylist").listview('refresh');
	    });  
	},
	timeout: 5000
    }).fail( function( xhr, status ) {
	if( status == "timeout" ) {
            // do stuff in case of timeout
	    document.getElementById("appTitle").innerHTML = "Network is too slow to load users info.";
	}
    });

    $.mobile.loading( "hide" );
}



$( document ).ready(function() {
    //console.log( "ready!" );
    loadMore()
});
