'use client';

import { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    BackgroundVariant,
    Handle,
    Position,
    type Node,
    type Edge,
    type OnConnect,
    type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { FileText, CheckCircle, Bell } from 'lucide-react';

// Custom Node Component
const CustomNode = ({ data }: NodeProps) => {
    return (
        <div 
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md text-white text-[10px] font-semibold shadow-sm"
            style={{ background: data.color }}
        >
            <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-gray-400" />
            {data.icon}
            <span>{data.label}</span>
            <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-gray-400" />
        </div>
    );
};

const nodeTypes = {
    custom: CustomNode,
};

const initialNodes: Node[] = [
    {
        id: 'document',
        type: 'custom',
        data: { 
            label: 'Document', 
            icon: <FileText size={12} />,
            color: '#3b82f6',
        },
        position: { x: 40, y: 20 },
    },
    {
        id: 'approval',
        type: 'custom',
        data: { 
            label: 'Approval', 
            icon: <CheckCircle size={12} />,
            color: '#f59e0b',
        },
        position: { x: 140, y: 70 },
    },
    {
        id: 'notification',
        type: 'custom',
        data: { 
            label: 'Notify', 
            icon: <Bell size={12} />,
            color: '#22c55e',
        },
        position: { x: 260, y: 120 },
    },
];

const initialEdges: Edge[] = [
    { 
        id: 'e1', 
        source: 'document', 
        target: 'approval',
        animated: true,
    },
    { 
        id: 'e2', 
        source: 'approval', 
        target: 'notification',
        label: 'Yes',
        labelStyle: { fontSize: 9, fontWeight: 600, fill: '#166534' },
        labelBgStyle: { fill: '#dcfce7' },
        style: { stroke: '#22c55e' },
    },
    { 
        id: 'e3', 
        source: 'approval', 
        target: 'document',
        sourceHandle: null,
        targetHandle: null,
        label: 'No',
        labelStyle: { fontSize: 9, fontWeight: 600, fill: '#dc2626' },
        labelBgStyle: { fill: '#fee2e2' },
        style: { stroke: '#dc2626', strokeWidth: 2 },
        type: 'smoothstep',
    },
];

export const FlowchartBuilderDemo = () => {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                proOptions={{ hideAttribution: true }}
                style={{ background: '#ffffff' }}
            >
                <Background 
                    variant={BackgroundVariant.Dots} 
                    gap={16} 
                    size={1} 
                    color="#d1d5db"
                />
            </ReactFlow>
        </div>
    );
};
