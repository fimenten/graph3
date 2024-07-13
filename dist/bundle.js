/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Node.ts":
/*!*********************!*\
  !*** ./src/Node.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   Node: () => (/* binding */ Node)\n/* harmony export */ });\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./constants */ \"./src/constants.ts\");\n\nvar Node = /** @class */ (function () {\n    function Node(position, title, inputs, outputs) {\n        if (inputs === void 0) { inputs = []; }\n        if (outputs === void 0) { outputs = []; }\n        this.position = position;\n        this.size = { x: 200, y: Math.max(120, (Math.max(inputs.length, outputs.length) * 25) + 50) };\n        this.title = title;\n        this.inputs = inputs;\n        this.outputs = outputs;\n    }\n    Node.prototype.isPointInside = function (point) {\n        return point.x >= this.position.x && point.x <= this.position.x + this.size.x &&\n            point.y >= this.position.y && point.y <= this.position.y + this.size.y;\n    };\n    Node.prototype.getSocketPosition = function (isInput, index) {\n        var x = isInput ? this.position.x : this.position.x + this.size.x;\n        var y = this.position.y + 40 + index * 25;\n        return { x: x, y: y };\n    };\n    Node.prototype.isPointOnSocket = function (point, isInput) {\n        var sockets = isInput ? this.inputs : this.outputs;\n        for (var i = 0; i < sockets.length; i++) {\n            var socketPos = this.getSocketPosition(isInput, i);\n            if (Math.hypot(point.x - socketPos.x, point.y - socketPos.y) <= 5) {\n                return i;\n            }\n        }\n        return -1;\n    };\n    Node.prototype.draw = function (ctx) {\n        // Node body\n        ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.COLORS.nodeBg;\n        ctx.strokeStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.COLORS.nodeBorder;\n        ctx.lineWidth = 2;\n        ctx.beginPath();\n        ctx.roundRect(this.position.x, this.position.y, this.size.x, this.size.y, 10);\n        ctx.fill();\n        ctx.stroke();\n        // Node title\n        ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.COLORS.nodeTitle;\n        ctx.font = 'bold 16px Arial';\n        ctx.textAlign = 'center';\n        ctx.fillText(this.title, this.position.x + this.size.x / 2, this.position.y + 25);\n        // Draw sockets and labels\n        this.drawSockets(ctx, true);\n        this.drawSockets(ctx, false);\n    };\n    Node.prototype.drawSockets = function (ctx, isInput) {\n        var _this = this;\n        var sockets = isInput ? this.inputs : this.outputs;\n        sockets.forEach(function (socket, index) {\n            var _a = _this.getSocketPosition(isInput, index), x = _a.x, y = _a.y;\n            // Socket\n            ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.COLORS.socket;\n            ctx.beginPath();\n            ctx.arc(x, y, 5, 0, Math.PI * 2);\n            ctx.fill();\n            // Label\n            ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_0__.COLORS.socketLabel;\n            ctx.font = '12px Arial';\n            ctx.textAlign = isInput ? 'left' : 'right';\n            ctx.fillText(socket, x + (isInput ? 10 : -10), y + 4);\n        });\n    };\n    return Node;\n}());\n\n\n\n//# sourceURL=webpack://graph3/./src/Node.ts?");

/***/ }),

