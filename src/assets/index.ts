/**
 * Todas las imágenes e íconos se importan desde acá.
 * Para reemplazar uno: pisá el archivo en su carpeta con el mismo nombre
 * (o cambiá la extensión acá, ej. mascot.svg -> mascot.png).
 */
import mascot from './images/mascot.png';
import seguinos from './images/seguinos.png';
import logo from './images/logo.png';

import sparks from './svg/sparks.svg';
import wave from './svg/wave.svg';
import patternBorder from './svg/pattern-border.svg';
import mapPattern from './svg/map-pattern.svg';

import iconBook from './svg/icon-book.svg';
import iconArrow from './svg/icon-arrow.svg';
import iconPin from './svg/icon-pin.svg';
import iconWhatsapp from './svg/icon-whatsapp.svg';
import iconInstagram from './svg/icon-instagram.svg';
import iconTiktok from './svg/icon-tiktok.svg';
import iconBuilding from './svg/icon-building.svg';
import iconMail from './svg/icon-mail.svg';
import iconPhone from './svg/icon-phone.svg';
import iconClose from './svg/icon-close.svg';
import iconDownload from './svg/icon-download.svg';

/** Carta en PDF: reemplazá src/assets/menu/carta.pdf */
import menuPdf from './menu/carta.pdf?url';

export const images = { logo, mascot, seguinos };
export const deco = { sparks, wave, patternBorder, mapPattern };
export const icons = {
  book: iconBook, arrow: iconArrow, pin: iconPin, whatsapp: iconWhatsapp,
  instagram: iconInstagram, tiktok: iconTiktok, building: iconBuilding,
  mail: iconMail, phone: iconPhone, close: iconClose, download: iconDownload,
};
export { menuPdf };
