export interface Note {
    id: number;
    title: string;
    labels: string[];
    content: string;
}

export interface Notebook {
    id: number;
    name: string;
    notes: Note[];
}

export enum NotebookActions {
    ADD_NOTE = "ADD_NOTE",
    DELETE_NOTE = "DELETE_NOTE",
    EDIT_NOTE = "EDIT_NOTE",
    EDIT_LABEL = "EDIT_LABEL",
    INSERT_NOTE = "INSERT_NOTE",
}

interface NotebookActionType<T,P> {
    type: T,
    payload: P,
}

export interface LabelEditActionType {
    id: number,
    labels: string[],
} 
export interface insertActionType {
    prevNum: number,
    note: Note,
} 
export type InsertNoteAction = {
    type: typeof NotebookActions.INSERT_NOTE,
    payload: insertActionType
}

export type LabelEditAction = {
    type: typeof NotebookActions.EDIT_LABEL,
    payload: LabelEditActionType
}

export type NoteEditAction = {
    type: typeof NotebookActions.EDIT_NOTE,
    payload: Note
}

export type NotebookAction = 
    | NotebookActionType<typeof NotebookActions.ADD_NOTE, Note>
    | NotebookActionType<typeof NotebookActions.DELETE_NOTE, number>
    | NotebookActionType<typeof NotebookActions.EDIT_NOTE, Note>
    ;
  