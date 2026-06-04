import { useEffect } from 'react';
import { isDesktopChromium, isLikelyDesktopTrackpadPinch } from './inputDetection';

export function useDesktopPinchGuard(mainRef) {
  useEffect(() => {
    const windowObject = mainRef.current?.ownerDocument.defaultView;
    if (!windowObject || !isDesktopChromium(windowObject)) return undefined;

    const preventDesktopTrackpadPinch = (event) => {
      if (isLikelyDesktopTrackpadPinch(event, windowObject) && event.cancelable) {
        event.preventDefault();
      }
    };

    windowObject.addEventListener('wheel', preventDesktopTrackpadPinch, {
      capture: true,
      passive: false
    });

    return () => {
      windowObject.removeEventListener('wheel', preventDesktopTrackpadPinch, { capture: true });
    };
  }, [mainRef]);
}
