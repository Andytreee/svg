import { SVG } from '@svgdotjs/svg.js'
import {
    generatePoints,
    getRandomID,
    generateResultPosition,
    transformData,
} from './tool';
import {
    defineReactive,
    proxyLine,
    proxyResultLine,
    redefineArr
} from './proxy';
import '@svgdotjs/svg.filter.js';
import Module from './Module';
import './index.css'
import { resultInfo } from './tool';

class TChart {
    constructor(target= '#app', { data,  options = {}}) {
        this.parent = document.querySelector(target);
        data = transformData(data, this.parent.clientWidth);
        console.log({
            data
        })
        this.chart = SVG().addTo(target).size('100%', '100%');
        this.chart.node.oncontextmenu = e => e.preventDefault();   // 阻止浏览器默认菜单
        this.container = this.chart.group().addClass( 'tetris-chart-container');
        this.modulesG = this.container.group().addClass('tetris-chart-modules');
        this.linesG  = this.container.group().addClass('tetris-chart-lines');
        this.resultLinesG = this.container.group().addClass('tetris-chart-resultLines');
        this.resultsG = this.container.group().addClass('tetris-chart-results');
        this.tempLineG = this.chart.group();
        this.data = {};
        this.lines = [];
        this.modules = [];
        this.results = [];
        this.resultLines = [];
        // 要删除的连线
        this.deleteLineInfo = {};
        // 要删除的模块id
        this.deleteModule = {};
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
        this.addContextMenu();
        this.hooks = options.hooks || {};
        this.init(data);
        this.zoom();
        this.drag();
        this.handleAddLine();
        this.onModuleContextMenu();
        this.onLineContextMenu();
        this.prev = {}
    }

    init(data) {
        const {
            lines, modules, results = 1, resultLines
        } = data;
        this.data = {
            lines: [],
            resultLines: [],
            modules: [],
        };
        // 定义响应式
        redefineArr(this.data.lines, this.drawLine.bind(this), function reactive(line) {
            const lineProxy = {};
            defineReactive(lineProxy, 'start', function(newValue) {
                lineProxy.end && lineProxy.target.each( (i, child) => {
                    child
                        .plot(generatePoints({
                            start: newValue,
                            end: lineProxy.end
                        }))
                })
            })
            defineReactive(lineProxy, 'end', function (newValue) {
                lineProxy.start && lineProxy.target.each( (i, child) => {
                    child
                        .plot(generatePoints({
                            start: lineProxy.start,
                            end: newValue
                        }))
                })
            })
            for(const key in line) {
                if(line.hasOwnProperty(key)) {
                    lineProxy[key] = line[key]
                }
            }
            return lineProxy;
        });
        redefineArr(this.data.resultLines, this.drawResultLine.bind(this), function reactive(resultLine) {
            let lineProxy = {}
            defineReactive(lineProxy, 'start', function (newValue) {
                lineProxy.target && lineProxy.target.each( (i, child) => {
                    child
                        .plot(generatePoints({
                            start: newValue,
                            end: resultLine.end
                        }))
                })
            })
            for(let key in resultLine) {
                if(resultLine.hasOwnProperty(key) && !['start'].includes(key)) {
                    lineProxy[key] = resultLine[key]
                }
            }
            return lineProxy;
        });
        redefineArr(this.data.modules, this.drawModule.bind(this), function reactive(module) {
            const moduleProxy = {};
            defineReactive(moduleProxy, 'position', function(newValue) {
                const [ x, y ] = newValue;
                moduleProxy.target.matrix({
                    a: 1, b: 0, c: 0, d: 1, e: x , f: y,
                });
            })
            for(const key in module) {
                if(module.hasOwnProperty(key)) {
                    moduleProxy[key] = module[key]
                }
            }
            return moduleProxy;
        })
        // 初始化 线、结果线、结果点、模块
        this.data.lines.push(...lines);
        this.data.modules.push(...modules);
        this.data.resultLines.push(...resultLines);
        this.drawResults(results);

        let resultsP = 1;
        Object.defineProperty(this.data, 'results', {
            get() {
                return resultsP;
            },
            set: (newValue) => {
                this.drawResults(newValue);
                resultsP = newValue
            }
        });
        Object.defineProperty(data, 'lines', {
            writable: false,
        });
        Object.defineProperty(data, 'resultLines', {
            writable: false,
        });
        Object.defineProperty(data, 'modules', {
            writable: false,
        });
    }

