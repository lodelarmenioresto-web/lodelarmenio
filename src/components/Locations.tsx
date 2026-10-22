import { locations } from '../config/locations';
import LocationCard from './LocationCard';
import './Locations.css';

export default function Locations() {
  return (
    <section className="locations" aria-label="Nuestras sedes">
      {locations.map((loc, i) => (
        <LocationCard key={loc.id} location={loc} index={i} />
      ))}
    </section>
  );
}
