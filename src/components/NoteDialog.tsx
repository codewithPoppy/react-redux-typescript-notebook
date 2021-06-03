// prettier-ignore
import { Button, Dialog, DialogActions, DialogTitle, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { useActions } from "../actions";
import TextEditor from './TextEditor';
import { Note } from '../model';

interface Props {
    open: boolean;
    mode: string;
    editNote: Note;
    onClose: () => void;
    onOk: (val: any) => void;
}

export function NoteDialog(props: Props) {
    const { open, onClose, onOk, mode, editNote } = props;
    const classes = useStyles();
    const [name, setName] = React.useState("");
    const [labels, setLabels] = React.useState("");
    const [content, setContent] = React.useState("");

    const handleNameChange = (event: any) => {
        setName(event.target.value);
    };
    React.useEffect(() => {
        if (mode == 'edit') {
            setName(editNote.title);
            var lbs = '';
            for (var i = 0; i < editNote.labels.length; i++)
                lbs += (editNote.labels[i] + ' ');
            setLabels(lbs);
            setContent(editNote.content);
        }
        else {
            setName('');
            setLabels('');
            setContent('');
        }
    }, [mode,editNote]);
    const handleLabelsChange = (event: any) => {
        setLabels(event.target.value);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{mode == 'add' ? 'Add' : 'Edit'} Note</DialogTitle>
            <TextField
                multiline
                value={name}
                onChange={handleNameChange}
                className={classes.textField}
                placeholder="input your new title..."
            />
            <TextField
                multiline
                value={labels}
                onChange={handleLabelsChange}
                className={classes.textField}
                placeholder="input your new note labels..."
            />
            <TextEditor content={content} onChange={setContent} />
            <DialogActions>
                <Button color="primary" variant="contained" onClick={() => { name !== "" && onOk({ id: editNote ? editNote.id : 0, title: name, labels, content }) }}>
                    {mode == 'add' ? 'Add New' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const useStyles = makeStyles({
    textField: {
        width: '80%',
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 20,
        marginRight: 20,
    },
});
