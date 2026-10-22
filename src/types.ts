export interface Location {
  id: string;
  /** Etiqueta arriba de la dirección. Ej: "Nuestra sede principal" */
  label: string;
  /** Línea 1 de la dirección */
  street: string;
  /** Línea 2 de la dirección */
  area: string;
  /** WhatsApp en formato internacional, solo números. Ej: 5493513595304 */
  whatsapp: string;
  /** Mensaje que aparece pre-cargado en WhatsApp */
  whatsappMessage?: string;
  /** Texto con el que se busca en Google Maps. Si falta, se usa street + area */
  mapQuery?: string;
  /** Link directo a Google Maps (opcional, pisa a mapQuery para el click) */
  mapsUrl?: string;
}

export interface SocialLink {
  id: string;
  label: string;
  href: string;
  icon: string;
}
