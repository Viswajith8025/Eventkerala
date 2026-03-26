import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getImageUrl } from '../services/api';

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const RecenterMap = ({ center }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

const EventMap = ({ events, height = '500px' }) => {
  // Center of Kerala (approx)
  const defaultCenter = [10.8505, 76.2711];
  
  // Filter events that have coordinates
  const eventsWithCoords = events.filter(ev => ev.latitude && ev.longitude);

  return (
    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-0" style={{ height }}>
      <MapContainer 
        center={defaultCenter} 
        zoom={7} 
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {eventsWithCoords.map((event) => (
          <Marker 
            key={event._id} 
            position={[event.latitude, event.longitude]}
          >
            <Popup className="custom-popup">
              <div className="p-2 max-w-[200px]">
                <img 
                  src={getImageUrl(event.image)} 
                  alt={event.title} 
                  className="w-full h-24 object-cover rounded-xl mb-2" 
                />
                <h4 className="font-bold text-gray-900 leading-tight mb-1">{event.title}</h4>
                <p className="text-[10px] text-indigo-600 font-bold uppercase mb-2">{event.district}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-500 font-medium">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                  <a 
                    href={`/events/${event._id}`} 
                    className="text-[10px] font-bold text-indigo-600 hover:underline"
                  >
                    Details
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* If we have a selected event or filtered list, we could recenter here */}
        <RecenterMap center={eventsWithCoords.length > 0 ? [eventsWithCoords[0].latitude, eventsWithCoords[0].longitude] : defaultCenter} />
      </MapContainer>
      
      {/* Legend / Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 shadow-xl text-xs font-bold text-gray-700">
        {eventsWithCoords.length} Events Pinpointed
      </div>
    </div>
  );
};

export default EventMap;
