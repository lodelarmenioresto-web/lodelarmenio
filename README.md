# Lo del Armenio – Landing (Vite + React + TypeScript)

    npm install
    npm run dev      # desarrollo (también accesible desde el celular en tu red)
    npm run build    # producción en /dist

## Qué tocar para cambiar cosas

| Quiero…                         | Archivo |
|---------------------------------|---------|
| Cambiar la carta (PDF)          | `src/assets/menu/carta.pdf` (reemplazar, mismo nombre) |
| Agregar / editar sedes          | `src/config/locations.ts` (cada objeto = una card con WhatsApp y mapa) |
| Redes, mail, teléfono, footer   | `src/config/site.ts` |
| Cambiar mascota / platos        | `src/assets/images/` (mascot, plate-left, plate-right) |
| Cambiar íconos y decoraciones   | `src/assets/svg/` |
| Usar PNG/JPG/WEBP en vez de SVG | cambiar la extensión del import en `src/assets/index.ts` |
| Colores, tipografías y radios de borde | variables al inicio de `src/styles/global.css` |
| Estilos de un componente        | `src/components/<Componente>.css` (Hero, LocationCard, Locations, Social, Footer, MenuModal, Icon) |

Los íconos (`icon-*.svg`) se pintan con CSS (`color`), así que pueden ser de cualquier color.
Las imágenes de `images/` y `svg/` decorativas se muestran tal cual.

## Mapas
Cada card incrusta un mini mapa de Google Maps (sin API key) buscando `mapQuery`.
Al tocarlo se abre Google Maps en esa ubicación. Si querés un pin exacto, poné `mapsUrl`.
