//note-> in js file our environment variable is not accesseble in our js file so we have run a script tag in show.ejs file to access the 
//enviornment variable in map.js file
        mapboxgl.accessToken = mapToken;
        // console.log(mapboxgl)

          const map = new mapboxgl.Map({
              container: 'map', // container ID
              style: 'mapbox://styles/mapbox/streets-v12',
              center: [77.22445000,28.63576000  ], // starting position [lng, lat]. Note that lat must be set between -90 and 90
              zoom: 9 // starting zoom
          });
     console.log(listing.geometry.coordinates)

     const marker = new mapboxgl.Marker({color:"red"})
     .setLngLat(listing.geometry.coordinates)
    //  console.log(listing.geometry.coordinates)
     .setPopup(
      new mapboxgl.Popup({offset: 25})
      .setHTML(`<h4>${listing.title} </h4><p>Exact location will be provided after booking</p>`)

     )
     .addTo(map);
     map.panTo(listing.geometry.coordinates);//map.panTo(coordinates):
     // This method smoothly pans the map to the specified coordinates
     // (in this case, the location where your marker is placed). It re-centers the map so that the provided coordinates 
     //become the new center of the visible area.

     