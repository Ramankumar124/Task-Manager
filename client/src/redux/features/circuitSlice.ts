import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define interfaces for circuit data
interface Node {
  id: string;
  type: string;
  data: Record<string, any>;
  position: { x: number; y: number };
}

interface Edge {
  id: string;
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
  type: string;
  label?: string;
}

interface CircuitState {
  projectId: string | null;
  prompt: string | null;
  node: Node | null;
  edge: Edge | null;
  circuitName: string | null;
  explanation: string | null;
  suggestions: string[] | null;
}

// Load data from sessionStorage
const loadState = <T>(key: string, defaultValue: T): T => {
  const savedValue = sessionStorage.getItem(key);
  return savedValue ? JSON.parse(savedValue) : defaultValue;
};

// Save data to sessionStorage
const saveState = (key: string, value: any) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

// Initial state with data loaded from sessionStorage
const initialState: CircuitState = {
  projectId: loadState<string | null>("projectId", null),
  node: loadState<Node | null>("nodes", null),
  edge: loadState<Edge | null>("edges", null),
  circuitName: loadState<string | null>("circuitName", null),
  explanation: loadState<string | null>("explanation", null),
  suggestions: loadState<string[] | null>("suggestions", null),
  prompt: loadState<string | null>("prompt", null),
};

export const circuitSlice = createSlice({
  name: "circuit",
  initialState,
  reducers: {
    setCircuit: (
      state,
      action: PayloadAction<{
        explanation: string;
        suggestions: string[];
        circuitName: string;
        node: Node;
        edge: Edge;
        prompt: string;
      }>
    ) => {

      state.node = action.payload.node;
      state.edge = action.payload.edge;
      state.circuitName = action.payload.circuitName;
      state.explanation = action.payload.explanation;
      state.suggestions = action.payload.suggestions;
      state.prompt = action.payload.prompt;

      // Save each property in sessionStorage
      saveState("nodes", state.node);
      saveState("edges", state.edge);
      saveState("circuitName", state.circuitName);
      saveState("explanation", state.explanation);
      saveState("suggestions", state.suggestions);
      saveState("prompt", state.prompt);
    },
    clearCircuit: (state) => {
      state.projectId=null;
      state.node = null;
      state.edge = null;
      state.circuitName = null;
      state.explanation = null;
      state.suggestions = null;

      // Remove each key from sessionStorage
      sessionStorage.removeItem("nodes");
      sessionStorage.removeItem("edges");
      sessionStorage.removeItem("circuitName");
      sessionStorage.removeItem("explanation");
      sessionStorage.removeItem("suggestions");
      sessionStorage.removeItem("prompt");
    },
    setProjectId: (state, action: PayloadAction<{ projectId: string }>) => {
      state.projectId = action.payload.projectId;
      saveState("projectId", state.projectId);
    },
  },
});

export const { setCircuit, clearCircuit,setProjectId } = circuitSlice.actions;
export default circuitSlice.reducer;
