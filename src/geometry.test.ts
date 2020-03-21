import {newRectangleProjectionTransformation, Point, Rectangle} from './geometry';

describe('rectangle projection transformation', () => {
    const anyRectA: Rectangle = {bottom: 0, left: 0, top: 50, right: 100};
    const anyRectB: Rectangle = {bottom: 50, left: 50, top: 70, right: 110};

    test('projects center to center', () => {
        const centerA: Point = {x: 50, y: 25};
        const transform = newRectangleProjectionTransformation(anyRectA, anyRectB);
        expect(transform(centerA)).toEqual({x: 80, y: 60});
    });

    test('projects corner to corner', () => {
        const transform = newRectangleProjectionTransformation(anyRectA, anyRectB);
        expect([
            transform({x: 0, y: 0}),
            transform({x: 0, y: 50}),
            transform({x: 100, y: 0}),
            transform({x: 100, y: 50}),
        ]).toEqual([
            {x: 50, y: 50},
            {x: 50, y: 70},
            {x: 110, y: 50},
            {x: 110, y: 70},
        ]);
    });
});
