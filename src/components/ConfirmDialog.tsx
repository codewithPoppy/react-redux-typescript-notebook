import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
interface Props {
    open: boolean;
    onClose: () => void;
    onOk: () => void;
    question: string;
    title: string;
}
export default function ConfirmDialog(props: Props) {
    const { open, onClose, onOk, question, title } = props;
    return (
        <div>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {question}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
          </Button>
                    <Button onClick={onOk} color="primary" autoFocus>
                        Ok
          </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}