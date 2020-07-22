import TChart from './index';
import {
    transformData
} from './tool';


const data = {
    "nodes": [
        {
            "id": 2103,
            "type": 12,
            "name": null,
            "status": 2,
            "x": 370.0,
            "y": 129.4667,
        },
        {
            "id": 2105,
            "type": 61,
            "name": null,
            "status": 2,
            "x": 648.0,
            "y": 99.4667,
        },
        {
            "id": 2118,
            "type": 41,
            "name": null,
            "status": -1,
            "x": 18.95,
            "y": -610.35,
        },
        {
            "id": 2119,
            "type": 45,
            "name": null,
            "status": 2,
            "x": 851.0,
            "y": 221.4667,
        },
        {
            "id": 2120,
            "type": 31,
            "name": null,
            "status": 2,
            "x": 552.0,
            "y": 266.4667,
        },
        {
            "id": 2122,
            "type": 33,
            "name": null,
            "status": 2,
            "x": 843.0,
            "y": 70.4667,
        },
        {
            "id": 2123,
            "type": 33,
            "name": null,
            "status": 2,
            "x": 1037.0,
            "y": 122.0,
        },
        {
            "id": 2155,
            "type": 46,
            "name": null,
            "status": 2,
            "x": 791.0,
            "y": 629.0,
        },
        {
            "id": 2162,
            "type": 48,
            "name": null,
            "status": 2,
            "x": 829.0,
            "y": 787.0,
        },
        {
            "id": 2215,
            "type": 401,
            "name": null,
            "status": 2,
            "x": 1043.0,
            "y": 616.0,
        },
        {
            "id": 2216,
            "type": 44,
            "name": null,
            "status": 2,
            "x": 1264.0,
            "y": 499.0,
        },
        {
            "id": 2223,
            "type": 41,
            "name": null,
            "status": -1,
            "x": -45.0417,
            "y": -403.7084,
        },
        {
            "id": 2225,
            "type": 41,
            "name": null,
            "status": -1,
            "x": 541.0,
            "y": 506.0,
        },
        {
            "id": 2274,
            "type": 43,
            "name": null,
            "status": 2,
            "x": 601.0,
            "y": 723.0,
        },
        {
            "id": 2563,
            "type": 73,
            "name": null,
            "status": 2,
            "x": 1363.0,
            "y": 214.4667,
        },
        {
            "id": 4360,
            "type": 11,
            "name": null,
            "status": -1,
            "x": 318.0,
            "y": 276.4667,
        },
        {
            "id": 4362,
            "type": 12,
            "name": null,
            "status": -1,
            "x": 346.0,
            "y": 372.4667,
        },
        {
            "id": 4449,
            "type": 51,
            "name": null,
            "status": 2,
            "x": 1015.0,
            "y": 324.0,
        }
    ],
    "edges": [
        // 结果线 endNodeId  = -1
        {
            "id": 2222,
            "startNodeId": 4449,
            "endNodeId": -1,
            "startNodeIndex": 0,
            "endNodeIndex": 0
        },
        {
            "id": 2223,
            "startNodeId": 4449,
            "endNodeId": -1,
            "startNodeIndex": 1,
            "endNodeIndex": 2
        },
        {
            "id": 2116,
            "startNodeId": 2103,
            "endNodeId": 2105,
            "startNodeIndex": 0,
            "endNodeIndex": 0
        },
        {
            "id": 2129,
            "startNodeId": 2103,
            "endNodeId": 2120,
            "startNodeIndex": 0,
            "endNodeIndex": 0
        },
        {
            "id": 2131,
            "startNodeId": 2120,
            "endNodeId": 2119,
            "startNodeIndex": 1,
            "endNodeIndex": 1
        },
        {
            "id": 2133,
            "startNodeId": 2120,
            "endNodeId": 2122,
            "startNodeIndex": 1,
            "endNodeIndex": 0
        },
        {
            "id": 2135,
            "startNodeId": 2119,
            "endNodeId": 2123,
            "startNodeIndex": 1,
            "endNodeIndex": 0
        },
        {
            "id": 2198,
            "startNodeId": 2120,
            "endNodeId": 2215,
            "startNodeIndex": 1,
            "endNodeIndex": 1
        },
        {
            "id": 2207,
            "startNodeId": 2120,
            "endNodeId": 2225,
            "startNodeIndex": 0,
            "endNodeIndex": 0
        },
        {
            "id": 2275,
            "startNodeId": 2120,
            "endNodeId": 2274,
            "startNodeIndex": 1,
            "endNodeIndex": 1
        },
        {
            "id": 2589,
            "startNodeId": 2120,
            "endNodeId": 2162,
            "startNodeIndex": 1,
            "endNodeIndex": 1
        },
        {
            "id": 2590,
            "startNodeId": 2120,
            "endNodeId": 2216,
            "startNodeIndex": 1,
            "endNodeIndex": 1
        },
        {
            "id": 2594,
            "startNodeId": 2120,
            "endNodeId": 2155,
            "startNodeIndex": 1,
            "endNodeIndex": 1
        },
        {
            "id": 2676,
            "startNodeId": 2123,
            "endNodeId": 2563,
            "startNodeIndex": 0,
            "endNodeIndex": 0
        },
        {
            "id": 2677,
            "startNodeId": 2122,
            "endNodeId": 2563,
            "startNodeIndex": 0,
            "endNodeIndex": 1
        },
        {
            "id": 4266,
            "startNodeId": 2120,
            "endNodeId": 4449,
            "startNodeIndex": 0,
            "endNodeIndex": 0
        }
    ],
}

new TChart('#app', {
    data,
    options: {}
});
