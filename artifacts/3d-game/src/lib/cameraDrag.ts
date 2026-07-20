/**
 * Tiny shared flag so click-to-move (GroundPlane) can tell the difference
 * between a genuine click and the end of a camera orbit/pan drag.
 *
 * IsometricCamera sets `moved = true` once the pointer travels past the drag
 * threshold; GroundPlane checks it on pointerdown and ignores the click if the
 * gesture turned out to be a drag.
 */
export const cameraDrag = {
  /** True when the current pointer gesture has moved far enough to be a drag. */
  moved: false,
};
