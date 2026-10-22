import { deco, icons, images } from '../assets';
import Icon from './Icon';
import './Hero.css';

interface Props { onOpenMenu: () => void }

export default function Hero({ onOpenMenu }: Props) {
  return (
    <header className="hero">
      <div className="hero__inner">
        <h1 className="logo">
          <img src={images.logo} alt="Lo del Armenio – Gastronomía armenia" />
        </h1>

        <div className="hero__mascot">
          <img src={images.mascot} alt="Mascota de Lo del Armenio: un wrap sonriente" />
        </div>

        <button type="button" className="cta" onClick={onOpenMenu}>
          <Icon src={icons.book} className="cta__book" />
          <span className="cta__sep" aria-hidden="true" />
          <span className="cta__text">Ver la carta</span>
        </button>
      </div>
    </header>
  );
}
