export interface CellType {
    id: number;
    title: string;
    name: string;
    value: string | number;
    type: 'text' | 'string' | 'number' | 'percent'; 
}