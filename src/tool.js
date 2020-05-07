/*
 * @Description: 2D图谱渲染工具入口
 * @version: 0.0.1
 * @Author: Andy
 * @Date: 2020/4/28 16:04
 * @LastEditors: Andy
 * @LastEditTime: 2020/4/28 16:04
 */
// 模块宽度  高度
import module from './module.png';
import initial from './status/initial.png';
import running from './status/running.png';
import failure from './status/failure.png';
import success from './status/success.png';


export const width  = 100;
export const height = 86;
export const textH  = 24;
export const modulesKV = {
    // 数据源
    '11': {
        inputNum: 0,
        outputNum: 1,
        text: '数据表',
        img: module,
        url: 'DataTable'
    },
    '12': {
        inputNum: 0,
        outputNum: 1,
        text: '静态文件接入',
        img: module,
        url: 'StaticFile'
    },
    // 预处理
    '21': {
        inputNum: 2,
        outputNum: 1,
        text: 'Join',
        img: module,
        url: 'Join'
    },
    '22': {
        inputNum: 2,
        outputNum: 1,
        text: 'Append',
        img: module,
        url: 'Append'
    },
    '31': {
        inputNum: 1,
        outputNum: 2,
        text: '数据集切分',
        img: module,
        url: 'DatasetSlicing'
    },
    '35': {
        inputNum: 1,
        outputNum: 1,
        text: '特征缩放',
        img: module,
        url: 'FeatureScaling'
    },
    '38': {
        inputNum: 1,
        outputNum: 1,
        text: '样本采样',
        img: module,
        url: 'Sampling'
    },
    '32': {
        inputNum: 1,
        outputNum: 1,
        text: '缺失值处理',
        img: module,
        url: 'MissingValue'
    },
    '36': {
        inputNum: 1,
        outputNum: 1,
        text: '异常点处理',
        img: module,
        url: 'AnomalyAnalysis'
    },
    '33': {
        inputNum: 1,
        outputNum: 1,
        text: '选择指定列',
        img: module,
        url: 'DeleteColumn'
    },
    // 数据探索
    '61': {
        inputNum: 1,
        outputNum: 0,
        text: '多变量描述性分析',
        img: module,
        url: 'MultiVariable'
    },

    // 特征工程
    '301': {
        inputNum: 1,
        outputNum: 1,
        text: '分箱',
        img: module,
        url: 'Binning'
    },
    '37': {
        inputNum: 1,
        outputNum: 1,
        text: '特征编码',
        img: module,
        url: 'FeatureCoding'
    },
    '34': {
        inputNum: 1,
        outputNum: 1,
        text: '降维',
        img: module,
        url: 'DimensionalityReduction'
    },
    '302': {
        inputNum: 1,
        outputNum: 1,
        text: '尺度变换',
        img: module,
        url: 'ScaleChanging'
    },
    '39': {
        inputNum: 1,
        outputNum: 1,
        text: '特征组合',
        img: module,
        url: 'FeatureCombination'
    },
    // 机器学习
    '52': {
        inputNum: 1,
        outputNum: 2,
        text: 'Mean-Shift',
        img: module,
        url: 'MeanShift'
    },
    '405': {
        inputNum: 1,
        outputNum: 1,
        text: '时间序列',
        img: module,
        url: 'TimeSeries'
    },
    '41': {
        inputNum: 2,
        outputNum: 2,
        text: '逻辑回归',
        img: module,
        url: 'LogisticRegression'
    },
    '42': {
        inputNum: 2,
        outputNum: 2,
        text: '线性回归',
        img: module,
        url: 'LinearRegression'
    },
    '44': {
        inputNum: 2,
        outputNum: 2,
        text: 'KNN-Classifier',
        img: module,
        url: 'KNNClassifier'
    },
    '404': {
        inputNum: 2,
        outputNum: 2,
        text: 'KNN-Regression',
        img: module,
        url: 'KNNRegression'
    },
    '46': {
        inputNum: 2,
        outputNum: 2,
        text: 'GBDT-Classifier',
        img: module,
        url: 'GBDTClassifier'
    },
    '403': {
        inputNum: 2,
        outputNum: 2,
        text: 'GBDT-Regression',
        img: module,
        url: 'GBDTRegression'
    },

    '48': {
        inputNum: 2,
        outputNum: 2,
        text: 'XGBOOST-Classifier',
        img: module,
        url: 'XGBOOSTClassifier'
    },
    '49': {
        inputNum: 2,
        outputNum: 2,
        text: 'XGBOOST-Regression',
        img: module,
        url: 'XGBOOSTRegression'
    },
    '401': {
        inputNum: 2,
        outputNum: 2,
        text: 'DecisionTree-Classifier',
        img: module,
        url: 'DecisionTreeClassifier'
    },
    '402': {
        inputNum: 2,
        outputNum: 2,
        text: 'DecisionTree-Regression',
        img: module,
        url: 'DecisionTreeRegression'
    },
    '43': {
        inputNum: 2,
        outputNum: 2,
        text: '神经网络',
        img: module,
        url: 'neuralNet'
    },
    '51': {
        inputNum: 1,
        outputNum: 2,
        text: 'Kmeans',
        img: module,
        url: 'kmeans'
    },
    '45': {
        inputNum: 2,
        outputNum: 2,
        text: 'SVM-SVC',
        img: module,
        url: 'SVMSVC'
    },
    '47': {
        inputNum: 2,
        outputNum: 2,
        text: 'SVM-SVR',
        img: module,
        url: 'SVMSVR'
    },
    // 模型评价
    '73': {
        inputNum: 2,
        outputNum: 0,
        text: '模型评估',
        img: module,
        url: 'ModelEvaluation'
    },
    '74': {
        inputNum: 3,
        outputNum: 0,
        text: '模型对比',
        img: module,
        url: 'ModelCompare'
    },
    // notenook
    '91': {
        inputNum: 5,
        outputNum: 5,
        text: 'Notebook',
        img: module,
        url: 'Notebook'
    },


};
export const status = {
    '-1': initial,
    0: initial,
    1: running,
    2: success,
    3: failure,
}
export const modulesIndexKey = {
    // 数据源
    DataTable: 11,
    StaticFile: 12,

    // 预处理
    Join: 21,
    Append: 22,
    DatasetSlicing: 31,
    FeatureScaling: 35,
    Sampling: 38,
    MissingValue: 32,
    AnomalyAnalysis: 36,
    DeleteColumn: 33,

    // 数据探索
    MultiVariable: 61,

    // 特征工程
    FeatureCoding: 37,
    Binning: 301,
    ScaleChanging: 302,
    FeatureCombination: 39,
    DimensionalityReduction: 34,

    // 机器学习
    'Mean-Shift': 52,
    TimeSeries: 405,
    LogisticRegression: 41,
    'SVM-SVC': 45,
    'SVM-SVR': 47,
    'GBDT-Classifier': 46,
    'GBDT-Regression': 403,
    'XGBOOST-Classifier': 48,
    'XGBOOST-Regression': 49,
    'DecisionTree-Classifier': 401,
    'DecisionTree-Regression': 402,
    logReg: 41,
    lineReg: 42,
    NeuralNet: 43,
    kmeans: 51,
    // DecisionTree
    LinearRegression: 42,
    'KNN-Classifier': 44,
    'KNN-Regression': 404,
    // 模型评价
    ModelCompare: 74,
    ModelEvaluation: 73,

    // notenook
    Notebook: 91,
};

