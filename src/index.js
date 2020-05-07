import { SVG, Rect, Path, G  } from '@svgdotjs/svg.js'
import {
    generateLinePosition,
    generatePoints, getRandomID
} from './tool';
import Module from './Module';



class TChart {
    constructor(target= '#app', data, options = {}) {
        this.chart = SVG().addTo(target).size('100%', '100%');
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
        // 保存新增连线节点信息
        this.addModuleInfo = {};
        this.init(data);
        this.zoom();
        this.drag();
        this.handleAddLine(options.beforeAddLine);
    }

    init({lines, modules, results = 0, resultLines}) {
        this.drawLines(lines);
        this.drawResultLines(resultLines);
        this.drawResults(results);
        this.drawModules(modules);
    }

    update() {

    }

    drawModules(modules) {
        modules.map( module => {
            const group = new Module(module, this.chart, this.container, this.lines, this.resultLines, this.tempLineG, this.matrix, this.addModuleInfo);
            group.addTo(this.modulesG);
            this.modules.push({
                id: module.id,
                data: module,
                target: group,
            })
        })
    }

    drawLines(lines) {
        lines.map( line => this.drawLine(line));
    }

    drawLine(line) {
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
    }

    drawResultLines(resultLines) {
        resultLines.map( line => this.drawResultLine(line));
    }

    drawResultLine(line) {
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
    }

    drawResults(results) {
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

    drag() {
        // 记录拖拽相关位置信息
        const dragInfo = {
            draggable: false,
            originX: 0,
            originY: 0,
            offsetX: 0,
            offsetY: 0,
        };
        this.container.on('translate', e=> {
            this.container
                .transform(this.matrix)
        });
        this.chart
            .css('cursor', 'grab')
            .mousedown( e => {
                dragInfo.draggable = true;
                dragInfo.originX = e.offsetX;
                dragInfo.originY = e.offsetY;
                this.chart
                    .mousemove(null)
                    .mouseup(null)
                    .mousemove(e => {
                        if(dragInfo.draggable) {
                            const x = e.offsetX - dragInfo.originX;
                            const y = e.offsetY - dragInfo.originY;
                            this.matrix.e = x + dragInfo.offsetX;
                            this.matrix.f = y + dragInfo.offsetY;
                            this.container.fire('translate');
                        }
                    })
                    .mouseup( e => {
                        dragInfo.draggable = false;
                        dragInfo.offsetX = this.matrix.e;
                        dragInfo.offsetY = this.matrix.f;
                    })
            })
    }

    handleAddLine(beforeAddLine) {
        this
            .chart
            .on('addLine', async e => {
                if(this.addModuleInfo.type === 'line') {
                    // 节点连线 todo：连线前钩子函数
                    // if(beforeAddLine) {
                    //
                    // }
                    const id = getRandomID();
                    this.addModuleInfo.id = id;
                    const {
                        startModule,
                        startNodeId,
                        startNodeIndex,
                        endModule,
                        endNodeId,
                        endNodeIndex,
                    } = this.addModuleInfo;
                    if(!Array.isArray(endModule.in[endNodeIndex])) {
                        endModule.in[startNodeIndex] = []
                    }else if(endModule.in[endNodeIndex].length){
                        // 输入节点只能有一个输入源
                        return;
                    }
                    // if(this.lines.some( ({
                    //                       startNodeId: sId,
                    //                       startNodeIndex: sIndex,
                    //                       endNodeId: eId,
                    //                       endNodeIndex: eIndex
                    // }) => sId === startNodeId && startNodeIndex === sIndex && eId === endNodeId && eIndex === endNodeIndex)){
                    //     // 如果输入/输出节点及index完全相同，表明重复连线
                    //     return
                    // }
                    endModule.in[endNodeIndex].push({ id, type: 'line'});
                    if(!Array.isArray(startModule.out[startNodeIndex])) {
                        startModule.out[startNodeIndex] = []
                    }
                    startModule.out[startNodeIndex].push({ id, type: 'line'});
                    this.drawLine(this.addModuleInfo);
                }

            })
    }
}

export default TChart;