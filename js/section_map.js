var map = L.map('map');

mapLink = 
    '<a href="http://basemaps.cartocdn.com/">BaseMaps</a>';
L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    minZoom: 12,
    maxZoom: 12
    }).addTo(map);

map.setView([45.51475,-73.67225], 12);
