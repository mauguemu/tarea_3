// Mapa Leaflet
	var mapa = L.map('mapid').setView([9.995816, -83.030099], 15);
	
	// Capa base
	var osm = L.tileLayer(
	  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
	  {
	    maxZoom: 25,
	    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	  }
	).addTo(mapa);
	// Otra capa base
        var esri = L.tileLayer(
	  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 
	  {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
	  }
	).addTo(mapa);	
	// Conjunto de capas base
	var mapasBase = {
	    "OSM": osm,
		"ESRI": esri,		
	    
		
	};	    
		
	// Control de capas
        control_capas = L.control.layers(mapasBase).addTo(mapa);
		
		
	// Control de escala
        L.control.scale({position:'topright', imperial:false}).addTo(mapa);
	
	// Capa vectorial en formato GeoJSON
	$.getJSON("https://mauguemu.github.io/Datos_tarea_2/centro_historico/perimetro_centro_historico.geojson", function(geodata) {
	var centro_historico = L.geoJson(geodata, {
    style: function(feature) {
	  return {'color': "black", 'weight': 2.5, 'fillOpacity': 0.0}
    }
	,
    onEachFeature: function(feature, layer) {
      var popupText = "<strong>Centro Histórico Ciudad de Limón</strong>: " ;
      layer.bindPopup(popupText);
    }			
	}).addTo(mapa);

	control_capas.addOverlay(centro_historico, 'Centro Histórico');
 
	});
	
	// Capa vectorial en formato GeoJSON
	// $.getJSON("https://mauguemu.github.io/Datos_tarea_2/caminos_centro_hist/red_caminos_centro_histo.geojson", function(geodata) {
	// var calles = L.geoJson(geodata, {
    // style: function(feature) {
	  // return {'color': "#fac866", 'weight': 3.5, 'fillOpacity': 0.0}
    // }
	// ,
    // onEachFeature: function(feature, layer) {
      // var popupText = "<strong>Carretera</strong>: " + "<br>"+ feature.properties.TIPO + "<br>" + feature.properties.URBANOS;
      // layer.bindPopup(popupText);
    // }			
	// }).addTo(mapa);

	// control_capas.addOverlay(calles, 'Calles');
 
	// });
	
	// Capa vectorial en formato GeoJSON
	// $.getJSON("https://mauguemu.github.io/Datos_tarea_2/infra_cultural/infra_cultural_centro.geojson", function(geodata) {
	// var infra_cult = L.geoJson(geodata, {
    // style: function(feature) {
	  // return {'color': "#fac866", 'weight': 2.5, 'fillOpacity': 0.0}
    // }
	// ,
    // onEachFeature: function(feature, layer) {
      // var popupText = "<strong>Infraestructura cultural</strong>: " + "<br>" + feature.properties.title;
      // layer.bindPopup(popupText);
    // }			
	// }).addTo(mapa);

	// control_capas.addOverlay(infra_cult, 'Infraestructura cultural');
 
	// });
	
	// Agregar capa WMS
		var capa_via_ferrea = L.tileLayer.wms('https://geos.snitcr.go.cr/be/IGN_200/wms?', {
		  layers: 'viaferrea_200k',
		  format: 'image/png',
		  transparent: true
		}).addTo(mapa);

	// Se agrega al control de capas como de tipo "overlay"
		control_capas.addOverlay(capa_via_ferrea, 'Via ferrocarril');
	
	// Capa de coropletas 
$.getJSON('https://mauguemu.github.io/Datos_tarea_2/zonas_delimitadas/zonas_delimitadas_centro_hist.geojson', function (geojson) {
  var capa_zonas_delimitadas = L.choropleth(geojson, {
	  valueProperty: 'recursos',
	  scale: ['yellow', 'red'],
	  steps: 3,
	  mode: 'q',
	  style: {
	    color: '#fff',
	    weight: 2,
	    fillOpacity: 0.5
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup('Zona estudio: ' + feature.properties.nombre + '<br>' + 'Cantidad de recursos: ' + feature.properties.recursos)
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_zonas_delimitadas, 'Cantidad de recursos por zona' );	
  
  

  // Leyenda de la capa de coropletas
  var leyenda = L.control({ position: 'bottomright' })
  leyenda.onAdd = function (mapa) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = capa_zonas_delimitadas.options.limits
    var colors = capa_zonas_delimitadas.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  leyenda.addTo(mapa)
});

	// Capa de coropletas 
$.getJSON('https://mauguemu.github.io/Datos_tarea_2/cuadrantes/cuadrantes_centro_historico.geojson', function (geojson) {
  var capa_cuadrantes = L.choropleth(geojson, {
	  valueProperty: 'zona',
	  scale: ['gray', 'black'],
	  steps: 3,
	  mode: 'q',
	  style: {
	    color: '#fff',
	    weight: 2,
	    fillOpacity: 0.5
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup('Cuadrante: ' + feature.properties.id_cuadrante + '<br>' + 'Zona de origen: ' + feature.properties.id_zona_zonas_delimitadas)
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_cuadrantes, 'Cuadrantes' );	
  
  
});

// Capa raster hoja cartografica
var Orto_foto2017 = L.imageOverlay("https://mauguemu.github.io/Datos_tarea_2/raster/mapa.tif", 
	[[-83.043179923, -83.014604864], 
	[10.006521201, 9.983327509]], 
	{opacity:0.5}
).addTo(mapa);
control_capas.addOverlay(Orto_foto2017, 'Hoja Cartográfica');

function updateOpacity() {
  document.getElementById("span-opacity").innerHTML = document.getElementById("sld-opacity").value;
  Orto_foto2017.setOpacity(document.getElementById("sld-opacity").value);
}

