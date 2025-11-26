import { useState, useEffect, useRef } from 'react';

export const useSwipe = ({ onSwipeUp, onSwipeDown, onSwipeLeft, onSwipeRight, threshold = 50 }) => {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const minSwipeDistance = threshold;

  const onTouchStart = (e) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches ? e.targetTouches[0].clientX : e.clientX,
      y: e.targetTouches ? e.targetTouches[0].clientY : e.clientY,
    };
  };

  const onTouchMove = (e) => {
    touchEnd.current = {
      x: e.targetTouches ? e.targetTouches[0].clientX : e.clientX,
      y: e.targetTouches ? e.targetTouches[0].clientY : e.clientY,
    };
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontal) {
      if (Math.abs(distanceX) > minSwipeDistance) {
        if (distanceX > 0) {
          onSwipeLeft && onSwipeLeft();
        } else {
          onSwipeRight && onSwipeRight();
        }
      }
    } else {
      if (Math.abs(distanceY) > minSwipeDistance) {
        if (distanceY > 0) {
          onSwipeUp && onSwipeUp();
        } else {
          onSwipeDown && onSwipeDown();
        }
      }
    }
  };

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    // Add mouse support for desktop testing
    onMouseDown: onTouchStart,
    onMouseMove: onTouchMove,
    onMouseUp: onTouchEnd,
  };
};
