import { Notebook, NoteStoreAction, NoteStoreActions } from '../model/index';
import { Note, NotebookAction, NotebookActions, LabelEditActionType, NoteEditAction, insertActionType, InsertNoteAction, LabelEditAction } from '../model';
// ADD_NOTE = "ADD_NOTE",
// DELETE_NOTE = "DELETE_NOTE",
// EDIT_NOTE = "EDIT_NOTE",
// EDIT_LABEL = "EDIT_LABEL",

export function addNote(note: Note): NotebookAction {
    return {
        type: NotebookActions.ADD_NOTE,
        payload: note,
    }
}
export function insertNote(payload: insertActionType): InsertNoteAction {
    return {
        type: NotebookActions.INSERT_NOTE,
        payload,
    }
}

export function deleteNote(id: number): NotebookAction {
    return {
        type: NotebookActions.DELETE_NOTE,
        payload: id,
    }
}
export function editNote(note: Note): NoteEditAction {
    return {
        type: NotebookActions.EDIT_NOTE,
        payload: note,
    }
}

export function editLabel(editlabeltype: LabelEditActionType): LabelEditAction {
    return {
        type: NotebookActions.EDIT_LABEL,
        payload: editlabeltype,
    }
}
