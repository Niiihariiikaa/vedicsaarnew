import { useLayoutEffect, useRef, useCallback } from 'react';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div
    className={`scroll-stack-card relative w-full box-border origin-top ${itemClassName}`.trim()}
    style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
  >
    {children}
  </div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 80,
  itemScale = 0.04,
  itemStackDistance = 24,
  stackPosition = '15%',
  scaleEndPosition = '8%',
  baseScale = 0.88,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}) => {
  const containerRef   = useRef(null);
  const spacerRef      = useRef(null);
  const endRef         = useRef(null);
  const cardsRef       = useRef([]);
  const offsetCache    = useRef([]);
  const rafRef         = useRef(null);
  const lastScrollRef  = useRef(-1);
  const completedRef   = useRef(false);

  const parsePercent = useCallback((val) => {
    if (typeof val === 'string' && val.includes('%')) {
      return (parseFloat(val) / 100) * window.innerHeight;
    }
    return parseFloat(val);
  }, []);

  const recacheOffsets = useCallback(() => {
    offsetCache.current = cardsRef.current.map(
      c => c ? c.getBoundingClientRect().top + window.scrollY : 0
    );
  }, []);

  const update = useCallback(() => {
    const scrollY    = window.scrollY;
    if (Math.abs(scrollY - lastScrollRef.current) < 0.4) return;
    lastScrollRef.current = scrollY;

    const vh        = window.innerHeight;
    const stackPx   = parsePercent(stackPosition);
    const scaleEndPx = parsePercent(scaleEndPosition);
    const endTop    = endRef.current
      ? endRef.current.getBoundingClientRect().top + scrollY
      : 0;
    const pinEnd = endTop - vh / 2;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cardTop  = offsetCache.current[i] ?? 0;
      const pinStart = cardTop - stackPx - itemStackDistance * i;
      const scaleEnd = cardTop - scaleEndPx;

      const scaleT = Math.min(1, Math.max(0, (scrollY - pinStart) / Math.max(scaleEnd - pinStart, 1)));
      const target = baseScale + i * itemScale;
      const scale  = 1 - scaleT * (1 - target);
      const rot    = rotationAmount ? i * rotationAmount * scaleT : 0;

      let blur = 0;
      if (blurAmount) {
        let topIdx = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          if (scrollY >= (offsetCache.current[j] ?? 0) - stackPx - itemStackDistance * j) topIdx = j;
        }
        if (i < topIdx) blur = Math.max(0, (topIdx - i) * blurAmount);
      }

      let ty = 0;
      if (scrollY >= pinStart && scrollY <= pinEnd) {
        ty = scrollY - cardTop + stackPx + itemStackDistance * i;
      } else if (scrollY > pinEnd) {
        ty = pinEnd - cardTop + stackPx + itemStackDistance * i;
      }

      card.style.transform = `translate3d(0,${ty.toFixed(2)}px,0) scale(${scale.toFixed(4)}) rotate(${rot.toFixed(2)}deg)`;
      card.style.filter    = blur > 0 ? `blur(${blur.toFixed(1)}px)` : '';

      if (i === cardsRef.current.length - 1) {
        const inView = scrollY >= pinStart && scrollY <= pinEnd;
        if (inView && !completedRef.current)  { completedRef.current = true;  onStackComplete?.(); }
        else if (!inView) completedRef.current = false;
      }
    });
  }, [parsePercent, stackPosition, scaleEndPosition, itemStackDistance, baseScale, itemScale, rotationAmount, blurAmount, onStackComplete]);

  const onScroll = useCallback(() => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => { rafRef.current = null; update(); });
  }, [update]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    cardsRef.current = Array.from(container.querySelectorAll(':scope > .scroll-stack-card'));

    cardsRef.current.forEach((card, i) => {
      card.style.willChange      = 'transform, filter';
      card.style.transformOrigin = 'top center';
      if (i < cardsRef.current.length - 1) card.style.marginBottom = `${itemDistance}px`;
    });

    // Minimal spacer: just enough for pinEnd (endTop - vh/2) to sit below the last pinStart
    const setSpacerHeight = () => {
      if (spacerRef.current) {
        spacerRef.current.style.height = `${Math.max(window.innerHeight * 0.35, 200)}px`;
      }
    };
    setSpacerHeight();

    recacheOffsets();

    const onResize = () => {
      recacheOffsets();
      setSpacerHeight();
      lastScrollRef.current = -1;
      update();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      cardsRef.current.forEach(c => { if (c) { c.style.transform = ''; c.style.filter = ''; } });
    };
  }, [itemDistance, onScroll, update, recacheOffsets]);

  return (
    <div className={`relative w-full ${className}`.trim()}>
      <div ref={containerRef} className="relative w-full">
        {children}
      </div>
      <div ref={spacerRef} />
      <div ref={endRef} style={{ height: 1 }} />
    </div>
  );
};

export default ScrollStack;
