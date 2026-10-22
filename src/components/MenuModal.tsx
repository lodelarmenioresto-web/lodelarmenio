import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { icons, menuPdf } from '../assets';
import Icon from './Icon';
import './MenuModal.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

/* ---- Ajustes de zoom ---- */
const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const BUTTON_STEP = 1.35;
/** Ancho (px) al que se dibuja cada página. Más alto = más nítido al ampliar, pero más memoria. */
const RENDER_WIDTH = 2200;
/** false: zoom con Ctrl/⌘ + rueda (y pellizco del trackpad); la rueda sola scrollea.
 *  true: la rueda sola hace zoom (para moverte arrastrás con el mouse). */
const WHEEL_ZOOMS_WITHOUT_CTRL = false;

const clamp = (v: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, v));

interface Props { onClose: () => void }

export default function MenuModal({ onClose }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scaleRef = useRef(1);
  const pending = useRef<{ fx: number; fy: number; px: number; py: number } | null>(null);
  const drag = useRef<{ x: number; y: number; sl: number; st: number } | null>(null);
  const lastTouchToggle = useRef(0);

  const [pages, setPages] = useState(0);
  const [baseWidth, setBaseWidth] = useState(320);
  const [scale, setScale] = useState(1);
  const [panning, setPanning] = useState(false);
  const [failed, setFailed] = useState(false);
  const [closing, setClosing] = useState(false);

  const requestClose = () => {
    setClosing(true);
    window.setTimeout(onClose, 180);
  };

  /** Cambia el zoom manteniendo fijo el punto (fx, fy) de la pantalla. */
  const zoomAt = useCallback((next: number, fx: number, fy: number) => {
    const inner = zoomRef.current;
    if (!inner) return;
    const target = clamp(next);
    if (Math.abs(target - scaleRef.current) < 0.001) return;
    const r = inner.getBoundingClientRect();
    pending.current = { fx, fy, px: (fx - r.left) / r.width, py: (fy - r.top) / r.height };
    scaleRef.current = target;
    setScale(target);
  }, []);

  const bodyCenter = useCallback(() => {
    const r = bodyRef.current!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }, []);

  const toggleZoom = useCallback((x: number, y: number) => {
    zoomAt(scaleRef.current > 1.05 ? 1 : DOUBLE_TAP_SCALE, x, y);
  }, [zoomAt]);

  const step = (factor: number) => {
    const c = bodyCenter();
    zoomAt(scaleRef.current * factor, c.x, c.y);
  };

  // Después de cambiar el tamaño, corrige el scroll para que el zoom quede centrado en el gesto.
  useLayoutEffect(() => {
    const p = pending.current;
    const body = bodyRef.current;
    const inner = zoomRef.current;
    if (!p || !body || !inner) return;
    pending.current = null;
    const r = inner.getBoundingClientRect();
    body.scrollLeft += r.left + p.px * r.width - p.fx;
    body.scrollTop += r.top + p.py * r.height - p.fy;
  }, [scale]);

  // Teclado + bloqueo de scroll del fondo
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') requestClose();
      else if (e.key === '+' || e.key === '=') step(BUTTON_STEP);
      else if (e.key === '-') step(1 / BUTTON_STEP);
      else if (e.key === '0') step(1 / scaleRef.current);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ancho base de las páginas
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const measure = () => setBaseWidth(Math.max(200, Math.min(Math.floor(el.clientWidth) - 24, 900)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Rueda del mouse / pellizco de trackpad / pellizco y doble toque en el celular
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (!WHEEL_ZOOMS_WITHOUT_CTRL && !e.ctrlKey && !e.metaKey) return; // scroll normal
      e.preventDefault();
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const k = Math.exp(-dy * (e.ctrlKey ? 0.012 : 0.0018));
      zoomAt(scaleRef.current * k, e.clientX, e.clientY);
    };

    let pinch: { d: number; s: number } | null = null;
    let tap: { x: number; y: number; moved: boolean } | null = null;
    let last: { t: number; x: number; y: number } | null = null;
    const dist = (a: Touch, b: Touch) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);

    const onStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinch = { d: dist(e.touches[0], e.touches[1]), s: scaleRef.current };
        tap = null;
      } else if (e.touches.length === 1) {
        tap = { x: e.touches[0].clientX, y: e.touches[0].clientY, moved: false };
      }
    };
    const onMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && pinch) {
        if (e.cancelable) e.preventDefault();
        const [a, b] = [e.touches[0], e.touches[1]];
        zoomAt(pinch.s * (dist(a, b) / pinch.d), (a.clientX + b.clientX) / 2, (a.clientY + b.clientY) / 2);
      } else if (tap && e.touches.length === 1) {
        const t = e.touches[0];
        if (Math.hypot(t.clientX - tap.x, t.clientY - tap.y) > 10) tap.moved = true;
      }
    };
    const onEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) pinch = null;
      if (tap && !tap.moved && e.touches.length === 0 && e.changedTouches.length === 1) {
        const t = e.changedTouches[0];
        const now = Date.now();
        if (last && now - last.t < 300 && Math.hypot(t.clientX - last.x, t.clientY - last.y) < 30) {
          toggleZoom(t.clientX, t.clientY);
          lastTouchToggle.current = now;
          last = null;
        } else {
          last = { t: now, x: t.clientX, y: t.clientY };
        }
      }
      if (e.touches.length === 0) tap = null;
    };
    const blockGesture = (e: Event) => e.preventDefault(); // evita el zoom de página en Safari iOS

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    el.addEventListener('touchcancel', onEnd, { passive: true });
    el.addEventListener('gesturestart', blockGesture);
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
      el.removeEventListener('touchcancel', onEnd);
      el.removeEventListener('gesturestart', blockGesture);
    };
  }, [zoomAt, toggleZoom]);

  // Mouse: arrastrar para moverse cuando hay zoom
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || scaleRef.current <= 1) return;
    const el = bodyRef.current!;
    drag.current = { x: e.clientX, y: e.clientY, sl: el.scrollLeft, st: el.scrollTop };
    el.setPointerCapture(e.pointerId);
    setPanning(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const el = bodyRef.current!;
    el.scrollLeft = d.sl - (e.clientX - d.x);
    el.scrollTop = d.st - (e.clientY - d.y);
  };
  const endDrag = () => { drag.current = null; setPanning(false); };

  const onDoubleClick = (e: React.MouseEvent) => {
    if (Date.now() - lastTouchToggle.current < 500) return; // ya lo resolvió el doble toque
    toggleZoom(e.clientX, e.clientY);
  };

  const renderRatio = Math.min(6, RENDER_WIDTH / baseWidth);
  const percent = Math.round(scale * 100);

  return (
    <div
      className={`modal ${closing ? 'is-closing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Carta del restaurante"
      onMouseDown={(e) => { if (e.target === e.currentTarget) requestClose(); }}
    >
      <div className="modal__panel">
        <div className="modal__bar">
          <h2>Nuestra carta</h2>
          <div className="modal__tools" role="group" aria-label="Zoom">
            <button type="button" className="modal__zbtn" onClick={() => step(1 / BUTTON_STEP)} disabled={scale <= MIN_SCALE} aria-label="Alejar">−</button>
            <span className="modal__zval" aria-live="polite">{percent}%</span>
            <button type="button" className="modal__zbtn" onClick={() => step(BUTTON_STEP)} disabled={scale >= MAX_SCALE} aria-label="Acercar">+</button>
          </div>
          <a className="modal__dl" href={menuPdf} download="Carta-Lo-del-Armenio.pdf" aria-label="Descargar carta">
            <Icon src={icons.download} /> <span>Descargar</span>
          </a>
          <button ref={closeRef} type="button" className="modal__close" onClick={requestClose} aria-label="Cerrar carta">
            <Icon src={icons.close} />
          </button>
        </div>

        <div
          ref={bodyRef}
          className={`modal__body ${scale > 1 ? 'is-zoomed' : ''} ${panning ? 'is-panning' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onDoubleClick={onDoubleClick}
        >
          {failed ? (
            <p className="modal__msg">
              No pudimos mostrar la carta acá.{' '}
              <a href={menuPdf} target="_blank" rel="noopener noreferrer">Abrila en una pestaña nueva</a>.
            </p>
          ) : (
            <div ref={zoomRef} className="modal__zoom" style={{ width: baseWidth * scale }}>
              <Document
                file={menuPdf}
                loading={<p className="modal__msg">Cargando carta…</p>}
                error={<p className="modal__msg">No se pudo cargar la carta.</p>}
                onLoadSuccess={({ numPages }) => setPages(numPages)}
                onLoadError={() => setFailed(true)}
              >
                {Array.from({ length: pages }, (_, i) => (
                  <Page
                    key={i}
                    pageNumber={i + 1}
                    width={baseWidth}
                    devicePixelRatio={renderRatio}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="modal__page"
                  />
                ))}
              </Document>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}