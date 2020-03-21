import {calculateTickSize, getDefaultYTicks, getTimeseriesXTicks} from './ticks';

test('calculate tick size', () => {
    expect(calculateTickSize(1000, 5000, 5)).toBe(1000);
    expect(calculateTickSize(1000, 4000, 5)).toBe(500);
    expect(calculateTickSize(18, 20, 5)).toBe(0.5);
    expect(calculateTickSize(19, 20, 5)).toBe(0.2);
    expect(calculateTickSize(19.1, 20.1, 5)).toBe(0.2);
    expect(calculateTickSize(19.037, 19.06, 5)).toBe(0.005);
    expect(calculateTickSize(2000.0, 2001.0, 5)).toBe(0.2);
});

test('get Y labels', () => {
    expect(getDefaultYTicks(2000, 2001, 5)).toEqual([
        {
            label: '2000.0',
            position: 2000,
        },
        {
            label: '2000.2',
            position: 2000.2,
        },
        {
            label: '2000.4',
            position: 2000.4,
        },
        {
            label: '2000.6',
            position: 2000.6000000000001,
        },
        {
            label: '2000.8',
            position: 2000.8000000000002,
        },
        {
            label: '2001.0',
            position: 2001.0000000000002,
        },
    ]);
});

test('default time formatter of getTimeseriesXTicks outputs half-hours right', () => {
    process.env.TZ ='Europe/Madrid';
    expect(getTimeseriesXTicks(1584752477000, 1584752477000 + 1000 * 60 * 30)).toEqual([
        {
            label: "02:00",
            position: 1584752400000,
        },
        {
            label: "02:30",
            position: 1584754200000,
        },
        {
            label: "03:00",
            position: 1584756000000,
        },
    ]);
});

