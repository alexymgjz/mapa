let base_url = 'http://'+ window.location.hostname +'/'
//console.log(base_url);
// alert(window.location.href);
let regExpres = /[^,]*/



let map = L.map('mapid').on('load', onMapLoad).setView([41.400, 2.206], 9);
map.locate({setView: true, maxZoom: 17});
	
var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map);

//en el clusters almaceno todos los markers
let layerGroup;
let layers = [];//??
let data_markers = [];
let all=[];
function onMapLoad() {

	console.log("Mapa cargado");
	$.ajax({
		type: "post",
		url: base_url + 'mapa/api/apiRestaurants.php',
		data: "data",
		dataType: "json",
		success: function (response) {
		
		let arrForSelect =[];
		
		response.forEach(element => {
			data_markers.push(element);			
			all.push(element.KIND_FOOD);
			console.log(element.KIND_FOOD.match(regExpres));
			arrForSelect.push(element.KIND_FOOD.match(regExpres)[0]);
		});

		console.log(arrForSelect);
        
		$('#kind_food_selector').html($('#kind_food_selector').html()+` <option value="all">Todos</option>`);
		        
	    let arregloUnico =[];
		for (let index = 0; index < arrForSelect.length; index++) {
			
			let valorUnico = arrForSelect[index];
			render_to_map(data_markers, 'all');
			let esDuplicado = false;
			for(var i = 0; i < arregloUnico.length; i++) {                 
				if (arregloUnico[i]== valorUnico) {					 
					esDuplicado = true;					
				}
			} 
			if (!esDuplicado) {
				arregloUnico.push(valorUnico);
				$('#kind_food_selector').html($('#kind_food_selector').html()+` <option value="${valorUnico}">${valorUnico}</option>`);
		        
			}
		}
		
		}
	    
	});
	   		

    
  /*
	FASE 3.1
		1) Relleno el data_markers con una petición a la api
		2) Añado de forma dinámica en el select los posibles tipos de restaurantes
		3) Llamo a la función para --> render_to_map(data_markers, 'all'); <-- para mostrar restaurantes en el mapa
	*/

   
}
  




$('#kind_food_selector').on('change', function() {

  console.log(this.value);
  render_to_map(data_markers, this.value);
});



function render_to_map(data_markers,filter){
	console.log(filter);
	if(layerGroup){
		layerGroup.clearLayers();
		layers = [];
	}
	
	//ok
	data_markers.forEach(element => {
		
		if (element.KIND_FOOD.includes(filter) || filter === 'all') {
			let layer = new L.marker([element.lat, element.lon])
			.bindPopup(`${element.name}.<br> ${element.address} <br> <img src="${element.photos}" alt="photos" style="width: 100px;"> <br> ${element.KIND_FOOD}`)
			.openPopup();
			layers.push(layer);
		}	 
	});
	layerGroup = L.layerGroup(layers)
	
	map.addLayer(layerGroup);
	

	/*
	FASE 3.2
		1) Limpio todos los marcadores
		2) Realizo un bucle para decidir que marcadores cumplen el filtro, y los agregamos al mapa
	*/	
			
}