    addContextMenu() {
        this.contextMenu = document.createElement('div');
        this.contextMenu.classList.add('tetris-svg-context-menu');
        this.contextMenu.innerHTML = `
                <ul>
                    <li>删除</li> 
                </ul>`;
        this.parent.appendChild(this.contextMenu);
    }

    addFilter() {
        // 选中后阴影效果
        // 暂时未启用
        this.chart.defs().node.innerHTML = `
         <filter id="f1" x="-40%" y="-40%" width="180%" height="180%" filterUnits="userSpaceOnUse">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2"/> 
              <feOffset dx="0" dy="0" result="offsetblur"/> 
              <feOffset dx="0" dy="0" result="offsetblur"/>
              <feMerge> 
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
        </filter>`
    }

    drawModule(module) {
        const target = new Module(module, this);
        target.addTo(this.modulesG)
        return target;
    }

    drawLine(line) {
        return this.generateLine(this.linesG, line);
    }

    drawResultLine(line) {
        return this.generateLine(this.resultLinesG, line, 'result')
    }

    generateLine(g, line, type = 'line') {
        const lineG = g.group();
        // 线样式 展示层
        lineG
            .path(generatePoints(line))
            .stroke({
                color: '#999',
                width: 0.5,
            })
            .fill('none')
        // 透明事件层
        const eventTarget = lineG
            .path(generatePoints(line))
            .stroke({
                color: 'transparent',
                width: 5,
            })
            .fill('none')
            .css('cursor', 'pointer');
        // contextmenu事件
        eventTarget.node.oncontextmenu = e => {
            this.deleteLineInfo.id = line.id;
            this.deleteLineInfo.type = type;
            this.chart.fire('deleteLine');
        };
        return lineG
    }

