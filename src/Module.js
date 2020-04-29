import { G } from "@svgdotjs/svg.js";
import {
    generateLinePosition,
    generatePoints,
    height,
    width,
    textH,
    modulesKV
} from "./tool";

export default class Module{
    constructor(module,  chart, lines, resultLines) {
        this.lines = lines;
        this.chart = chart;
        this.resultLines = resultLines;
        return this.draw(module, )
    }
    drawNode() {

    }
    draw(module) {
        const group = new G();

        // 初始化模块位置
        group
            .transform({
                a: 1, b: 0, c: 0, d: 1, e: module.x , f: module.y,
            });

        // 记录拖拽相关位置信息
        const dragInfo = {
            draggable: false,
            originX: module.x,
            originY: module.y,
            clickX: 0,
            clickY: 0,
        };

        // 绘制模块框体并定义拖拽事件
        group
            .rect(100, 86)
            .radius(10)
            .mousedown(e =>{
                dragInfo.draggable = true;
                dragInfo.clickX = e.offsetX - dragInfo.originX;
                dragInfo.clickY = e.offsetY - dragInfo.originY;
                this.chart
                    .mousemove(null)
                    .mouseup(null)
                    .mousemove(e => {
                        if(dragInfo.draggable) {
                            const x = e.clientX - dragInfo.clickX;
                            const y = e.clientY - dragInfo.clickY;
                            requestAnimationFrame(() =>{
                                group.transform({
                                    a: 1, b: 0, c: 0, d: 1, e: x , f: y,
                                });
                                if(module.in.length) {
                                    module.in.map(  ins => {
                                        this.lines
                                            .filter( ({id}) => ins.some(({id: inId}) => inId === id) )
                                            .map( line => {
                                                line.data.end = generateLinePosition('end', {
                                                    x,
                                                    y,
                                                    type: module.type,
                                                    index:  line.data.endNodeIndex,
                                                });
                                                line.target.plot(generatePoints(line.data))
                                            })
                                    })
                                }
                                if(module.out.length) {
                                    module.out.map( outs => {
                                        this.lines
                                            .filter( ({id}) => outs.some(({id: inId}) => inId === id) )
                                            .map( line => {
                                                line.data.start = generateLinePosition('start', {
                                                    x,
                                                    y,
                                                    type: module.type,
                                                    index:  line.data.startNodeIndex,
                                                });
                                                line.target.plot(generatePoints(line.data))
                                            })
                                    })
                                    module.out.map( outs => {
                                        this.resultLines
                                            .filter( ({id}) => outs.some(({id: inId}) => inId === id) )
                                            .map( line => {
                                                line.data.start = generateLinePosition('start', {
                                                    x,
                                                    y,
                                                    type: module.type,
                                                    index:  line.data.startNodeIndex,
                                                });
                                                line.data.end = [1780, (line.data.endNodeIndex + 1) * 50 ];
                                                line.target.plot(generatePoints(line.data))
                                            })
                                    })
                                }
                            });
                            dragInfo.originX = x;
                            dragInfo.originY = y;
                        }
                    })
                    .mouseup(function (e) {
                        dragInfo.draggable = false;
                        dragInfo.originX = e.offsetX - dragInfo.clickX;
                        dragInfo.originY = e.offsetY - dragInfo.clickY;
                    })
            })
            .css({
                cursor: 'move',
                fill: '#fff',
                stroke: '#333',
                lineWidth: 2
            });

        // 绘制模块小圆点
        const r  = 10;
        for(let i=0; i<module.inNum; i++) {
            const span = height / (module.inNum + 1);
            group
                .circle(r)
                .move(- r/2, (i + 1) * span - r/2)
                .attr({
                    stroke: '#589DF9',
                    fill: '#ffffff',
                    lineWidth: 2
                })
                .css('cursor', 'pointer')
        }
        for(let i=0; i<module.outNum; i++) {
            const span = height / (module.outNum + 1);
            group
                .circle(r)
                .move(width - r/2, (i + 1) * span - r/2)
                .attr({
                    stroke: '#589DF9',
                    fill: '#ffffff',
                    lineWidth: 2
                })
                .css('cursor', 'pointer')
        }

        // 绘制title
        group
            .plain(`${modulesKV[module.type].text}-${module.id}`)
            .move( width/2, -textH)
            .font({
                family:'Microsoft YaHei',
                size:   14,
                anchor: 'middle',
            })
            .css({
                'user-select': 'none'
            })
        return group
    }
}