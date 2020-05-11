import { SVG, Rect, Path, G  } from '@svgdotjs/svg.js'
import {
    generateLinePosition,
    generatePoints,
    getRandomID,
    generateResultPosition
} from './tool';
import Module from './Module';
import './index.css'


class TChart {
    constructor(target= '#app', data, options = {}) {
        this.chart = SVG().addTo(target).size('100%', '100%');
        this.chart.node.oncontextmenu = e => e.preventDefault();   // 阻止浏览器默认菜单
        this.container = this.chart.group().addClass( 'tetris-chart-container');
        this.modulesG = this.container.group().addClass('tetris-chart-modules');
        this.linesG  = this.container.group().addClass('tetris-chart-lines');
        this.resultLinesG = this.container.group().addClass('tetris-chart-resultLines');
        this.resultsG = this.container.group().addClass('tetris-chart-results');
        this.tempLineG = this.container.group();
        this.parent = document.querySelector(target);
        this.contextMenu = document.createElement('div');
        this.contextMenu.classList.add('tetris-svg-context-menu');
        this.contextMenu.innerHTML = `<ul>
                    <li><span></span> 删除</li> 
                </ul>`;
        this.parent.appendChild(this.contextMenu);
        this.data = data;
        this.lines = [];
        this.modules = [];
        this.results = [];
        this.resultLines = [];
        // 要删除的连线
        this.deleteLineInfo = {
            type: '',
            id: null
        };
        // 要删除的模块id
        this.deleteModule = {
            id: null
        };
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
        this.handleAddLine();
        this.hooks = options.hooks || {};
        this.onModuleContextMenu();
        this.onLineContextMenu();

    }

    init({lines, modules, results = 1, resultLines}) {
        this.drawLines(lines);
        this.drawResultLines(resultLines);
        this.drawResults(results);
        this.drawModules(modules);
    }

    update() {

    }

    drawModules(modules) {
        modules.map( module => {
            const group = new Module(module, this.chart, this.container, this.lines, this.resultLines, this.tempLineG, this.matrix, this.addModuleInfo, this.parent, this.deleteModule);
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
            target: this.generateLine(this.linesG, line),
        })
    }

    drawResultLines(resultLines) {
        resultLines.map( line => this.drawResultLine(line));
    }

    drawResultLine(line) {
        this.resultLines.push({
            id: line.id,
            data: line,
            target: this.generateLine(this.resultLinesG, line, 'result'),
        })
    }

    generateLine(g, line, type = 'line') {
        // 线样式
        const target  = g
            .path(generatePoints(line))
            .stroke({
                color: '#999',
                width: 1,
                linecap: 'round',
                linejoin: 'round'
            })
            .fill('none')
            .css('cursor', 'pointer');
        // contextmenu事件
        target.node.oncontextmenu = e => {
            this.deleteLineInfo.id = line.id;
            this.deleteLineInfo.type = type;
            console.log(target.array())
            this.chart.fire('deleteLine');

        };
        return target
    }

