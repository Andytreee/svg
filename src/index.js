import { SVG, Rect, Path, G  } from '@svgdotjs/svg.js'
import {
    generateLinePosition,
    generatePoints
} from './tool';
import Module from './Module';



class TChart {
    constructor(target= '#app', data) {
        this.chart = SVG().addTo(target).size('100%', '100%');
        // const rect = new Rect({width: 100, height: 100}).fill('#369');
        // rect.addTo(this.chart)
        this.container = this.chart.group().addClass( 'tetris-chart-container');
        this.modulesG = this.container.group().addClass('tetris-chart-modules');
        this.linesG  = this.container.group().addClass('tetris-chart-lines');
        this.resultLinesG = this.container.group().addClass('tetris-chart-resultLines');
        this.resultsG = this.container.group().addClass('tetris-chart-results');
        this.tempLineG = this.container.group();
        this.data = data;
        this.lines = [];
        this.modules = [];
        this.results = [];
        this.resultLines = [];
        // container 初始缩放 位置参数
        this.matrix = {
            a: 1,
            b: 0,
            c: 0,
            d: 1,
            e: 0 ,
            f: 0,
        };
        this.init(data)
        this.zoom()
    }

    init({lines, modules, results = 0, resultLines}) {
        lines.map( line => {
            this.lines.push({
                id: line.id,
                data: line,
                target: this.linesG
                    .path(generatePoints(line))
                    .stroke({
                        color: '#333',
                        width: 0.5,
                        linecap: 'round',
                        linejoin: 'round'
                    })
                    .fill('none')
                // .mouseover(function() {
                //     this.css({
                //             cursor:  'pointer',
                //             stroke: '#f06',
                //             lineWidth: 2
                //         })
                // })
            })
        });

        resultLines.map( line => {
            this.resultLines.push({
                id: line.id,
                data: line,
                target: this.resultLinesG
                    .path(generatePoints(line))
                    .stroke({
                        color: '#333',
                        width: 0.5,
                        linecap: 'round',
                        linejoin: 'round'
                    })
                    .fill('none')
            })
        });

        for(let i = 0; i<= results; i++) {
            this.results.push({
                id: 0,
                target: this.resultsG
                    .circle(20)
                    .move(1780, (i + 1) * 50 - 10)
                    .attr({
                        stroke: '#589DF9',
                        fill: '#ffffff',
                        lineWidth: 2
                    })
                    .css('cursor', 'pointer')

            })
        }
        this.drawModules(modules)
    }

    update() {

    }

    drawModules(modules) {
        modules.map( module => {
            const group = new Module(module, this.chart, this.lines, this.resultLines, this.tempLineG);
            group.addTo(this.modulesG);
            this.resultLines.push({
                id: module.id,
                data: module,
                target: group,
            })
        })
    }

    move() {

    }

    zoom() {
        this.container.on('zoom', e=> {
            this.container
                .transform(this.matrix)
        })
        document.querySelector('#app').addEventListener('wheel', e=> {
            e.preventDefault();
            if(e.deltaY > 0 && this.matrix.a < 2) {
                this.matrix.a += 0.2;
                this.matrix.d += 0.2;
                this.container.fire('zoom')
            }
            if(e.deltaY < 0 && this.matrix.a > 0.6) {
                this.matrix.a -= 0.2;
                this.matrix.d -= 0.2;
                this.container.fire('zoom')
            }

        })
    }

    translate() {

    }
}

export default TChart;