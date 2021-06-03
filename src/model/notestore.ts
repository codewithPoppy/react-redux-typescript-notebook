import { Notebook } from './notebook';

export interface NoteStore {
    selected: number;
    filter: {
        title: string;
        labels: string;
    },
    notebooks: Notebook[];
}

export enum NoteStoreActions {
    ADD_NOTEBOOK = "ADD_NOTEBOOK",
    DELETE_NOTEBOOK = "DELETE_NOTEBOOK",
    SELECT_CHANGE = "SELECT_NOTEBOOK_CHANGE",
    FILTER_CHANGE = "FILTER_CHANGE",
}

interface NoteStoreActionType<T, P> {
    type: T,
    payload: P,
}
export interface FilterActionType {
    title: string,
    labels: string,
} 

export type FilterAction = {
    type: typeof NoteStoreActions.FILTER_CHANGE,
    payload: FilterActionType
}

export type NoteStoreAction =
    | NoteStoreActionType<typeof NoteStoreActions.ADD_NOTEBOOK, Notebook>
    | NoteStoreActionType<typeof NoteStoreActions.DELETE_NOTEBOOK, boolean>
    | NoteStoreActionType<typeof NoteStoreActions.SELECT_CHANGE, number>
    ;
