import { deco } from '../assets';
import { site } from '../config/site';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wave" style={{ backgroundImage: `url(${deco.wave})` }} />
      <div className="footer__body">
        <ul className="footer__list">
          <li><span>{site.legalName}</span></li>
          <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><a href={`tel:${site.phone.replace(/\s/g, '')}`}>{site.phone}</a></li>
          <li><span>{site.address[0]}<br />{site.address[1]}</span></li>
        </ul>
      </div>
    </footer>
  );
}
