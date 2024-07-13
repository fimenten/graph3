import { NodeGraph } from './NodeGraph';

window.addEventListener('load', () => {
    const canvas = document.getElementById('graphCanvas') as HTMLCanvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const nodeGraph = new NodeGraph(canvas);
    nodeGraph.initialize();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        nodeGraph.draw();
    });
});