    drawResults(results) {
        const r = 20;
        this.results = [];
        this.resultsG.clear();
        for(let i = 0; i<= results + 1; i++) {
            this.results.push({
                id: i,
                linked: this.resultLines.some( line => line.data.endNodeIndex === i),  // 判断是否连接
                target: this.resultsG
                    .circle(r)
                    .move(this.parent.clientWidth - r - 20, (i + 1) * 50 - 10)
                    .attr({
                        stroke: '#589DF9',
                        fill: '#ffffff',
                        lineWidth: 2
                    })
                    .css('cursor', 'pointer')
                    .mouseup( e => {
                        if(this.addModuleInfo.startNodeId) {
                            // 防止触发 chart mouseup事件 清除addModuleInfo 数据
                            e.stopPropagation();
                            this.addModuleInfo.endNodeId = 'result';
                            this.addModuleInfo.endNodeIndex = i;
                            this.addModuleInfo.end = generateResultPosition(i);
                            this.addModuleInfo.type = 'resultLine';
                            this.tempLineG.clear();
                            this.chart.css('cursor', 'grab');
                            this.chart.fire('addLine')
                        }
                    })
            })
        }
    }
    // 画布缩放
    zoom() {
        this.container.on('zoom', e=> {
            this.container
                .matrix(this.matrix);
            this.chart.fire('menuHide');
        });
        function handleZoom(e) {
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
            .css('cursor', 'grab')
            .mousedown( e => {
                dragInfo.draggable = true;
                dragInfo.originX = e.offsetX;
                dragInfo.originY = e.offsetY;
                console.log({
                    x: e.offsetX,
                    y: e.offsetY,
                })
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

    handleAddLine() {
        this
            .chart
            .on('addLine', async e => {
                console.log({
                    info: this.addModuleInfo
                })
                if(this.addModuleInfo.type === 'line') {
                    // 节点连线 todo：连线前钩子函数
                    // if(beforeAddLine) {
                    //
                    // }
                    const id = getRandomID();
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
                    this.drawLine(this.addModuleInfo);
                }else if(this.addModuleInfo.type === 'resultLine') {
                    const id = getRandomID();
                    this.addModuleInfo.id = id;
                    const {
                        startModule,
                        startNodeIndex,
                        endNodeIndex,
                    } = this.addModuleInfo;
                    if(this.results[endNodeIndex].linked) {
                        // 如果该结果点已经连接则不允许再连接
                        return;
                    }
                    if(startModule.out[startNodeIndex].some(({type}) => type === 'result')) {
                        // 一个节点的输出节点只能连接一个结果点
                        return;
                    }
                    startModule.out[startNodeIndex].push({ id, type: 'result'});
                    console.log(this.addModuleInfo)
                    // 复制新增节点信息
                    const info = {};
                    for(let key in this.addModuleInfo) {
                        info[key] = this.addModuleInfo[key]
                    }
                    this.drawResultLine(info);
                    // 增加结果点
                    this.updateResults()
                }
            })
    }

    updateResults() {
        let maxResultIndex = 0;
        this.resultLines.map(({data: {endNodeIndex}}) => {
            if(endNodeIndex > maxResultIndex) maxResultIndex = endNodeIndex;
        });
        console.log(maxResultIndex, this.resultLines)
        this.drawResults(maxResultIndex)
    }

    onLineContextMenu() {
        this
            .chart
            .on('deleteLine', e => {
                if(this.deleteLineInfo.type === 'line') {
                    this.deleteLine(this.deleteLineInfo.id)
                }else if(this.deleteLineInfo.type === 'result') {
                    this.deleteResultLine(this.deleteLineInfo.id)
                }
                this.updateResults();
            })
    }

    deleteLine(id) {
        try{
            // 删除dom节点
            // console.log(this.findLineInLines(id))
            const line = this.findLineInLines(id);
            console.log({
                line
            })
            if(line) line.target.node.remove();
            const index = this.findLineIndexInLines(id);
            if(index > -1) {
                // 删除存储的数据
                this.lines.splice(index, 1);
            }
        }catch (e) {
            console.error(e)
        }
    }

    deleteResultLine(id) {
        try{
            // 删除dom节点
            // console.log(id, this.findLineInResultLines(id));
            const resultLine = this.findLineInResultLines(id);
            console.log({
                resultLine
            })
            if(resultLine) resultLine.target.node.remove();
            const index = this.findLineIndexInResultLines(id);
            if(index > -1) {
                // 删除存储的数据
                this.resultLines.splice(index, 1);
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
        // 暂时删除功能写在这里
        const handleDelete = e => {
            // 隐藏右键菜单
            this.chart.fire('menuHide');
            const module = this.findModuleInModules(this.deleteModule.id);
            //  删除连线
            module.data.in.map( arr => arr.map(({id}) => this.deleteLine(id)));
            module.data.out.map( arr => arr.map(({id, type}) => {
                if(type === 'line') {
                    this.deleteLine(id);
                }else{
                    this.deleteResultLine(id);
                }
            }));

            // 删除节点
            module.target.node.remove();
            const index = this.findModuleIndexInModules(this.deleteModule.id);
            if(index > -1) {
                // 删除存储的数据
                this.modules.splice(index, 1);
            }
            // 重绘结果点
            this.updateResults()
        };

        document.querySelector('.tetris-svg-context-menu').addEventListener('click', handleDelete)
    }


    findModuleInModules(targetId) {
        return this.modules.find(({id}) => id === targetId)
    }

    findModuleIndexInModules(targetId) {
        return this.modules.findIndex(({id}) => id === targetId)
    }

    findLineInLines(targetId) {
        return this.lines.find(({id}) => id === targetId);
    }

    findLineIndexInLines(targetId) {
        return this.lines.findIndex(({id}) => id === targetId);
    }

    findLineInResultLines(targetId) {
        return this.resultLines.find(({id}) => id === targetId);
    }

    findLineIndexInResultLines(targetId) {
        return this.resultLines.findIndex(({id}) => id === targetId);
    }
}

export default TChart;