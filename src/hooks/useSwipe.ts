"use client";

import { useRef } from "react";
import type { MouseEvent, TouchEvent } from "react";

type SwipeOptions = {
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
};

type Point = {
  x: number;
  y: number;
};

type SwipeEvent = TouchEvent<HTMLElement> | MouseEvent<HTMLElement>;

const isTouchEvent = (event: SwipeEvent): event is TouchEvent<HTMLElement> =>
  "targetTouches" in event;

const getEventPoint = (event: SwipeEvent): Point => {
  if (isTouchEvent(event)) {
    const touch = event.targetTouches[0] ?? event.changedTouches[0];

    return {
      x: touch?.clientX ?? 0,
      y: touch?.clientY ?? 0,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
  };
};

export const useSwipe = ({
  onSwipeUp,
  onSwipeDown,
  onSwipeLeft,
  onSwipeRight,
  threshold = 50,
}: SwipeOptions) => {
  const touchStart = useRef<Point | null>(null);
  const touchEnd = useRef<Point | null>(null);

  const minSwipeDistance = threshold;

  const onTouchStart = (event: SwipeEvent) => {
    touchEnd.current = null;
    touchStart.current = getEventPoint(event);
  };

  const onTouchMove = (event: SwipeEvent) => {
    touchEnd.current = getEventPoint(event);
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
