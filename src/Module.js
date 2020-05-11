import { G } from "@svgdotjs/svg.js";
import {
    generateLinePosition,
    generatePoints,
    height,
    width,
    textH,
    modulesKV,
    status,
    generateResultPosition
} from "./tool";

export default class Module{
    constructor(module, chart, container, lines, resultLines, tempLineG, matrix, addModuleInfo, parent,deleteModule) {
        this.lines = lines;
        this.chart = chart;
        this.resultLines = resultLines;
        this.tempLineG = tempLineG;
        this.matrix = matrix;
        this.container = container;
        this.addModuleInfo = addModuleInfo;
        this.deleteModule = deleteModule;
        return this.draw(module)
    }
    drawNode() {

    }
    draw(module) {
        const group = new G();

        // 初始化模块位置
        group
            .matrix({
                a: 1, b: 0, c: 0, d: 1, e: module.x , f: module.y,
            })
            .mousedown(e => {
                // 点击时将当前模块置于最前
                group.front();
                // 阻止事件传递到container产生拖拽
                e.stopPropagation();
                // 隐藏右键菜单
                this.chart.fire('menuHide');
            })
            .node.oncontextmenu = e => {
                this.chart.fire('menuShow', e);
                this.deleteModule.id = module.id;
            };
        // .native()
        // .on('contextMenu', e => {
        //     console.log(e)
        // })
        // 记录拖拽相关位置信息
        const dragInfo = {
            draggable: false,
        };
        // 绘制模块框体并定义拖拽事件
        group
            .rect(100, 86)
            .radius(10)
            .css({
                cursor: 'move',
                fill: '#fff',
                stroke: '#333',
                lineWidth: 2
            })
            .mousedown(e =>{
                this.handleMove( e, module, group, dragInfo)
            });

        // 绘制模块小圆点
        const r  = 10;
        for(let i=0; i<module.inNum; i++) {
            const span = height / (module.inNum + 1);
            const position = {
                x: -r/2,
                y: (i + 1) * span - r/2
            };
            group
                .circle(r)
                .css('cursor', 'pointer')
                .attr({
                    stroke: '#589DF9',
                    fill: '#ffffff',
                    lineWidth: 2
                })
                .move( position.x, position.y)
                .mouseup(e => {
                    if(this.addModuleInfo.startNodeId) {
                        // 防止触发 chart mouseup事件 清除addModuleInfo 数据
                        e.stopPropagation();
                        this.addModuleInfo.endNodeId = module.id;
                        this.addModuleInfo.endNodeIndex = i;
                        this.addModuleInfo.end = [position.x + module.x + r/2, position.y + module.y + r/2];
                        this.addModuleInfo.type = 'line';
                        this.addModuleInfo.endModule = module;
                        this.tempLineG.clear();
                        this.chart.css('cursor', 'grab');
                        this.chart.fire('addLine')
                    }
                })
        }

        for(let i=0; i<module.outNum; i++) {
            const span = height / (module.outNum + 1);
            const position = {
                x: width - r/2,
                y: (i + 1) * span - r/2
            };
            const circle = group
                .circle(r)
                .css('cursor', 'pointer')
                .attr({
                    stroke: '#589DF9',
                    fill: '#ffffff',
                    lineWidth: 2
                })
                .move( position.x, position.y )
                .mousedown(e => {
                    this.tempLineG.clear();
                    this.tempLineG
                        .path(generatePoints({
                            start: [ 0, 0 ],
                            end: [0, 0 ],
                        }))
                        .stroke({
                            color: '#333',
                            width: 0.5,
                            linecap: 'round',
                            linejoin: 'round'
                        })
                        .fill('none')
                    ;
                    this.addModuleInfo.startNodeId = module.id;
                    this.addModuleInfo.startNodeIndex = i;
                    this.addModuleInfo.start = [position.x + module.x + r/2, position.y + module.y + r/2];
                    this.addModuleInfo.startModule = module;
                    this.chart
                        .css('cursor', 'default')
                        .mousemove(null)
                        .mouseup(null)
                        .mousemove( e => {
                            this.handleTempLine([position.x + module.x + r/2, position.y + module.y + r/2], e)
                        })
                        .mouseup( e => {
                            this.tempLineG.clear();
                            this.chart.css('cursor', 'grab');
                            this.addModuleInfo.startNodeId = null;
                        })
                })
        }

        // 绘制title  font属性需设置在move后
        group
            .plain(`${modulesKV[module.type].text}-${module.id}`)
            .css({
                'user-select': 'none'
            })
            .move( width/2, -textH)
            .font({
                family:'Microsoft YaHei',
                size: 14,
                anchor: 'middle',
            });

        // 模块图片
        group
            .image(modulesKV[module.type].img)
            .size(36, 36)
            .css('cursor', 'move')
            .move(width/2 - 18, 10)
            .mousedown(e =>{
                this.handleMove( e, module, group, dragInfo)
            });

        // 模块运行状态图片
        group
            .image(status[module.status || 0])
            .size(18, 18)
            .css('cursor', 'move')
            .move(width/2 - 9, 56)
            .mousedown(e =>{
                this.handleMove( e, module, group, dragInfo)
            });

        return group
    }

    handleMove(e, module, group, dragInfo) {
        dragInfo.draggable = true;
        const { translateX, translateY } = group.transform();
        dragInfo.clickX = e.offsetX / this.matrix.a - translateX;
        dragInfo.clickY = e.offsetY / this.matrix.a - translateY ;
        this.chart
            .mousemove(null)
            .mouseup(null)
            .mousemove(e => {
                if(dragInfo.draggable) {
                    // const x = e.offsetX - dragInfo.clickX ;
                    // const y = e.offsetY - dragInfo.clickY ;
                    const x = e.offsetX / this.matrix.a - dragInfo.clickX;
                    const y = e.offsetY / this.matrix.a - dragInfo.clickY;
                    requestAnimationFrame(() =>{
                        group.matrix({
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
                                        line.data.end = generateResultPosition(line.data.endNodeIndex);
                                        line.target.plot(generatePoints(line.data))
                                    })
                            })
                        }
                    });
                }
            })
            .mouseup( e => {
                dragInfo.draggable = false;
            })
    }

    handleTempLine(start, e) {
        const target = this
            .tempLineG
            .children()[0];
        target && target.plot(generatePoints({
            start: start,
            end: [e.offsetX -this.matrix.e - 1, e.offsetY - this.matrix.f].map( v => v/this.matrix.a)
        }));
    }
}