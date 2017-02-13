function GoogleMap() {
    // Manhattan
    this.lat = 40.7760717;
    this.long = -73.9587617;
    this.map = null;
    this.service = null;
}

GoogleMap.prototype.initialize = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(this.lat, this.long),
        zoom: 15,
        scrollwheel: false
    });

    // Create the PlaceService and send the request.
    // Handle the callback with an anonymous function.
    this.service = new google.maps.places.PlacesService(map);
    this.map = map;
};

// Singleton type of object, to use the map, and service access.
var gmap = new GoogleMap();

// Helper class to self contain the Google Place and Google Marker object.
// Also it contains a show variable
function NPlace(gplace, gmarker) {
    this.place = gplace;
    this.marker = gmarker;
    this._show = true;
}

NPlace.prototype.isVisible = function() {
    return this._show;
};

NPlace.prototype.hide = function() {
    this._show = false;
};

NPlace.prototype.show = function() {
    this._show = true;
};

/*
    Class: WikipediaAPI
    Helper class to query wikipeda
*/

function WikipediaAPI() {
    this.baseUrl = 'http://en.wikipedia.org/w/api.php?callback=?';
    this.params = {
      'action': 'query',
      'format': 'json',
      'prop': 'pageimages',
      'list': 'geosearch',
      'generator': 'geosearch',
      'piprop': 'thumbnail|name',
      'pithumbsize': '144',
      'pilimit': '2',
      'gscoord': '40.77|-73.96',
      'gsradius': '10000',
      'gslimit': '10',
      'ggscoord': '40.77|-73.96'
    };
}

WikipediaAPI.prototype.queryByCoord = function(lat, long) {
    data = this.params;
    data.gscoord = lat + '|' + long;
    data.ggscoord = lat + '|' + long;

    return $.getJSON(this.baseUrl, data);
};

/*
    Knockout Model defintion

    Our model will hold the location name for filtering, and the filtered list of locations.
    Also it contains another variable `places` that will hold the
*/
var LocationViewModel = {
    places: [],
    locName: ko.observable(''),
    filtered: ko.observableArray(),
    visibleMenu: ko.observable(true),

    addPlace: function (nplace) {
        this.places.push(nplace);
        // we replicate here.
        this.filtered.push(nplace);
    },

    searchTerm: function(term) {
        var self = this;
        term = term.toLowerCase();
        _places = self.places;

        var _hide = _places.filter(function (value) {
            return (value.place.name.toLowerCase().indexOf(term) < 0);
        });

        _hide.map(function (value) {
            value.marker.setVisible(false);
            value.hide();
            self.filtered.remove(value);
        });

        _places.map(function (value) {
            // if value was not selected before to be hidden now
            if (_hide.indexOf(value) < 0) {
                if (!value.isVisible()) {
                    value.show();
                    self.filtered.push(value);
                    value.marker.setVisible(true);
                }
            }
        });

        self.sort();
    },

    sort: function () {
        this.filtered = this.filtered.sort(function(left, right) {
            if (left.place.name < right.place.name)
                return -1;
            else if (left.name > right.name)
                return 1;
            else
                return 0;
        });
    },

    showInfo: function(data) {
        google.maps.event.trigger(data.marker, 'click');
    },

    toggleMenu: function() {
        this.visibleMenu(!this.visibleMenu());
        google.maps.event.trigger(gmap.map, 'resize');
    },

    menuHidden: function() {
        return !this.visibleMenu();
    }
};

LocationViewModel.locName.subscribe(function(value) {
    LocationViewModel.searchTerm(value);
});
ko.applyBindings(LocationViewModel);

/*
    Other functions
*/
function bindInfoWindow(marker, map, infowindow, content) {
    marker.addListener('click', function(evt) {
        // Set animation
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
            marker.setIcon(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png');
        }

        // Set content given
        infowindow.setContent(content);

        // Add extra information
        wapi = new WikipediaAPI();
        var pos = marker.getPosition();
        deferred = wapi.queryByCoord(pos.lat(), pos.lng());
        deferred.done(function (iw) {
            return function(data) {
                curcon = iw.getContent();
                curcon += '<br><br><strong>Interesting places around:</strong>';
                if (data) {
                    curcon = curcon + '<br>\n';
                    curcon += '<table>\n';
                    for (var i = 0; i < data.query.geosearch.length; i++) {
                        o = data.query.geosearch[i];
                        page = data.query.pages[o.pageid];
                        curcon += '<tr>\n';
                        curcon += '<td>' + page.title + '</td>';
                        if (page.thumbnail) {
                            imgsrc = page.thumbnail.source;
                            curcon += '<td><img src=\'' + imgsrc + '\'></td>';
                        }
                        curcon += '</tr>\n';
                    }
                    curcon += '</table>\n';
                } else {
                    curcon += '<p>There\'s no data available' +
                        ' for this location</p>';
                }
                curcon += '<p class=\'iw-footnote\'>Source: Wikipedia</p>';
                iw.setContent(curcon);
            };
        }(infowindow));
        deferred.fail(function(err) {
            alert('Error retriving the Wikipedia Data. Details: ' + err);
        });
        infowindow.open(map, this);
    });
}

function createMarkers(map, places, pag, infowindow) {
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = places[i]; i++) {
        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            title: place.name,
            position: place.geometry.location
        });

        var pname = '<strong>' + place.name + '</strong>',
            paddr = '<BR>' + place.vicinity;
        bindInfoWindow(marker, map, infowindow, pname + paddr);

        LocationViewModel.addPlace(new NPlace(place, marker));

        bounds.extend(place.geometry.location);
    }

    if (!pag.hasNextPage)
        map.fitBounds(bounds);
}


function initMaps() {
    gmap.initialize();
    request = {
        location: new google.maps.LatLng(gmap.lat, gmap.long),
        radius: '2000',
        types: ['restaurant']
    };

    var infowindow = new google.maps.InfoWindow();

    gmap.service.nearbySearch(request, function(results, status, pag) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            createMarkers(gmap.map, results, pag, infowindow);
            pag.nextPage();
            LocationViewModel.sort();
        } else {
            alert('Not possible to display the restaurants at this moment' +
                '(Google service is not available or an error ocurred)');
            console.log("error on nearbySearch: " + status);
        }
    });
}

function initMapsError() {
    alert('Error loading Google Maps.');
}