/***/ "./src/NodeGraph.ts":
/*!**************************!*\
  !*** ./src/NodeGraph.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   NodeGraph: () => (/* binding */ NodeGraph)\n/* harmony export */ });\n/* harmony import */ var _Node__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Node */ \"./src/Node.ts\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants */ \"./src/constants.ts\");\n\n\nvar NodeGraph = /** @class */ (function () {\n    function NodeGraph(canvas) {\n        this.nodes = [];\n        this.connections = [];\n        this.draggingNode = null;\n        this.connectingNode = null;\n        this.canvas = canvas;\n        this.ctx = canvas.getContext('2d');\n        this.setupEventListeners();\n    }\n    NodeGraph.prototype.initialize = function () {\n        this.createNode({ x: 100, y: 100 }, 'Input', [], ['Output']);\n        this.createNode({ x: 400, y: 200 }, 'Process', ['Input 1', 'Input 2'], ['Output 1', 'Output 2']);\n        this.createNode({ x: 700, y: 300 }, 'Output', ['Input'], []);\n        this.draw();\n    };\n    NodeGraph.prototype.createNode = function (position, title, inputs, outputs) {\n        var node = new _Node__WEBPACK_IMPORTED_MODULE_0__.Node(position, title, inputs, outputs);\n        this.nodes.push(node);\n    };\n    NodeGraph.prototype.setupEventListeners = function () {\n        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));\n        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));\n        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));\n    };\n    NodeGraph.prototype.getMousePosition = function (event) {\n        var rect = this.canvas.getBoundingClientRect();\n        return {\n            x: event.clientX - rect.left,\n            y: event.clientY - rect.top\n        };\n    };\n    NodeGraph.prototype.handleMouseDown = function (event) {\n        var mousePos = this.getMousePosition(event);\n        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {\n            var node = _a[_i];\n            var outputIndex = node.isPointOnSocket(mousePos, false);\n            if (outputIndex !== -1) {\n                this.connectingNode = { node: node, outputIndex: outputIndex };\n                return;\n            }\n            if (node.isPointInside(mousePos)) {\n                this.draggingNode = node;\n                return;\n            }\n        }\n        this.createNode(mousePos, 'New Node', ['Input'], ['Output']);\n        this.draw();\n    };\n    NodeGraph.prototype.handleMouseMove = function (event) {\n        var mousePos = this.getMousePosition(event);\n        if (this.draggingNode) {\n            this.draggingNode.position = {\n                x: mousePos.x - this.draggingNode.size.x / 2,\n                y: mousePos.y - this.draggingNode.size.y / 2\n            };\n            this.draw();\n        }\n        else if (this.connectingNode) {\n            this.draw();\n            var startPos = this.connectingNode.node.getSocketPosition(false, this.connectingNode.outputIndex);\n            this.drawConnection(startPos, mousePos);\n        }\n    };\n    NodeGraph.prototype.handleMouseUp = function (event) {\n        var mousePos = this.getMousePosition(event);\n        if (this.connectingNode) {\n            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {\n                var node = _a[_i];\n                var inputIndex = node.isPointOnSocket(mousePos, true);\n                if (inputIndex !== -1 && node !== this.connectingNode.node) {\n                    this.connections.push({\n                        from: this.connectingNode.node,\n                        fromOutput: this.connectingNode.outputIndex,\n                        to: node,\n                        toInput: inputIndex\n                    });\n                    break;\n                }\n            }\n        }\n        this.draggingNode = null;\n        this.connectingNode = null;\n        this.draw();\n    };\n    NodeGraph.prototype.draw = function () {\n        this.ctx.fillStyle = _constants__WEBPACK_IMPORTED_MODULE_1__.COLORS.background;\n        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);\n        this.drawConnections();\n        this.drawNodes();\n    };\n    NodeGraph.prototype.drawConnections = function () {\n        for (var _i = 0, _a = this.connections; _i < _a.length; _i++) {\n            var connection = _a[_i];\n            var startPos = connection.from.getSocketPosition(false, connection.fromOutput);\n            var endPos = connection.to.getSocketPosition(true, connection.toInput);\n            this.drawConnection(startPos, endPos);\n        }\n    };\n    NodeGraph.prototype.drawConnection = function (start, end) {\n        this.ctx.beginPath();\n        this.ctx.moveTo(start.x, start.y);\n        var midX = (start.x + end.x) / 2;\n        this.ctx.bezierCurveTo(midX, start.y, midX, end.y, end.x, end.y);\n        this.ctx.strokeStyle = _constants__WEBPACK_IMPORTED_MODULE_1__.COLORS.connection;\n        this.ctx.lineWidth = 3;\n        this.ctx.stroke();\n    };\n    NodeGraph.prototype.drawNodes = function () {\n        for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {\n            var node = _a[_i];\n            node.draw(this.ctx);\n        }\n    };\n    return NodeGraph;\n}());\n\n\n\n//# sourceURL=webpack://graph3/./src/NodeGraph.ts?");

/***/ }),

/***/ "./src/constants.ts":
/*!**************************!*\
  !*** ./src/constants.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   COLORS: () => (/* binding */ COLORS)\n/* harmony export */ });\nvar COLORS = {\n    background: '#2c2c2c',\n    nodeBg: '#3c3c3c',\n    nodeBorder: '#555555',\n    nodeTitle: '#ffffff',\n    socket: '#55cc66',\n    socketLabel: '#cccccc',\n    connection: '#55cc66'\n};\n\n\n//# sourceURL=webpack://graph3/./src/constants.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _NodeGraph__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NodeGraph */ \"./src/NodeGraph.ts\");\n\nwindow.addEventListener('load', function () {\n    var canvas = document.getElementById('graphCanvas');\n    canvas.width = window.innerWidth;\n    canvas.height = window.innerHeight;\n    var nodeGraph = new _NodeGraph__WEBPACK_IMPORTED_MODULE_0__.NodeGraph(canvas);\n    nodeGraph.initialize();\n    window.addEventListener('resize', function () {\n        canvas.width = window.innerWidth;\n        canvas.height = window.innerHeight;\n        nodeGraph.draw();\n    });\n});\n\n\n//# sourceURL=webpack://graph3/./src/index.ts?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;