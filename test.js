const {isPointInPolygon} = require('bryce-geometry')
polygon = [[119.053741, 33.594937], [119.05548, 33.59505], [119.060804, 33.595393], [119.060805, 33.595393], [119.060953, 33.595376], [119.060958, 33.595362], [119.061286, 33.591181], [119.061325, 33.590684], [119.061329, 33.590632], [119.061162, 33.590584], [119.054635, 33.588698], [119.053959, 33.590031], [119.053759, 33.594515], [119.053741, 33.594937]]
lng = 119.053741;
lat = 33.594937;
console.log(isPointInPolygon(lng,lat,polygon,false))