import { useRef, useState, type DragEvent, type MouseEvent, type PointerEvent } from 'react';

// Pixels the pointer has to move before a press counts as a drag, so a slightly shaky click still
// opens the card
const DRAG_THRESHOLD = 5;

interface DragState {
  startX: number;
  startScrollLeft: number;
  hasMoved: boolean;
}

/**
 * Lets mouse users scroll a horizontal list by dragging it, as touch users do with a finger.
 * Touch and pen already scroll natively, so only the mouse is handled.
 */
export function useDragToScroll<T extends HTMLElement>() {
  const dragRef = useRef<DragState | null>(null);
  const wasDraggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const onPointerDown = (event: PointerEvent<T>) => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;

    wasDraggedRef.current = false;
    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: event.currentTarget.scrollLeft,
      hasMoved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<T>) => {
    const drag = dragRef.current;
    if (!drag) return;

    const distance = event.clientX - drag.startX;

    if (!drag.hasMoved) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return;

      drag.hasMoved = true;
      setIsDragging(true);
      // Keeps receiving the moves even if the pointer leaves the list
      event.currentTarget.setPointerCapture?.(event.pointerId);
    }

    event.currentTarget.scrollLeft = drag.startScrollLeft - distance;
  };

  const onPointerUp = () => {
    wasDraggedRef.current = dragRef.current?.hasMoved ?? false;
    dragRef.current = null;
    setIsDragging(false);
  };

  const onPointerCancel = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  // Releasing a drag fires a click on the card under the pointer: cancel it so it doesn't navigate
  const onClickCapture = (event: MouseEvent<T>) => {
    if (!wasDraggedRef.current) return;

    wasDraggedRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  // Stops the browser from dragging the card's link or image instead of scrolling the list
  const onDragStart = (event: DragEvent<T>) => event.preventDefault();

  return {
    isDragging,
    dragHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onClickCapture,
      onDragStart,
    },
  };
}
