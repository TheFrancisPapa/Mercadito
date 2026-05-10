import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { useNavigate } from 'react-router-dom'
import { fmtPrecio } from '../../data/constants'

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Default center: Corrientes city
const DEFAULT_CENTER = [-27.4696, -58.8306]

export function MapaLocales({ resultados = [], ciudad = '' }) {
  const navigate = useNavigate()

  // Collect unique stores with coordinates from results
  // For now, we show a placeholder map centered on the city
  // Real pins will show when stores have lat/lng

  return (
    <div className="card overflow-hidden" style={{ height: '300px' }}>
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* We'll add markers when stores have lat/lng */}
        {resultados.map((prod, i) => {
          // If the product has store coordinates, show them
          if (prod.comercio_mejor_lat && prod.comercio_mejor_lng) {
            return (
              <Marker
                key={`${prod.producto_id}-${i}`}
                position={[prod.comercio_mejor_lat, prod.comercio_mejor_lng]}
                icon={greenIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">{prod.comercio_mejor}</p>
                    <p className="text-gray-500 text-xs">{prod.comercio_mejor_dir}</p>
                    <p className="font-bold text-emerald-600 mt-1">{fmtPrecio(prod.precio_min)}</p>
                    <p className="text-xs text-gray-400">{prod.nombre}</p>
                  </div>
                </Popup>
              </Marker>
            )
          }
          return null
        })}
      </MapContainer>
    </div>
  )
}

export function MapaPicker({ position, onPositionChange }) {
  return (
    <div className="card overflow-hidden" style={{ height: '250px' }}>
      <MapContainer
        center={position || DEFAULT_CENTER}
        zoom={14}
        style={{ height: '100%', width: '100%' }}
        onClick={(e) => onPositionChange && onPositionChange([e.latlng.lat, e.latlng.lng])}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && (
          <Marker position={position} icon={greenIcon} />
        )}
      </MapContainer>
    </div>
  )
}
