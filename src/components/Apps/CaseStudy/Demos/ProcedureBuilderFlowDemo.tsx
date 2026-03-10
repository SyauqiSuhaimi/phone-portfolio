import { useEffect, useMemo, useRef, useState } from "react";

type NodeKind = "data-entry" | "approval" | "notify";

type FlowNode = {
  id: NodeKind;
  label: string;
  x: number;
  y: number;
};

type FlowEdge = {
  id: string;
  source: NodeKind;
  target: NodeKind;
};

type DragState = {
  id: NodeKind;
  offsetX: number;
  offsetY: number;
};

const NODE_WIDTH = 120;
const NODE_HEIGHT = 56;
const CANVAS_PADDING = 12;

const CLASSES_BY_KIND: Record<NodeKind, string> = {
  "data-entry":
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  approval:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
  notify:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
};

const makeInitialNodes = (width: number, height: number): FlowNode[] => {
  const maxX = Math.max(CANVAS_PADDING, width - NODE_WIDTH - CANVAS_PADDING);
  const maxY = Math.max(CANVAS_PADDING, height - NODE_HEIGHT - CANVAS_PADDING);
  const canFitSingleRow = width >= NODE_WIDTH * 3 + CANVAS_PADDING * 4;

  if (canFitSingleRow) {
    const y = clamp((height - NODE_HEIGHT) / 2, CANVAS_PADDING, maxY);
    return [
      { id: "data-entry", label: "Data Entry", x: CANVAS_PADDING, y },
      {
        id: "approval",
        label: "Approval",
        x: clamp((width - NODE_WIDTH) / 2, CANVAS_PADDING, maxX),
        y,
      },
      { id: "notify", label: "Notify", x: maxX, y },
    ];
  }

  const centerX = clamp((width - NODE_WIDTH) / 2, CANVAS_PADDING, maxX);
  const gap = Math.max(10, (height - NODE_HEIGHT * 3 - CANVAS_PADDING * 2) / 2);
  const y1 = CANVAS_PADDING;
  const y2 = clamp(y1 + NODE_HEIGHT + gap, CANVAS_PADDING, maxY);
  const y3 = clamp(y2 + NODE_HEIGHT + gap, CANVAS_PADDING, maxY);

  return [
    { id: "data-entry", label: "Data Entry", x: centerX, y: y1 },
    { id: "approval", label: "Approval", x: centerX, y: y2 },
    { id: "notify", label: "Notify", x: centerX, y: y3 },
  ];
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const describeValidation = (nodes: FlowNode[], edges: FlowEdge[]) => {
  const incoming = new Map<NodeKind, number>();
  const outgoing = new Map<NodeKind, number>();
  const adjacency = new Map<NodeKind, NodeKind[]>();

  nodes.forEach((node) => {
    incoming.set(node.id, 0);
    outgoing.set(node.id, 0);
    adjacency.set(node.id, []);
  });

  edges.forEach((edge) => {
    incoming.set(edge.target, (incoming.get(edge.target) ?? 0) + 1);
    outgoing.set(edge.source, (outgoing.get(edge.source) ?? 0) + 1);
    adjacency.set(edge.source, [
      ...(adjacency.get(edge.source) ?? []),
      edge.target,
    ]);
  });

  if ((incoming.get("data-entry") ?? 0) !== 0) {
    return "Data Entry cannot have incoming connections.";
  }
  if ((outgoing.get("notify") ?? 0) !== 0) {
    return "Notify cannot have outgoing connections.";
  }
  if ((outgoing.get("data-entry") ?? 0) !== 1) {
    return "Data Entry must have one outgoing connection.";
  }
  if (
    (incoming.get("approval") ?? 0) !== 1 ||
    (outgoing.get("approval") ?? 0) !== 1
  ) {
    return "Approval must have one incoming and one outgoing connection.";
  }
  if ((incoming.get("notify") ?? 0) !== 1) {
    return "Notify must have one incoming connection.";
  }

  const visited = new Set<NodeKind>();
  const queue: NodeKind[] = ["data-entry"];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);
    (adjacency.get(current) ?? []).forEach((next) => {
      if (!visited.has(next)) queue.push(next);
    });
  }

  if (visited.size !== nodes.length) {
    return "Disconnected node detected. Connect all nodes before saving.";
  }

  return "";
};

