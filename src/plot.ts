import {newRectangleProjectionTransformation, Point, Rectangle, Transformation} from './geometry';
import {
    drawConnectedPoints,
    drawLine,
    drawCenterAdjustedText,
    drawLeftAdjustedText,
    Color,
    pointToPixelBoundary,
} from './graphics';
import {getDefaultYTicks, Tick} from './ticks';

interface PlotContext {
    sourceRectangle: Rectangle;
    canvasRectangle: Rectangle;

    // Transforms a point in the data space (i.e. sourceRectangle) to a point in the canvas.
    transform: Transformation;
}

const PLOT_MARGIN = 50;
const TEXT_MARGIN = 5;

const getMinY = (points: Point[]): number => Math.min(...points.map(p => p.y));
const getMaxY = (points: Point[]): number => Math.max(...points.map(p => p.y));
const getMinX = (points: Point[]): number => Math.min(...points.map(p => p.x));
const getMaxX = (points: Point[]): number => Math.max(...points.map(p => p.x));

const newPlotContext = (canvas: HTMLCanvasElement, points: Point[]): PlotContext => {
    const rangeMinY = getMinY(points);
    const rangeMaxY = getMaxY(points);

    const rangeMinX = getMinX(points);
    const rangeMaxX = getMaxX(points);

    const canvasRectangle: Rectangle = {
        top: PLOT_MARGIN,
        left: PLOT_MARGIN,
        bottom: canvas.height - PLOT_MARGIN,
        right: canvas.width - PLOT_MARGIN,
    };
    const sourceRectangle: Rectangle = {bottom: rangeMinY, left: rangeMinX, top: rangeMaxY, right: rangeMaxX};
    const transformation = newRectangleProjectionTransformation(sourceRectangle, canvasRectangle);

    return {
        sourceRectangle,
        canvasRectangle,
        transform: transformation,
    };
};

const drawDataPoints = (
    context: CanvasRenderingContext2D,
    plotContext: PlotContext,
    ps: Point[],
    color: Color
): void => {
    const dstPoints = ps.map(p => pointToPixelBoundary(plotContext.transform(p)));
    drawConnectedPoints(context, dstPoints, {strokeStyle: color});
};

const drawYLabels = (context: CanvasRenderingContext2D, plotContext: PlotContext, labels: Tick[]): void => {
    labels.forEach(label => {
        if (
            label.position < plotContext.sourceRectangle.bottom ||
            plotContext.sourceRectangle.top < label.position
        ) {
            return;
        }
        const aPoint = pointToPixelBoundary(
            plotContext.transform({
                x: plotContext.sourceRectangle.left,
                y: label.position,
            })
        );
        const bPoint = pointToPixelBoundary(
            plotContext.transform({
                x: plotContext.sourceRectangle.right,
                y: label.position,
            })
        );
        drawLine(context, aPoint, bPoint, {width: 1, strokeStyle: 'gray'});
        const textPoint = {x: aPoint.x - TEXT_MARGIN, y: aPoint.y};
        drawLeftAdjustedText(context, label.label, textPoint);
    });
};

const drawXLabels = (context: CanvasRenderingContext2D, plotContext: PlotContext, labels: Tick[]): void => {
    labels.forEach(label => {
        if (
            label.position < plotContext.sourceRectangle.left ||
            plotContext.sourceRectangle.right < label.position
        ) {
            return;
        }
        const aPoint = pointToPixelBoundary(
            plotContext.transform({
                x: label.position,
                y: plotContext.sourceRectangle.bottom,
            })
        );
        const bPoint = pointToPixelBoundary(
            plotContext.transform({
                x: label.position,
                y: plotContext.sourceRectangle.top,
            })
        );
        drawLine(context, aPoint, bPoint, {width: 1, strokeStyle: 'gray'});
        const textPoint = {x: aPoint.x, y: aPoint.y + TEXT_MARGIN};
        drawCenterAdjustedText(context, label.label, textPoint);
    });
};

export const plot = (
    canvas: HTMLCanvasElement,
    points: Point[],
    xTicks: Tick[] = [],
    yTicks: Tick[] | 'auto' = 'auto',
    lineColor: Color = Color.Green
): void => {
    const context = canvas.getContext('2d');
    if (!context) {
        throw Error("Couldn't get the context to draw in the canvas");
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    const plotContext = newPlotContext(canvas, points);

    const actualYTicks =
        yTicks === 'auto'
            ? getDefaultYTicks(plotContext.sourceRectangle.bottom, plotContext.sourceRectangle.top, 5)
            : yTicks;

    drawXLabels(context, plotContext, xTicks);
    drawYLabels(context, plotContext, actualYTicks);

    drawDataPoints(context, plotContext, points, lineColor);
};
