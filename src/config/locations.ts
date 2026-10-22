import type { Location } from '../types';

/**
 * SEDES. Cada objeto de esta lista genera una card con su dirección,
 * su botón de WhatsApp y su mini mapa. Para sumar una sede, copiá un bloque.
 */
export const locations: Location[] = [
  {
    id: 'gral-paz',
    label: 'Nuestra sede principal',
    street: 'Libertad 1544',
    area: 'Barrio Gral Paz',
    whatsapp: '5493513595304',
    whatsappMessage: '¡Hola! Quería hacer un pedido.',
    mapQuery: 'Libertad 1544, General Paz, Córdoba, Argentina',
  },
  // Ejemplo de una segunda sede (descomentá y editá):
  // {
  //   id: 'nueva-cordoba',
  //   label: 'Sede Nueva Córdoba',
  //   street: 'Calle 123',
  //   area: 'Nueva Córdoba, Córdoba',
  //   whatsapp: '5493510000000',
  //   mapQuery: 'Calle 123, Nueva Córdoba, Córdoba, Argentina',
  // },
];
