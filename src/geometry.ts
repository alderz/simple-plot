export interface Point {
    x: number;
    y: number;
}

export interface Rectangle {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

export type Transformation = (point: Point) => Point;

const transformPointWithRectangleProjection = (source: Rectangle, dest: Rectangle, p: Point): Point => {
    const {x, y} = p;
    const {left: a, top: b, right: c, bottom: d} = source;
    const {left: e, top: f, right: g, bottom: h} = dest;
    return {
        x: e + ((x - a) * (g - e)) / (c - a),
        y: f + ((y - b) * (h - f)) / (d - b),
    };
};

// Projects a point from the source rectangle to one in dest, by scaling and translating.
export const newRectangleProjectionTransformation = (source: Rectangle, dest: Rectangle): Transformation => (
    p: Point
): Point => transformPointWithRectangleProjection(source, dest, p);
