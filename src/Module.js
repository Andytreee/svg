import { G } from "@svgdotjs/svg.js";
// import '@svgdotjs/svg.filter.js';
import {
    generateLinePosition,
    generatePoints,
    moduleInfo,
    modulesKV,
    status,
    generateResultPosition
} from "./tool";

export default class Module{
    constructor(module,
                {
                    chart,
                    container,
                    lines,
                    resultLines,
                    tempLineG,
                    matrix,
                    addModuleInfo,
                    deleteModule,
                    hooks
                }) {
        this.lines = lines;
        this.chart = chart;
        this.resultLines = resultLines;
        this.tempLineG = tempLineG;
        this.matrix = matrix;
        this.container = container;
        this.addModuleInfo = addModuleInfo;
        this.deleteModule = deleteModule;
        this.hooks = hooks;
        return this.draw(module)
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
                // 高亮当前选中节点
                group
                    .parent()
                    .each( (i, g) => {
                        g
                            .first()
                            .css({
                                stroke: 'transparent',
                                // filter: ''
                            });
                    });
                group
                    .first()
                    .css({
                        stroke: '#00a0e9',
                        // filter: 'url(#f1)'
                    });
                // 点击模块钩子函数
                if(this.hooks.onModuleClick) {
                    this.hooks.onModuleClick()
                }
            })
            .node.oncontextmenu = e => {
            this.chart.fire('menuShow', e);
            this.deleteModule.id = module.id;
        };
        // 记录拖拽相关位置信息
        const dragInfo = {
            draggable: false,
        };

        // 绘制模块框体
        group
            .rect(100, 86)
            .radius(10)
            .css({
                fill: '#e1efff',
                opacity: 0.7,
                stroke: 'transparent',
                lineWidth: 2
            })

        // 模块图片
        group
            .image(modulesKV[module.type].img)
            .size(36, 36)
            .move(moduleInfo.width/2 - 18, 10)

        // 模块运行状态图片
        group
            .image(status[module.status || 0])
            .size(18, 18)
            .move(moduleInfo.width/2 - 9, 56)

        // 透明事件层
        group
            .rect(100, 86)
            .radius(10)
            .css({
                cursor: 'move',
                fill: 'transparent',
                opacity: 1,
                stroke: 'transparent',
                lineWidth: 2
            })
            .mousedown(e =>{
                // 左键按下后才能拖拽
                if(e.which !== 1) return;
                // 定义模块拖拽事件
                this.handleMove( e, module, group, dragInfo);
            });

        // 0 0 5px 5px rgba(0, 160, 233, 0.2)
        // 绘制模块小圆点
        for(let i=0; i<module.inNum; i++) {
            const span = moduleInfo.height / (module.inNum + 1);
            const position = {
                x: -moduleInfo.d/2,
                y: (i + 1) * span - moduleInfo.d/2
            };
            group
                .circle(moduleInfo.d)
                .css('cursor', 'pointer')
                .attr(moduleInfo.circleStyle)
                .move( position.x, position.y)
                .mouseup(e => {
                    if(this.addModuleInfo.startNodeId) {
                        // 防止触发 chart mouseup事件 清除addModuleInfo 数据
                        e.stopPropagation();
                        this.addModuleInfo.endNodeId = module.id;
                        this.addModuleInfo.endNodeIndex = i;
                        const { translateX, translateY } = group.transform();
                        this.addModuleInfo.end = [position.x + translateX + moduleInfo.d/2, position.y + translateY + moduleInfo.d/2];
                        this.addModuleInfo.type = 'line';
                        this.addModuleInfo.endModule = module;
                        this.tempLineG.clear();
                        this.chart.css('cursor', 'grab');
                        this.chart.fire('addLine')
                    }
                })
        }

        for(let i=0; i<module.outNum; i++) {
            const span = moduleInfo.height / (module.outNum + 1);
            const position = {
                x: moduleInfo.width - moduleInfo.d/2,
                y: (i + 1) * span - moduleInfo.d/2
            };
            const circle = group
                .circle(moduleInfo.d)
                .css('cursor', 'pointer')
                .attr(moduleInfo.circleStyle)
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
                    const { translateX, translateY } = group.transform();
                    this.addModuleInfo.start = [position.x + translateX + moduleInfo.d/2, position.y + translateY + moduleInfo.d/2];
                    this.addModuleInfo.startModule = module;
                    this.chart
                        .css('cursor', 'default')
                        .mousemove(null)
                        .mouseup(null)
                        .mousemove( e => {
                            const { translateX, translateY } = group.transform();
                            this.handleTempLine([position.x + translateX + moduleInfo.d/2, position.y + translateY + moduleInfo.d/2], e)
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
            .move( moduleInfo.width/2, -moduleInfo.textHeight)
            .font({
                family:'Microsoft YaHei',
                size: moduleInfo.fontSize,
                anchor: 'middle',
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
                            });
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
                            });
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
        // 根据start、end 的x坐标大小，减去 1px 以触发结果点mouseup事件
        const addon = start[0] - (e.offsetX - this.matrix.e) > 0 ? 1 : -1;
        target && target.plot(generatePoints({
            start: start,
            end: [e.offsetX - this.matrix.e + addon, e.offsetY - this.matrix.f].map(v => v / this.matrix.a)
        }));
    }
}