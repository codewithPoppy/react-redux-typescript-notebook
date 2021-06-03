import { NoteStore, NoteStoreAction, NoteStoreActions } from '../model/index';
import { Note, Notebook, NotebookAction, NotebookActions, InsertNoteAction, insertActionType, LabelEditAction, NoteEditAction, LabelEditActionType, FilterAction, FilterActionType } from '../model/index';
import createReducer from './createReducer';

var initialState: NoteStore = {
    selected: 1,
    filter: {
        title: '',
        labels: '',
    },
    notebooks: [],
}

export const notestore = createReducer<NoteStore>(initialState, {
    [NoteStoreActions.ADD_NOTEBOOK](state: NoteStore, action: NoteStoreAction) {
        return {
            ...state,
            notebooks: [
                ...state.notebooks,
                action.payload,
            ]
        };
    },
    [NoteStoreActions.DELETE_NOTEBOOK](state: NoteStore, action: NoteStoreAction) {
        var newNotebooks = state.notebooks.filter(nb => nb.id !== state.selected);
        return {
            ...state,
            selected: newNotebooks.length ? newNotebooks[0].id : 0,
            notebooks: newNotebooks,
        }
    },
    [NoteStoreActions.FILTER_CHANGE](state: NoteStore, action: FilterAction) {
        return {
            ...state,
            filter: {
                title: action.payload.title,
                labels: action.payload.labels,
            }
        }
    },
    [NoteStoreActions.SELECT_CHANGE](state: NoteStore, action: NoteStoreAction) {
        return {
            ...state,
            selected: action.payload,
            filter: {
                title: '',
                labels: '',
            }
        }
    },
    [NotebookActions.ADD_NOTE](state: NoteStore, action: NotebookAction) {
        return {
            ...state,
            notebooks: state.notebooks.map(nb => {
                if (nb.id !== state.selected)
                    return nb;
                return {
                    id: nb.id,
                    name: nb.name,
                    notes: [...nb.notes, action.payload],
                }
            })
        }
    },
    [NotebookActions.DELETE_NOTE](state: NoteStore, action: NotebookAction) {
        return {
            ...state,
            notebooks: state.notebooks.map(nb => {
                if (nb.id !== state.selected)
                    return nb;
                var newNotes = nb.notes.filter(n => n.id !== action.payload);
                return {
                    id: nb.id,
                    name: nb.name,
                    notes: newNotes,
                };
            })
        }
    },
    [NotebookActions.EDIT_NOTE](state: NoteStore, action: NoteEditAction) {
        return {
            ...state,
            notebooks: state.notebooks.map(nb => {
                if (nb.id !== state.selected)
                    return nb;
                return {
                    ...nb,
                    notes: nb.notes.map(n => {
                        if (n.id !== action.payload.id)
                            return n;
                        return action.payload;
                    })
                }
            })
        }
    },
    [NotebookActions.INSERT_NOTE](state: NoteStore, action: InsertNoteAction) {
        var notebookId = state.notebooks.findIndex(nb => nb.id == state.selected);
        var prevId = state.notebooks[notebookId].notes.findIndex(note => note.id == action.payload.prevNum);
        state.notebooks[notebookId].notes.splice(prevId + 1, 0, action.payload.note);
        return state;
    }
});
