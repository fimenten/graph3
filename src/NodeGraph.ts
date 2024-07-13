import { Node } from './Node';
import { Vector2D } from './types';
import { COLORS } from './constants';

interface Connection {
    from: Node;
    fromOutput: number;
    to: Node;
    toInput: number;
}

export class NodeGraph {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private nodes: Node[] = [];
    private connections: Connection[] = [];
    private draggingNode: Node | null = null;
    private connectingNode: { node: Node; outputIndex: number } | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.setupEventListeners();
    }

    initialize() {
        this.createNode({ x: 100, y: 100 }, 'Input', [], ['Output']);
        this.createNode({ x: 400, y: 200 }, 'Process', ['Input 1', 'Input 2'], ['Output 1', 'Output 2']);
        this.createNode({ x: 700, y: 300 }, 'Output', ['Input'], []);
        this.draw();
    }

    private createNode(position: Vector2D, title: string, inputs: string[], outputs: string[]) {
        const node = new Node(position, title, inputs, outputs);
        this.nodes.push(node);
    }

    private setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    }

    private getMousePosition(event: MouseEvent): Vector2D {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    private handleMouseDown(event: MouseEvent) {
        const mousePos = this.getMousePosition(event);

        for (const node of this.nodes) {
            const outputIndex = node.isPointOnSocket(mousePos, false);
            if (outputIndex !== -1) {
                this.connectingNode = { node, outputIndex };
                return;
            }

            if (node.isPointInside(mousePos)) {
                this.draggingNode = node;
                return;
            }
        }

        this.createNode(mousePos, 'New Node', ['Input'], ['Output']);
        this.draw();
    }

    private handleMouseMove(event: MouseEvent) {
        const mousePos = this.getMousePosition(event);

        if (this.draggingNode) {
            this.draggingNode.position = {
                x: mousePos.x - this.draggingNode.size.x / 2,
                y: mousePos.y - this.draggingNode.size.y / 2
            };
            this.draw();
        } else if (this.connectingNode) {
            this.draw();
            const startPos = this.connectingNode.node.getSocketPosition(false, this.connectingNode.outputIndex);
            this.drawConnection(startPos, mousePos);
        }
    }

    private handleMouseUp(event: MouseEvent) {
        const mousePos = this.getMousePosition(event);

        if (this.connectingNode) {
            for (const node of this.nodes) {
                const inputIndex = node.isPointOnSocket(mousePos, true);
                if (inputIndex !== -1 && node !== this.connectingNode.node) {
                    this.connections.push({
                        from: this.connectingNode.node,
                        fromOutput: this.connectingNode.outputIndex,
                        to: node,
                        toInput: inputIndex
                    });
                    break;
                }
            }
        }

        this.draggingNode = null;
        this.connectingNode = null;
        this.draw();
    }

    draw() {
        this.ctx.fillStyle = COLORS.background;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.drawConnections();
        this.drawNodes();
    }

    private drawConnections() {
        for (const connection of this.connections) {
            const startPos = connection.from.getSocketPosition(false, connection.fromOutput);
            const endPos = connection.to.getSocketPosition(true, connection.toInput);
            this.drawConnection(startPos, endPos);
        }
    }

    private drawConnection(start: Vector2D, end: Vector2D) {
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        
        const midX = (start.x + end.x) / 2;
        this.ctx.bezierCurveTo(midX, start.y, midX, end.y, end.x, end.y);
        
        this.ctx.strokeStyle = COLORS.connection;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
    }

    private drawNodes() {
        for (const node of this.nodes) {
            node.draw(this.ctx);
        }
    }
}