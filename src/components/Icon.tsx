import type { CSSProperties } from 'react';
import './Icon.css';

interface Props { src: string; className?: string }

/** Ícono teñible con `color` (usa el SVG como máscara). */
export default function Icon({ src, className = '' }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`icon ${className}`}
      style={{ '--icon': `url("${src}")` } as CSSProperties}
    />
  );
}
