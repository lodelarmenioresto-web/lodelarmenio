import { images } from '../assets';
import { socials } from '../config/site';
import { useReveal } from '../hooks/useReveal';
import Icon from './Icon';
import './Social.css';

export default function Social() {
  const { ref, shown } = useReveal<HTMLElement>(0.3);
  return (
    <section ref={ref} className={`social ${shown ? 'is-in' : ''}`}>
      <h2 className="social__title">
        <img src={images.seguinos} alt="Seguinos. Para ver novedades, platos y más" />
      </h2>
      <ul className="social__list">
        {socials.map((s) => (
          <li key={s.id}>
            <a className="social__btn" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
              <Icon src={s.icon} />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
