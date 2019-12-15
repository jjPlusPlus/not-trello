export interface AppState {
    firebase: any;
    local: LocalState;
}

export interface LocalState {
    columns: Column[];
    detail: object;
    modal: boolean;
}

export interface Column {
    cards: Card[];
    id: string;
    order: number;
    title: string;
}

export interface Card {
    id: string;
    column: string;
    name: string;
    description: string;
    content: string;
    activity: Activity[];
}

export interface Activity {
    label: string;
    timestamp: number;
}
