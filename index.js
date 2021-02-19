require([
    "esri/Map",
    "esri/geometry/Extent",
    "esri/views/MapView",
    "esri/layers/GraphicsLayer",
    "esri/layers/MapImageLayer","esri/layers/FeatureLayer","esri/layers/GroupLayer"
  
  ], function (
    Map,Extent,MapView,GraphicsLayer,MapImageLayer,FeatureLayer,GroupLayer) 
    {
    var bbox = new Extent({
      xmin: 45.934,
      ymin: 24.358,
      xmax: 47.119,
      ymax: 25.162
  });
  window.map = new Map({
      basemap: "hybrid",
      showLabels: true
  });
  window.view = new MapView({
    container: "viewDiv",
    highlightOptions: {
        color: [255, 241, 58],
        fillOpacity: 0.4
    },
    map: map,
    zoom: 55, // Sets zoom level based on level of detail (LOD)
    // center: [49.616, 25.323], // Sets center point of view using longitude,latitude
    extent: bbox,
    padding: {
        top: 50,
        bottom: 0
    },
    ui: {
        components: ["zoom", "compass", "attribution"]
    }
  });
  // add layers
  window.layer = new MapImageLayer({
    url: "https://gis.tbc.sa/arcgis/rest/services/TBCMapSDE/MapServer",
    sublayers: [
      {
        id: 3,
        visible: true
      }
    ]
   
  });
  window.flayer = new FeatureLayer({
    url: "https://gis.tbc.sa/arcgis/rest/services/TBCMapSDE/FeatureServer/3",
    outFields:'*'
   
  });
  map.add(layer);  // adds the layer to the map
  //map.add(flayer); 
    // adds the layer to the map
    window.censusGroupLayer = new GroupLayer({
    title: "Historic Census",
    visible: true,
    layers: [flayer]
  });
  map.add(censusGroupLayer);
  ///
  view.whenLayerView(flayer)
    .then(function(layerView) {
      // The layerview for the layer
      console.log(layerView)
    })
    .catch(function(error) {
      // An error occurred during the layerview creation
    });

    view.on("click", async (event) => {
  
          console.log(event.mapPoint);
          console.log("here is the X and Y");
      $("#xValue").find("input").val(event.mapPoint.latitude);
      $("#yValue").find("input").val(event.mapPoint.longitude);
      //$("#parcel_id").find("input").val(event.mapPoint.longitude);
       var screenPoint = {
     x: event.x,
     y: event.y
   };
  
  view.hitTest(screenPoint).then(function (response) {
    if (response.results.length) {
     var graphic = response.results.filter(function (result) {
      // check if the graphic belongs to the layer of interest
      return result.graphic.layer === flayer;
     })[0].graphic;
     // do something with the result graphic
     console.log(graphic.attributes);
     $("#parcel_id").find("input").val(graphic.attributes.PARCEL_ID);
    }
   });
  
  });
  



  });
  