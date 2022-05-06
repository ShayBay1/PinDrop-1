var markerBucket = {};

$(document).ready(function() {
  let cardList = $('.card-content');
  cardList = [...cardList];
  cardList.forEach((card) => {
    let cardId = card.id
    card.addEventListener('click', () => {
      console.log(markerBucket[cardId]);
      markerBucket[cardId][1].open({
        anchor: markerBucket[cardId][0],
        map,
        shouldFocus: true,
      });
    })
  })
});

function formatMarkers(marks) {
  let markDict = marks.split('}{')
  markDict[0] = markDict[0].replace('{','');
  markDict[markDict.length - 1] = markDict[markDict.length - 1].replace('}','');
  let list_marks = []
  for (let mark of markDict) {
    let markObj = mark.split(', \'')
    let obj_part = {}
    for (let item of markObj) {
      let key = item.split(': ')[0].replace('\'', '')
      key = key.replace('\'','')
      let value = item.split(': ')[1].replace('\'', '')
      value = value.replace('\'','')
      value = value.replace('datetime.date(','')
      value = value.replace('datetime.time(','')
      value = value.replace('\)','')
      obj_part[key] = value
    }
    obj_part['event_date'] = obj_part['event_date'].replace(', ', '-')
    obj_part['event_date'] = obj_part['event_date'].replace(', ', '-')
    obj_part['event_time'] = obj_part['event_time'].replace(', ', ':')
    // format date and time....
    let dateObj = new Date(obj_part['event_date']).toString()
    let timeObj = new Date("1970-01-01 " + obj_part['event_time']).toString()
    console.log(timeObj)
    obj_part['event_time'] = timeObj.split(' ')[4]
    obj_part['event_date'] = dateObj.split('00:00:00')[0]

    list_marks.push(obj_part)
  }
  return list_marks
}

function formatInfoWindowContent(markerIngredients) {

}

function getColor(eventType) {
  // Meet Up
  // Party
  // Music
  // Community
  // Professional
  // Social
  // Sport
  // Lifestyle
  // Religious'
  switch(eventType) {
    case 'Meet Up':
      return 'http://maps.google.com/mapfiles/ms/micons/green-dot.png';
    case 'Party':
      return 'http://maps.google.com/mapfiles/ms/micons/red-pushpin.png';
    case 'Music':
      return 'http://maps.google.com/mapfiles/ms/micons/blue-pushpin.png';
    case 'Community':
      return 'http://maps.google.com/mapfiles/kml/pal2/icon2.png';
    case 'Professional':
      return 'http://maps.google.com/mapfiles/kml/pal2/icon6.png';
    case 'Social':
      return 'http://maps.google.com/mapfiles/kml/pal2/icon27.png';
    case 'Sport':
      return 'http://maps.google.com/mapfiles/kml/pal2/icon49.png';
    case 'Lifestyle':
      return 'http://maps.google.com/mapfiles/ms/micons/swimming.png';
    case 'Religious':
      return 'http://maps.google.com/mapfiles/kml/pal2/icon11.png';
    
  }
}

function initMap(marks) {

    const veniceBeach = { lat: 34.003052, lng: -118.483971 };
    // The map, center it on Venice Beach for now, later this will be user's home
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 12,
      mapId: 'b447797a89d61e12',
      center: veniceBeach,
    });
    // make markers
    let markerList
    if(marks) {
      markerList = formatMarkers(marks)
      markerList.forEach(function (markerIngredients) {
        // let markColor = getColor(markerIngredients.event_type);
        const marker = new google.maps.Marker({
          position: {lat: parseFloat(markerIngredients.lat), lng: parseFloat(markerIngredients.lng)},
          map: map,
          icon: getColor(markerIngredients.event_type),
        });
        
        

        // reference for markerIngredients vv
        // id: '15
        // user: '2'
        // name: 'Joe Testdata'
        // location: 'A Description'
        // event_time: 'datetime.datetime(2020, 5, 3, 0, 0....
        // time create: 'datetime.datetime(2020, 5, 3, 0, 0....
        // lat: "-17.077762075345877"
        // lng: "128.7755974946022"
  
        //test infowindow....
        const infoWindow = new google.maps.InfoWindow({
          content : `
          <h3> ${ markerIngredients.name }  </h3>
          <p>Event Type: ${ markerIngredients.event_type }</p>
          <p>location: ${ markerIngredients.location }</p>
          <p>event date: ${ markerIngredients.event_date }</p>
          <p>event time: ${ markerIngredients.event_time }</p>
          <p>details: ${ markerIngredients.details }</p>
          <a href="/events/${markerIngredients.id}/update">Edit</a>`
        })
        
        markerBucket[markerIngredients.id] = [marker, infoWindow];
        
  
        marker.addListener('click', (event) => {
          //add onclick behavior to marker 
          if (event.domEvent.which === 1) {
            // open infowindow test....
            infoWindow.open({
              anchor: marker,
              map,
              shouldFocus: false,
            });
          }
        })
        let touchStart;
        marker.addListener('touchstart', function(event) {
          touchStart = setTimeout(function() {
            if( mapEl.classList.contains('logged-in')) {
              window.location.href = `/events/${markerIngredients.id}/delete/`
            }
          }, 500);
        })

        marker.addListener('touchend', function(event) {
          clearTimeout(touchStart);
        });

        marker.addListener('mouseup', (event) => {
          if( mapEl.classList.contains('logged-in')) {
            if (event.domEvent.which === 3) {
              // Delete endpoint: 'events/<int:pk>/delete/'
              window.location.href = `/events/${markerIngredients.id}/delete/`
            }
          }
        });
      });
    }

    const mapEl = document.getElementById("map");
    if( mapEl.classList.contains('logged-in')) {
      map.addListener("click", (event) => {
        const marker = new google.maps.Marker({
          position: event.latLng, 
          map: map
        });
        // get createview.....
        let locData = {lat: event.latLng.lat(), lng: event.latLng.lng()}
        window.location.href = `/events/create/?lat=${locData.lat}&lng=${locData.lng}`
  
      })
    }

  }

  
  function getMarkers() {
    $.ajax({
      url: "/events/json",
      type: "GET",
      success: function(data) {
        let x = JSON.stringify(data);
        x = JSON.parse(x);
        initMap(x)
      },
      error: function(error) {
        console.log( `Error ${error}`);
      }
    });
  }

  
  

  window.initMap = getMarkers;
  