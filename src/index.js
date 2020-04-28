import { SVG, Rect, Path  } from '@svgdotjs/svg.js'


function generatePoints({start, end}) {
    const data =  {
        START: 'M',
        x1: start[0],
        y1: start[1],
        CONTROL: 'C',
        cpx1: parseInt(start[0] + end[0])/2,
        cpy1: start[1],
        cpx2: parseInt(start[0] + end[0])/2,
        cpy2: end[1],
        x2: end[0],
        y2: end[1],
    }
    return Object.values(data).join(' ')
}

class TChart {
    constructor(target= '#app', data) {
        this.chart = SVG().addTo(target).size('100%', '100%');
        // const rect = new Rect({width: 100, height: 100}).fill('#369');
        // rect.addTo(this.chart)
        this.container = this.chart.group().attr('class', 'tetris-chart-container');
        this.chart.linesG   = this.container.group().attr('class', 'tetris-chart-lines');
        this.chart.modulesG = this.container.group().attr('class', 'tetris-chart-modules');
        this.chart.resultLinesG = this.container.group().attr('class', 'tetris-chart-resultLines');
        this.chart.resultsG = this.container.group().attr('class', 'tetris-chart-results');
        this.data = data;
        this.lines = [];
        this.modules = [];
        this.results = [];
        this.resultLines = [];
        this.init(data)
    }

    init({lines, modules, results = 0, resultLines}) {
        lines.map( points => {
            this.lines.push({
                id: points.id,
                target: this.chart.linesG.path(generatePoints(points)).stroke({ color: '#333', width: 0.5, linecap: 'round', linejoin: 'round' }).fill('none')
            })
        })
        resultLines.map( points => {
            this.resultLines.push({
                id: points.id,
                target: this.chart.resultLinesG.path(generatePoints(points)).stroke({ color: '#333', width: 0.5, linecap: 'round', linejoin: 'round' }).fill('none')
            })
        })
        for(let i = 0; i<= results; i++) {
            this.results.push({
                id: 0,
                target:  this.chart.resultsG.circle(5).attr({ stroke: '#589DF9', fill: '#ffffff', lineWidth: 2})
            })
        }
    }

    update() {

    }

    move() {

    }


}

export default TChart;