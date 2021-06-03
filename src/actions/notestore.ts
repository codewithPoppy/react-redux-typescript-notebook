import { Notebook, NoteStoreAction, NoteStoreActions, FilterActionType, FilterAction } from '../model/index';

export function addNotebook(notebook: Notebook): NoteStoreAction {
    return {
        type: NoteStoreActions.ADD_NOTEBOOK,
        payload: notebook,
    }
}

export function selectChange(notebookId: number): NoteStoreAction {
    return {
        type: NoteStoreActions.SELECT_CHANGE,
        payload: notebookId,
    }
}

export function filterChange(filter: FilterActionType): FilterAction {
    return {
        type: NoteStoreActions.FILTER_CHANGE,
        payload: filter,
    }
}

export function deleteNotebook(): NoteStoreAction {
    return {
        type: NoteStoreActions.DELETE_NOTEBOOK,
        payload: true,
    }
}


