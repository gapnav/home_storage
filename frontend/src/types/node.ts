export type NodeType = "storage" | "thing";

export interface Node {
  id: number;
  nodeType: NodeType;
  title: string;
  description: string | null;
  code: string | null;
  parentId: number | null;
}

export interface BreadcrumbItem {
  id: number;
  title: string;
}

export interface NodeDetail extends Node {
  path: BreadcrumbItem[];
  children: Node[];
}

export type FlatNode = Pick<Node, "id" | "title" | "parentId" | "nodeType"> & { depth: number };
