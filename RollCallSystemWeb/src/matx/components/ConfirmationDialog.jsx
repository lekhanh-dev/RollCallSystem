import React, { useState } from "react";
import { Dialog, Button, CircularProgress } from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  wrapper: {
    position: "relative",
  },

  buttonProgress: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
});

const ConfirmationDialog = ({
  open,
  onConfirmDialogClose,
  text,
  title = "confirm",
  onYesClick,
  loadingCircularProgress,
}) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(loadingCircularProgress);
  return (
    <Dialog
      maxWidth="xs"
      fullWidth={true}
      open={open}
      onClose={onConfirmDialogClose}
    >
      <div className="pt-24 px-20 pb-8">
        <h4 className="capitalize">{title}</h4>
        <p>{text}</p>
        <div className="flex flex-space-between pt-8">
          <div className={classes.wrapper}>
            <Button
              onClick={() => {
                onYesClick();
                setLoading(true);
              }}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              Đồng ý
            </Button>
            {loading && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
          <Button
            onClick={onConfirmDialogClose}
            variant="contained"
            color="secondary"
          >
            Không
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ConfirmationDialog;
