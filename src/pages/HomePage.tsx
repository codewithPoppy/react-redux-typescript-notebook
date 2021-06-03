import { Button, Grid, Typography } from "@material-ui/core";
import { Theme } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { NoteDialog } from "../components/NoteDialog";
import { useSelector } from "react-redux";
import { RootState } from "../reducers/index";
import Add from '@material-ui/icons/Add';
import Delete from '@material-ui/icons/DeleteForever';
import Edit from '@material-ui/icons/Edit';
import Fab from '@material-ui/core/Fab';
import * as NoteStoreAction from "../actions/notestore";
import { useActions } from "../actions";
import * as NotebookAction from "../actions/notebook";
import { Notebook, Note } from '../model';
import ConfirmDialog from '../components/ConfirmDialog';
import { htmlToText } from 'html-to-text';

export function HomePage() {
	const classes = useStyles();
	const [open, setOpen] = React.useState(false);
	const [deleteConfirm, setDeleteConfirm] = React.useState(false);
	const filter = useSelector((state: RootState) => state.notestore.filter);
	const notebooks = useSelector((state: RootState) => state.notestore.notebooks);
	const selected = useSelector((state: RootState) => state.notestore.selected);
	const [isInsert, setIsInsert] = React.useState(false);
	const [prevNum, setPrevNum] = React.useState(0);

	const selectedNotebook = useSelector((state: RootState) => {
		var findId = state.notestore.notebooks.findIndex(nb => nb.id == state.notestore.selected);
		if (findId < 0) return null;
		return state.notestore.notebooks[findId];
	})

	const filteredNotes = useSelector((state: RootState) => {
		var findId = state.notestore.notebooks.findIndex(nb => nb.id == state.notestore.selected);
		if (findId < 0) return null;
		var snotebook = state.notestore.notebooks[findId];
		var filter = state.notestore.filter;
		var labels = filter.labels.split(' ');
		labels = labels.filter(function (lb: string) { return lb !== '' });

		return snotebook.notes.filter(note => {
			if (note.title.toLowerCase().indexOf(filter.title.toLowerCase()) < 0 && htmlToText(note.content).toLowerCase().indexOf(filter.title.toLowerCase()) < 0)
				return false;
			for (var j = 0; j < note.labels.length; j++) {
				note.labels[j] = note.labels[j].toLowerCase();
			}
			for (var i = 0; i < labels.length; i++)
				if (!((note.labels + '').includes(labels[i].toLowerCase())))
					return false;
			return true;
		})
	})

	const [boxColor, setBoxColor] = React.useState("red");
	const notestoreActions = useActions(NoteStoreAction);
	const notebookActions = useActions(NotebookAction);
	const [deleteId, setDeleteId] = React.useState(0);
	const [editNote, setEditNote] = React.useState<Note>({
		id: 0,
		title: '',
		content: '',
		labels: []
	});

	const [mode, setMode] = React.useState('add');


	const handleClose = () => {
		setOpen(false);
	};

	const handleOk = (val: any) => {
		console.log(val)
		if (!selectedNotebook)
			return;
		var labels = val.labels.split(' ');
		labels = labels.filter(function (lb: string) { return lb !== '' });
		var maxId = Math.max(...selectedNotebook.notes.map(nb => nb.id), 0);

		if (!isInsert) {
			notebookActions.addNote(
				{
					id: maxId + 1,
					title: val.title,
					labels,
					content: val.content
				}
			);
		}
		else {
			notebookActions.insertNote(
				{
					prevNum,
					note: {
						id: maxId + 1,
						title: val.title,
						labels,
						content: val.content
					}
				}
			)
		}

		setOpen(false);
	};

	const onNoteDelete = (id: number) => {
		setDeleteId(id);
		setDeleteConfirm(true);
	}

	const onNoteEdit = (edit: Note) => {
		setEditNote(edit);
		setMode('edit');
		setOpen(true);
	}

	const onNoteEditClose = () => {
		setOpen(false);
	}

	const onNoteEditOk = (val: any) => {
		var labels = val.labels.split(' ');
		labels = labels.filter(function (lb: string) { return lb !== '' });
		notebookActions.editNote({
			id: val.id,
			title: val.title,
			labels,
			content: val.content
		}
		);
		setOpen(false);
	}

	const onDeleteClose = () => {
		setDeleteConfirm(false);
	};

	const onDeleteOk = () => {
		notebookActions.deleteNote(deleteId);
		setDeleteConfirm(false);
	};

	const onButtonClick = () =>
		setBoxColor(boxColor === "red" ? "blue" : "red");

	const handleAddNote = () => {
		setIsInsert(false);
		setEditNote({
			id: 0,
			labels: [],
			title: '',
			content: '',
		})
		setMode('add');
		setOpen(true);
	};

	const onInsertNew = (id: number) => {
		setIsInsert(true);
		setPrevNum(id);
		setEditNote({
			id: 0,
			labels: [],
			title: '',
			content: '',
		})
		setMode('add');
		setOpen(true);
	}

	return (
		<Grid container className={classes.root}>
			<NoteDialog open={open} mode={mode} editNote={editNote} onClose={mode == 'add' ? handleClose : onNoteEditClose} onOk={mode == 'add' ? handleOk : onNoteEditOk} />
			<ConfirmDialog open={deleteConfirm} onClose={onDeleteClose} onOk={onDeleteOk} question={'Are you sure to delete this note?'} title={'Confirm'} />
			<Grid item xs={6}>
				<Typography variant="h5" gutterBottom>
					{
						selectedNotebook && selectedNotebook.name
					}
				</Typography>
			</Grid>
			<Grid item xs={6}>
				<div className={classes.buttonContainer}>
					<Button
						className={classes.button}
						variant="contained"
						color="secondary"
						onClick={handleAddNote}
						disabled={!selectedNotebook}
					>
						<Add style={{ marginRight: 5 }} />
						New Note
					</Button>
				</div>
			</Grid>
			<Grid item xs={12}>
				<div style={{ marginLeft: 'auto', justifyContent: 'end', display: 'flex', marginBottom: 20 }}>
					<TextField value={filter.title} label="Search by text" style={{ marginRight: 10 }} size="small" variant="outlined" onChange={(e) => notestoreActions.filterChange({ title: e.target.value, labels: filter.labels })} />
					<TextField value={filter.labels} label="Search by labels" size="small" variant="outlined" onChange={(e) => notestoreActions.filterChange({ title: filter.title, labels: e.target.value })} />
				</div>
			</Grid>
			<Grid item xs={12}>
				{filteredNotes && filteredNotes.length == 0 ? (
					<div style={{ width: '100%', display: 'flex', marginTop: 20, justifyContent: 'center', fontSize: 16 }}>
						Nothing to display
					</div>
				) :
					filteredNotes ?
						(<div>
							{
								filteredNotes.map(note => (
									<div key={'note_' + note.id}>
										<Card className={classes.cardRoot}>
											<CardHeader
												action={
													<div style={{ display: 'flex' }}>
														<IconButton aria-label="delete" onClick={() => onNoteDelete(note.id)}>
															<Delete />
														</IconButton>
														<IconButton aria-label="edit" onClick={() => onNoteEdit(note)}>
															<Edit />
														</IconButton>
													</div>
												}
												title={note.title}
												subheader={'Labels : ' + note.labels.map(lb => ' ' + lb)}
											/>
											<CardContent>
												<div className="content" dangerouslySetInnerHTML={{ __html: note.content }}></div>
											</CardContent>
										</Card>
										<div style={{ width: '100%', height: 30, cursor: 'crosshair' }} onClick={() => onInsertNew(note.id)}>
										</div>
									</div>
								))
							}
						</div>
						) : (<div></div>)
				}
			</Grid>
			<Grid item xs={12}>
			</Grid>
			<Fab color="primary" className={classes.floatingAddButton} onClick={notestoreActions.deleteNotebook} aria-label="delete" disabled={!selectedNotebook}>
				<Delete />
			</Fab>
		</Grid >
	);
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: 20,
		[theme.breakpoints.down("md")]: {
			paddingTop: 50,
			paddingLeft: 15,
			paddingRight: 15,
		},
	},
	floatingAddButton: {
		position: 'absolute',
		bottom: 15,
		right: 15,
	},
	centerContainer: {
		flex: 1,
		height: "90%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flexDirection: "column",

	},

	buttonContainer: {
		width: "100%",
		display: "flex",
		justifyContent: "flex-end",
	},

	button: {
		marginBottom: 15,
	},
	cardRoot: {
		maxHeight: 300,
		overflowY: 'auto',
		padding: 20,
		[theme.breakpoints.down("md")]: {
			paddingTop: 50,
			paddingLeft: 15,
			paddingRight: 15,
		},
	},
	media: {
		height: 0,
		paddingTop: '56.25%',
	}
}));
