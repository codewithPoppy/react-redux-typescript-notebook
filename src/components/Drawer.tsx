// prettier-ignore
import { Button, Badge, Divider, Drawer as DrawerMui, Hidden, List, ListItem, ListItemIcon, ListItemText, makeStyles, Theme } from '@material-ui/core';
import Textsms from '@material-ui/icons/Textsms';
import HomeIcon from '@material-ui/icons/Home';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../reducers';
import { router } from '../Router';
import { useRoutesActive } from 'react-typesafe-routes';
import { useHistory } from 'react-router-dom';
import * as ConfigActions from '../actions/config';
import NoteAdd from '@material-ui/icons/NoteAdd';
import Note from '@material-ui/icons/Note';
import { NotebookDialog } from './NotebookDialog';
import { useActions } from "../actions";
import * as NoteStoreAction from "../actions/notestore";
import * as SnackbarEventActions from "../actions/snackbarEvent";
import { SnackbarEvent } from "../model/snackbarEvent";

export function Drawer() {
	const classes = useStyles();
	const drawerOpen: boolean = useSelector((state: RootState) => state.drawerOpen);
	const configActions: typeof ConfigActions = useActions(ConfigActions);

	const handleDrawerToggle = () => {
		configActions.setDrawerOpen(!drawerOpen);
	};
	return (
		<>
			<Hidden mdUp>
				<DrawerMui
					variant="temporary"
					anchor={'left'}
					open={drawerOpen}
					classes={{
						paper: classes.drawerPaper,
					}}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
				>
					<Content />
				</DrawerMui>
			</Hidden>
			<Hidden smDown>
				<DrawerMui
					variant="permanent"
					open
					classes={{
						paper: classes.drawerPaper,
					}}
				>
					<Content />
				</DrawerMui>
			</Hidden>
		</>
	);
}

function Content() {
	const classes = useStyles();
	const notebooks = useSelector((state: RootState) => state.notestore.notebooks);
	const selected = useSelector((state: RootState) => state.notestore.selected);
	const currentLabels = useSelector((state: RootState) => {
		var notebookId = state.notestore.notebooks.findIndex(nb => nb.id == state.notestore.selected);
		if (notebookId > -1) {
			var notes = state.notestore.notebooks[notebookId].notes;
			var labels: any[] = [];
			for (var i = 0; i < notes.length; i++) {
				for (var j = 0; j < notes[i].labels.length; j++) {
					var find = labels.findIndex(lb => lb.text == notes[i].labels[j]);
					if (find < 0) {
						labels.push({ text: notes[i].labels[j], count: 1 });
					}
					else {
						labels[find].count++;
					}
				}
			}
			return labels;
		}
		else return [];
	})
	const filter = useSelector((state: RootState) => state.notestore.filter);
	const history = useHistory();
	const [open, setOpen] = React.useState(false);
	const notestoreActions = useActions(NoteStoreAction);
	const snackbarEventActions: typeof SnackbarEventActions = useActions(SnackbarEventActions);

	const handleClose = () => {
		setOpen(false);
	};
	const handleOk = (name: string) => {
		var maxId = Math.max(...notebooks.map(nb => nb.id), 0);
		var findId = notebooks.findIndex(nb => nb.name == name);
		if (findId >= 0) {
			snackbarEventActions.addSnackbarEvent({
				message: 'Notebook with that name already exists!',
				severity: 'error',
				technicalInfo: undefined,
			});
			return;
		}
		notestoreActions.addNotebook(
			{
				id: maxId + 1,
				name,
				notes: []
			}
		);
		setOpen(false);
		snackbarEventActions.addSnackbarEvent({
			message: '1 Notebook Created',
			severity: 'success',
			technicalInfo: undefined,
		});
	}
	const handleAddNotebook = () => {
		setOpen(true);
	};

	const onLabelClick = (label: any) => {
		notestoreActions.filterChange({ title: filter.title, labels: label.text });
	}

	return (
		<div style={{
			height: '100%',
			display: 'flex',
			flexFlow: 'column',
		}}>
			<div className={classes.drawerHeader} />
			<Divider />
			<NotebookDialog open={open} onClose={handleClose} onOk={handleOk} />
			<div style={{ height: '100%', overflowY: 'auto' }}>
				<List style={{ minHeight: 300, overflowY: 'auto' }}>
					<div className={classes.addPaper}>
						<Button className={classes.addButton} variant="contained" color="primary" onClick={handleAddNotebook}>
							<NoteAdd style={{ alignSelf: 'center', marginRight: 5 }}></NoteAdd>Add New
					</Button>
					</div>
					{
						notebooks.map(nb => (
							<ListItem key={'notebook_' + nb.id} button onClick={() => { notestoreActions.selectChange(nb.id) }} selected={selected == nb.id}>
								<ListItemIcon>
									<Note />
								</ListItemIcon>
								<ListItemText primary={nb.name} />
							</ListItem>
						))
					}
				</List>
				<Divider />
				<div style={{ marginLeft: 20, marginTop: 10}}>Labels</div>
				<List>
					{
						currentLabels.map(lb => (
							<ListItem button key={'label_' + lb.text} onClick={() => onLabelClick(lb)}>
								<ListItemIcon>
									<LabelIcon count={lb.count} />
								</ListItemIcon>
								<ListItemText primary={lb.text} style={{ marginLeft: 15 }} />
							</ListItem>
						))
					}
				</List>

			</div>
		</div >
	);
}

function LabelIcon(props: { count: number }) {
	if (props.count > 1) {
		return (
			<Badge color="secondary" badgeContent={props.count}>
				<Textsms />
			</Badge>
		);
	} else {
		return <Textsms />;
	}
}

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
	drawerHeader: { ...theme.mixins.toolbar },
	drawerPaper: {
		width: 250,
		backgroundColor: theme.palette.background.default,
		[theme.breakpoints.up('md')]: {
			width: drawerWidth,
			position: 'relative',
			height: '100%',
		},
	},
	addPaper: {
		padding: 10,
		width: '100%',
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'center',
	},
	addButton: {
		alignItems: 'baseline',
		paddingLeft: 20,
		paddingRight: 20,
		borderRadius: 30,
		backgroundColor: '#858585',
	},
}));