    drawResults(results) {
        this.resultsG.clear();
        for(let i = 0; i<= results + 1; i++) {
            this.resultsG
                .circle(resultInfo.d)
                .move(this.parent.clientWidth - resultInfo.d - resultInfo.marginRight, (i + 1) * resultInfo.marginTop -  resultInfo.d /2)
                .attr({
                    stroke: '#589DF9',
                    fill: '#FFF',
                    lineWidth: 2
                })
                .css('cursor', 'pointer')
                // 防止触发拖拽事件
                .mousedown( e => e.stopPropagation())
                .mouseup( e => {
                    // 处理结果线逻辑
                    if(this.addModuleInfo.startNodeId) {
                        // 防止触发 chart mouseup事件 清除addModuleInfo 数据
                        e.stopPropagation();
                        this.addModuleInfo.endNodeId = -1;
                        this.addModuleInfo.endNodeIndex = i;
                        this.addModuleInfo.end = generateResultPosition(i);
                        this.addModuleInfo.type = 'resultLine';
                        this.tempLineG.clear();
                        this.chart.css('cursor', 'grab');
                        this.chart.fire('addLine')
                    }
                })
        }
    }
    // 画布缩放
    zoom() {
        this.container.on('zoom', e=> {
            const { x, y } = e.detail;
            const { scaleX, scaleY, translateX, translateY  } = this.container.transform();
            let dx = 0,dy =0
            if(this.prev.x !== undefined) {
                // 修正不同位置缩放造成的位置偏差
                dx = (x- this.prev.x) * ( (1 -  scaleX) / scaleX);
                dy = (y- this.prev.y) * ( (1 -  scaleY) / scaleY);
            }
            this.prev = {
                x,
                y,
                translateX,
                translateY,
                scaleX,
                scaleY,
                dx,
                dy
            }
            this.container
                .attr('transform-origin', `${ x  - translateX  + dx } ${ y - translateY  + dy}`)
                .matrix({
                    ...this.matrix,
                    e: this.matrix.e - dx,
                    f: this.matrix.f - dy
                })
            this.chart.fire('menuHide');
        });
        // 显示当前缩放比例的 tip
        const div = document.createElement('div');
        div.classList.add('tetris-scale-tip');
        this.parent.appendChild(div);
        let timer = null;
        function handleZoom(e) {
            const { offsetX, offsetY } = e;
            e.preventDefault();
            if(e.deltaY > 0 && this.matrix.a > 0.5) {
                this.matrix.a -= 0.25;
                this.matrix.d -= 0.25;
                this.container.fire('zoom', { x: offsetX, y: offsetY })
            }
            if(e.deltaY < 0 && this.matrix.a < 2) {
                this.matrix.a += 0.25;
                this.matrix.d += 0.25;
                this.container.fire('zoom', { x: offsetX, y: offsetY })
            }
            div.innerText = Math.round(this.matrix.a * 100 )  + '%';
            div.classList.add('active');
            clearTimeout(timer);
            timer = setTimeout(() => {
                div.classList.remove('active')
            }, 2000 )
        }
        this.chart.node.addEventListener('wheel', handleZoom.bind(this))
    }
    // 画布拖拽
    drag() {
        // 记录拖拽相关位置信息
        const dragInfo = {
            draggable: false,
            originX: 0,
            originY: 0,
            offsetX: 0,
            offsetY: 0,
        };
        this
            .container
            .on('translate', e=> {
                this.container
                    .matrix(this.matrix);
                this.chart.fire('menuHide');
            });
        this
            .chart
            .mousedown( e => {
                dragInfo.draggable = true;
                dragInfo.originX = e.offsetX;
                dragInfo.originY = e.offsetY;
                // 左键按下后才能拖拽
                if(e.which !== 1) return dragInfo.draggable = false;
                this.chart
                    .css('cursor', 'grab')
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
                        this.chart
                            .css('cursor', 'default');
                        dragInfo.offsetX = this.matrix.e;
                        dragInfo.offsetY = this.matrix.f;
                    })
            })
    }

    handleAddLine() {
        this
            .chart
            .on('addLine', async e => {
                if(this.addModuleInfo.endNodeId === -1 ) {
                    if(this.hooks.onAddResultLine) {
                        await this.hooks.onAddResultLine()
                    }
                    const id = getRandomID();
                    this.addModuleInfo.id = id;
                    const {
                        startModule,
                        startNodeIndex,
                        endNodeIndex,
                    } = this.addModuleInfo;
                    if(this.data.resultLines.some( resultLine => resultLine.endNodeIndex === endNodeIndex)) {
                        // 如果该结果点已经连接则不允许再连接
                        return;
                    }
                    if(startModule.out[startNodeIndex].some(({type}) => type === 'result')) {
                        // 一个节点的输出节点只能连接一个结果点
                        return;
                    }
                    startModule.out[startNodeIndex].push({ id, type: 'result'});
                    // 复制新增节点信息
                    this.data.resultLines.push({
                        end: this.addModuleInfo.end,
                        endNodeId: this.addModuleInfo.endNodeId,
                        endNodeIndex: this.addModuleInfo.endNodeIndex,
                        id,
                        start: this.addModuleInfo.start,
                        startNodeId: this.addModuleInfo.startNodeId,
                        startNodeIndex: this.addModuleInfo.startNodeIndex,
                    })
                    // 增加结果点
                    // this.updateResults()
                }else {
                    // 节点连线
                    let id = getRandomID();
                    if(this.hooks.onAddLine) {
                        id = await this.hooks.onAddLine()
                    }
                    this.addModuleInfo.id = id;
                    const {
                        startModule,
                        startNodeIndex,
                        endModule,
                        endNodeIndex,
                    } = this.addModuleInfo;
                    if(endModule.in[endNodeIndex].length){
                        // 输入节点只能有一个输入源
                        return;
                    }
                    endModule.in[endNodeIndex].push({ id, type: 'line'});
                    startModule.out[startNodeIndex].push({ id, type: 'line'});
                    this.data.lines.push({
                        end: this.addModuleInfo.end,
                        endNodeId: this.addModuleInfo.endNodeId,
                        endNodeIndex: this.addModuleInfo.endNodeIndex,
                        id,
                        start: this.addModuleInfo.start,
                        startNodeId: this.addModuleInfo.startNodeId,
                        startNodeIndex: this.addModuleInfo.startNodeIndex,
                    })
                }
            })
    }

    updateResults() {
        let maxResultIndex = 0;
        this.data.resultLines.map(({endNodeIndex}) => {
            if(endNodeIndex > maxResultIndex) maxResultIndex = endNodeIndex;
        });
        this.data.results = maxResultIndex;
    }

    onLineContextMenu() {
        // 右键删除连线
        this
            .chart
            .on('deleteLine', async e => {
                if(this.deleteLineInfo.type === 'line') {
                    if(this.hooks.onDeleteLine) {
                        await this.hooks.onDeleteLine()
                    }
                    this.deleteLine(this.deleteLineInfo.id)
                }else if(this.deleteLineInfo.type === 'result') {
                    if(this.hooks.onDeleteResultLine) {
                        await this.hooks.onDeleteResultLine()
                    }
                    this.deleteResultLine(this.deleteLineInfo.id);
                    this.updateResults();
                }
            })
    }

    deleteLine(id) {
        try{
            // 删除dom节点
            const index = this.findLineIndexInLines(id);
            if(index > -1) {
                // 删除存储的数据
                this.data.lines.splice(index, 1);
            }
        }catch (e) {
            console.error(e)
        }
    }

    deleteResultLine(id) {
        try{
            // 删除dom节点
            const index = this.findLineIndexInResultLines(id);
            if(index > -1) {
                // 删除存储的数据
                this.data.resultLines.splice(index, 1);
            }
        }catch (e) {
            console.error(e)
        }
    }

    onModuleContextMenu() {
        this
            .chart
            .on('menuShow', e => {
                // 设置节点位置
                const { offsetX, offsetY } = e.detail;
                this.contextMenu.style.display = 'inline-block';
                this.contextMenu.style.left = offsetX + 'px';
                this.contextMenu.style.top  = offsetY + 'px';
            });
        const hideMenu = () => {
            this.contextMenu.style.display = 'none';
        };
        this.chart.on('menuHide', hideMenu);
        this.chart.click(hideMenu);
        document.querySelector('.tetris-svg-context-menu').addEventListener('click', this.handleDeleteModule.bind(this))
    }

    async handleDeleteModule() {
        if(this.hooks.onDeleteModule) {
            await this.hooks.onDeleteModule(this.deleteModule.id)
        }
        this.chart.fire('menuHide');
        const module = this.findModuleInModules(this.deleteModule.id);
        //  删除连线
        module.in.map( arr => arr.map(({id}) => this.deleteLine(id)));
        module.out.map( arr => arr.map(({id, type}) => {
            if(type === 'line') {
                this.deleteLine(id);
            }else{
                this.deleteResultLine(id);
            }
        }));
        const index = this.findModuleIndexInModules(this.deleteModule.id);
        if(index > -1) {
            // 删除存储的数据
            this.data.modules.splice(index, 1);
        }
        // 重绘结果点
        this.updateResults()
    }

    findModuleInModules(targetId) {
        return this.data.modules.find(({id}) => id === targetId)
    }

    findModuleIndexInModules(targetId) {
        return this.data.modules.findIndex(({id}) => id === targetId)
    }

    findLineInLines(targetId) {
        return this.data.lines.find(({id}) => id === targetId);
    }

    findLineIndexInLines(targetId) {
        return this.data.lines.findIndex(({id}) => id === targetId);
    }

    findLineInResultLines(targetId) {
        return this.data.resultLines.find(({id}) => id === targetId);
    }

    findLineIndexInResultLines(targetId) {
        return this.data.resultLines.findIndex(({id}) => id === targetId);
    }
}

export default TChart;