export const ProcedureBuilderFlowDemo = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<FlowNode[]>([
    { id: "data-entry", label: "Data Entry", x: 20, y: 84 },
    { id: "approval", label: "Approval", x: 170, y: 84 },
    { id: "notify", label: "Notify", x: 320, y: 84 },
  ]);
  const [edges, setEdges] = useState<FlowEdge[]>([
    { id: "data-entry->approval", source: "data-entry", target: "approval" },
    { id: "approval->notify", source: "approval", target: "notify" },
  ]);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [pendingSource, setPendingSource] = useState<NodeKind | null>(null);
  const [message, setMessage] = useState("Flow is connected and valid.");

  const nodeMap = useMemo(() => {
    const map = new Map<NodeKind, FlowNode>();
    nodes.forEach((node) => map.set(node.id, node));
    return map;
  }, [nodes]);

  useEffect(() => {
    const element = canvasRef.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = entry?.contentRect.width ?? 0;
      const height = entry?.contentRect.height ?? 0;
      setCanvasSize({ width, height });
      setNodes((prev) => {
        if (width <= 0 || height <= 0) return prev;
        const maxX = Math.max(
          CANVAS_PADDING,
          width - NODE_WIDTH - CANVAS_PADDING,
        );
        const maxY = Math.max(
          CANVAS_PADDING,
          height - NODE_HEIGHT - CANVAS_PADDING,
        );

        if (prev.length === 0) {
          return makeInitialNodes(width, height);
        }

        return prev.map((node) => ({
          ...node,
          x: clamp(node.x, CANVAS_PADDING, maxX),
          y: clamp(node.y, CANVAS_PADDING, maxY),
        }));
      });
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!dragState) return;

    const handleMove = (event: PointerEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const maxX = Math.max(
        CANVAS_PADDING,
        canvasSize.width - NODE_WIDTH - CANVAS_PADDING,
      );
      const maxY = Math.max(
        CANVAS_PADDING,
        canvasSize.height - NODE_HEIGHT - CANVAS_PADDING,
      );
      const nextX = clamp(
        event.clientX - rect.left - dragState.offsetX,
        CANVAS_PADDING,
        maxX,
      );
      const nextY = clamp(
        event.clientY - rect.top - dragState.offsetY,
        CANVAS_PADDING,
        maxY,
      );

      setNodes((prev) =>
        prev.map((node) =>
          node.id === dragState.id ? { ...node, x: nextX, y: nextY } : node,
        ),
      );
    };

    const handleUp = () => {
      setDragState(null);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [canvasSize.height, canvasSize.width, dragState]);

  const hasPath = (
    start: NodeKind,
    goal: NodeKind,
    currentEdges: FlowEdge[],
  ) => {
    const adjacency = new Map<NodeKind, NodeKind[]>();
    nodes.forEach((node) => adjacency.set(node.id, []));
    currentEdges.forEach((edge) => {
      adjacency.set(edge.source, [
        ...(adjacency.get(edge.source) ?? []),
        edge.target,
      ]);
    });

    const visited = new Set<NodeKind>();
    const queue: NodeKind[] = [start];
    while (queue.length > 0) {
      const current = queue.shift();
      if (!current || visited.has(current)) continue;
      if (current === goal) return true;
      visited.add(current);
      (adjacency.get(current) ?? []).forEach((next) => {
        if (!visited.has(next)) queue.push(next);
      });
    }
    return false;
  };

  const validateAndSetMessage = (nextEdges: FlowEdge[]) => {
    const validationMessage = describeValidation(nodes, nextEdges);
    setMessage(validationMessage || "Flow is connected and valid.");
    return !validationMessage;
  };

  const connectNodes = (target: NodeKind) => {
    if (!pendingSource) {
      setMessage("Pick an output handle first.");
      return;
    }

    if (pendingSource === target) {
      setPendingSource(null);
      setMessage("A node cannot connect to itself.");
      return;
    }

    if (edges.some((edge) => edge.source === pendingSource)) {
      setPendingSource(null);
      setMessage(
        "Only one outgoing connection per node. Remove the existing edge first.",
      );
      return;
    }

    if (edges.some((edge) => edge.target === target)) {
      setPendingSource(null);
      setMessage("Only one incoming connection per node.");
      return;
    }

    const candidate: FlowEdge = {
      id: `${pendingSource}->${target}`,
      source: pendingSource,
      target,
    };

    const nextEdges = [...edges, candidate];
    if (hasPath(target, pendingSource, nextEdges)) {
      setPendingSource(null);
      setMessage("Connection rejected: loops are not allowed.");
      return;
    }

    setPendingSource(null);
    setEdges(nextEdges);
    validateAndSetMessage(nextEdges);
  };

  const removeEdge = (edgeId: string) => {
    const nextEdges = edges.filter((edge) => edge.id !== edgeId);
    setEdges(nextEdges);
    validateAndSetMessage(nextEdges);
  };

  const handleStartConnection = (source: NodeKind) => {
    setPendingSource(source);
    setMessage(
      `Connecting from ${nodeMap.get(source)?.label}. Select an input handle.`,
    );
  };

  const resetLayout = () => {
    setPendingSource(null);
    setEdges([
      { id: "data-entry->approval", source: "data-entry", target: "approval" },
      { id: "approval->notify", source: "approval", target: "notify" },
    ]);
    setNodes(makeInitialNodes(canvasSize.width, canvasSize.height));
    setMessage("Flow reset to default: Data Entry -> Approval -> Notify.");
  };

  return (
    <div className="w-full h-full p-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full h-full rounded-2xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="h-11 px-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between gap-2">
          <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
            Drag nodes and connect output handle to input handle.
          </p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={resetLayout}
              className="text-[11px] px-2 py-1 rounded border border-black/20 dark:border-white/20"
            >
              Reset
            </button>
          </div>
        </div>

        <div
          ref={canvasRef}
          className="relative h-[calc(100%-2.75rem)] overflow-hidden"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(100,116,139,0.25) 1px, transparent 0)",
            backgroundSize: "18px 18px",
          }}
        >
          <svg className="absolute inset-0 w-full h-full">
            <defs>
              <marker
                id="procedure-flow-arrow"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path
                  d="M0,0 L8,4 L0,8 z"
                  className="fill-zinc-400 dark:fill-zinc-500"
                />
              </marker>
            </defs>

            {edges.map((edge) => {
              const source = nodeMap.get(edge.source);
              const target = nodeMap.get(edge.target);
              if (!source || !target) return null;

              const sx = source.x + NODE_WIDTH;
              const sy = source.y + NODE_HEIGHT / 2;
              const tx = target.x;
              const ty = target.y + NODE_HEIGHT / 2;
              const curve = Math.max(48, Math.abs(tx - sx) * 0.35);
              const path = `M ${sx} ${sy} C ${sx + curve} ${sy}, ${tx - curve} ${ty}, ${tx} ${ty}`;

              return (
                <g key={edge.id}>
                  <path
                    d={path}
                    className="stroke-zinc-300 dark:stroke-zinc-600"
                    strokeWidth={2}
                    fill="none"
                    markerEnd="url(#procedure-flow-arrow)"
                  />
                  <path
                    d={path}
                    stroke="transparent"
                    strokeWidth={14}
                    fill="none"
                    className="cursor-pointer"
                    onClick={() => removeEdge(edge.id)}
                  />
                </g>
              );
            })}
          </svg>

          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute px-3 py-2 rounded-lg border text-xs font-semibold shadow-md select-none ${
                CLASSES_BY_KIND[node.id]
              } ${pendingSource === node.id ? "ring-2 ring-blue-500/60" : ""}`}
              style={{
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                left: node.x,
                top: node.y,
                touchAction: "none",
              }}
              onPointerDown={(event) => {
                if (event.button !== 0) return;
                const bounds = event.currentTarget.getBoundingClientRect();
                setDragState({
                  id: node.id,
                  offsetX: event.clientX - bounds.left,
                  offsetY: event.clientY - bounds.top,
                });
              }}
            >
              <button
                type="button"
                aria-label={`Connect into ${node.label}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  connectNodes(node.id);
                }}
                className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-zinc-500 bg-white dark:bg-zinc-800"
              />
              <button
                type="button"
                aria-label={`Connect from ${node.label}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  handleStartConnection(node.id);
                }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-zinc-500 bg-white dark:bg-zinc-800"
              />

              <div className="h-full w-full flex items-center justify-center text-center leading-4">
                {node.label}
              </div>
            </div>
          ))}

          <div className="absolute inset-x-2 bottom-2 text-[11px] px-2 py-1.5 rounded-md border border-black/10 dark:border-white/10 bg-white/90 dark:bg-zinc-900/90">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
