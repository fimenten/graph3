import { Vector2D } from './types';
import { COLORS } from './constants';

export class Node {
    position: Vector2D;
    size: Vector2D;
    title: string;
    inputs: string[];
    outputs: string[];

    constructor(position: Vector2D, title: string, inputs: string[] = [], outputs: string[] = []) {
        this.position = position;
        this.size = { x: 200, y: Math.max(120, (Math.max(inputs.length, outputs.length) * 25) + 50) };
        this.title = title;
        this.inputs = inputs;
        this.outputs = outputs;
    }

    isPointInside(point: Vector2D): boolean {
        return point.x >= this.position.x && point.x <= this.position.x + this.size.x &&
               point.y >= this.position.y && point.y <= this.position.y + this.size.y;
    }

    getSocketPosition(isInput: boolean, index: number): Vector2D {
        const x = isInput ? this.position.x : this.position.x + this.size.x;
        const y = this.position.y + 40 + index * 25;
        return { x, y };
    }

    isPointOnSocket(point: Vector2D, isInput: boolean): number {
        const sockets = isInput ? this.inputs : this.outputs;
        for (let i = 0; i < sockets.length; i++) {
            const socketPos = this.getSocketPosition(isInput, i);
            if (Math.hypot(point.x - socketPos.x, point.y - socketPos.y) <= 5) {
                return i;
            }
        }
        return -1;
    }

    draw(ctx: CanvasRenderingContext2D) {
        // Node body
        ctx.fillStyle = COLORS.nodeBg;
        ctx.strokeStyle = COLORS.nodeBorder;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(this.position.x, this.position.y, this.size.x, this.size.y, 10);
        ctx.fill();
        ctx.stroke();

        // Node title
        ctx.fillStyle = COLORS.nodeTitle;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.title, this.position.x + this.size.x / 2, this.position.y + 25);

        // Draw sockets and labels
        this.drawSockets(ctx, true);
        this.drawSockets(ctx, false);
    }

    private drawSockets(ctx: CanvasRenderingContext2D, isInput: boolean) {
        const sockets = isInput ? this.inputs : this.outputs;
        sockets.forEach((socket, index) => {
            const { x, y } = this.getSocketPosition(isInput, index);
            
            // Socket
            ctx.fillStyle = COLORS.socket;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.fillStyle = COLORS.socketLabel;
            ctx.font = '12px Arial';
            ctx.textAlign = isInput ? 'left' : 'right';
            ctx.fillText(socket, x + (isInput ? 10 : -10), y + 4);
        });
    }
}