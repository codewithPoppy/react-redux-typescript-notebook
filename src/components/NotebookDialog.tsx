// prettier-ignore
import { Button, Dialog, DialogActions, DialogTitle, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";
import { useActions } from "../actions";

interface Props {
    open: boolean;
    onClose: () => void;
    onOk: (name: string) => void;
}

export function NotebookDialog(props: Props) {
    const { open, onClose, onOk } = props;
    const classes = useStyles();
    const [notebookValue, setNotebookValue] = React.useState("");

    const keyDown = (event: any) => {
        console.log(event)
        if (event.keyCode == 13 && notebookValue !== "") {
            onOk(notebookValue);
            event.preventDefault();
        }
    }
    const handleChange = (event: any) => {
        setNotebookValue(event.target.value);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add a new Notebook</DialogTitle>
            <TextField
                id="multiline-flexible"
                value={notebookValue}
                autoFocus
                onChange={handleChange}
                onKeyDown={keyDown}
                className={classes.textField}
            />
            <DialogActions>
                <Button color="secondary" variant="contained" onClick={() => { notebookValue !== "" && onOk(notebookValue) }}>
                    OK
				</Button>
            </DialogActions>
        </Dialog>
    );
}

const useStyles = makeStyles({
    textField: {
        width: 400,
        margin: 20,
    },
});
