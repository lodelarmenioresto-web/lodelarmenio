import { deco, icons } from '../assets';
import { useReveal } from '../hooks/useReveal';
import type { Location } from '../types';
import Icon from './Icon';
import './LocationCard.css';

interface Props { location: Location; index: number }

export default function LocationCard({ location, index }: Props) {
  const { ref, shown } = useReveal<HTMLElement>();
  const query = encodeURIComponent(
    location.mapQuery ?? `${location.street}, ${location.area}, Argentina`,
  );
  const embedUrl = `https://www.google.com/maps?q=${query}&z=16&output=embed`;
  const mapsUrl = location.mapsUrl ?? `https://www.google.com/maps/search/?api=1&query=${query}`;
  const waText = encodeURIComponent(location.whatsappMessage ?? '¡Hola! Quería hacer una consulta.');
  const waUrl = `https://wa.me/${location.whatsapp}?text=${waText}`;

  return (
    <article
      ref={ref}
      className={`loc ${shown ? 'is-in' : ''}`}
      style={{ transitionDelay: `${Math.min(index, 3) * 90}ms` }}
    >
      <div className="loc__grid">
      <div className="loc__info">
        <p className="loc__label">
          <span className="loc__pin"><Icon src={icons.pin} /></span>
          {location.label}
        </p>
        <h2 className="loc__address">
          {location.street}
          <br />
          {location.area}
        </h2>
        <span className="loc__rule" aria-hidden="true" />
      </div>

      <a className="loc__wa" href={waUrl} target="_blank" rel="noopener noreferrer">
        <Icon src={icons.whatsapp} className="loc__wa-icon" />
        <span>Hacé tu pedido</span>
        <Icon src={icons.arrow} className="loc__wa-arrow" />
      </a>

      <a
        className="loc__map"
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Abrir ${location.street}, ${location.area} en Google Maps`}
        style={{ backgroundImage: `url(${deco.mapPattern})` }}
      >
        <iframe
          src={embedUrl}
          title={`Mapa de ${location.street}`}
          loading="lazy"
          tabIndex={-1}
          referrerPolicy="no-referrer-when-downgrade"
        />
      </a>
      </div>
    </article>
  );
}