export function getRandomID(randomLength = 8) {
    return Number(
        Math.random()
            .toString()
            .substr(3, randomLength || 8) + Date.now()
    ).toString(36);
}

export function transformData({ nodes, edges }) {
    edges = edges.map(({ id, startNodeId, startNodeIndex,  endNodeId, endNodeIndex }) => {
        const startNode = nodes.find(({id}) => id === startNodeId);
        const endNode = nodes.find(({id}) => id === endNodeId);
        const start = generateLinePosition('start', {
            x: startNode.locationX,
            y: startNode.locationY,
            type: startNode.type,
            index: startNodeIndex,
        });
        const end = generateLinePosition('end', {
            x: endNode.locationX,
            y: endNode.locationY,
            type: endNode.type,
            index: endNodeIndex,
        });
        return {
            id,
            start,
            end,
            startNodeId,
            startNodeIndex,
            endNodeId,
            endNodeIndex,
        }
    });
    const { results, resultLines } = generateResultsAndResultLines(nodes);

    nodes = nodes.map(({ id, type, name, locationX, locationY, status, }) => {
        const node = {
            id,
            name,
            x: locationX,
            y: locationY,
            inNum: modulesKV[type].inputNum,
            outNum: modulesKV[type].outputNum,
            in: [],
            out: [],
            status,
            type,
        };
        edges.map( ({id: lineID, startNodeId, startNodeIndex, endNodeId, endNodeIndex}) => {
            if(startNodeId === id) {
                // 如果是线的起始点
                if(!node.out[startNodeIndex]) node.out[startNodeIndex] = [];
                node.out[startNodeIndex].push({ id: lineID, type: 'line'});
            }else if(endNodeId === id) {
                // 如果是线的终点
                if(!node.in[endNodeIndex]) node.in[endNodeIndex] = [];
                node.in[endNodeIndex].push({ id: lineID, type: 'line'});
            }
        });
        resultLines.map( ({id: lineID, startNodeId, startNodeIndex }) => {
            if(startNodeId === id) {
                // 如果是结果线的起始点
                if(!node.out[startNodeIndex]) node.out[startNodeIndex] = [];
                node.out[startNodeIndex].push({ id: lineID, type: 'result'});
            }
        });
        return node;
    });
    return { modules: nodes, lines: edges, resultLines, results}
}

export function generateLinePosition( directionType, { x, y, type, index}) {
    if(directionType === 'start') {
        x = x + width;
        y = y + (1+ index) * height/(modulesKV[type].outputNum + 1)
        return [x, y]
    }else{
        y = y + (1+ index) * height/(modulesKV[type].inputNum + 1)
        return [x, y]
    }
}

export function generateResultsAndResultLines(nodes) {
    // 含有结果点的线
    const rawData = nodes.filter(({endIndex}) => endIndex.length);
    const resultLines = [];
    let maxResultIndex = 0;
    for(const {id, endIndex, locationX: x, locationY: y, type} of rawData) {
        // {
        //     "nodeIndex": 0,
        //     "resultIndex": 0
        // }
        for(const { nodeIndex, resultIndex } of endIndex) {
            resultLines.push({
                id: getRandomID(),
                start: generateLinePosition('start', {x, y, type, index: nodeIndex}),
                end: [1780, (resultIndex + 1) * 50 ],
                startNodeId: id,
                startNodeIndex: nodeIndex,
                endNodeId: 'result',
                endNodeIndex: resultIndex,
            });
            if(resultIndex > maxResultIndex) maxResultIndex = resultIndex;
        }
    }
    return { resultLines, results: maxResultIndex }
}

export function generateModules(nodes) {

}


export function generatePoints({start, end}) {
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