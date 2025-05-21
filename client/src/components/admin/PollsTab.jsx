// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useAdminPolls, useUpdatePoll, useDeletePoll } from "../../api/admin";
import { useSnackbar } from "notistack";
import { format } from "date-fns-jalali";

const PollsTab = () => {
  const { data: polls, isLoading } = useAdminPolls();
  const updatePoll = useUpdatePoll();
  const deletePoll = useDeletePoll();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    endDate: "",
    isActive: false,
  });

  const handleEditClick = (poll) => {
    setSelectedPoll(poll);
    setFormData({
      title: poll.title,
      description: poll.description,
      endDate: new Date(poll.endDate).toISOString().split("T")[0],
      isActive: poll.isActive,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (poll) => {
    setSelectedPoll(poll);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await updatePoll.mutateAsync({
        id: selectedPoll._id,
        pollData: {
          ...formData,
          endDate: new Date(formData.endDate),
        },
      });
      enqueueSnackbar("نظرسنجی با موفقیت بروزرسانی شد", {
        variant: "success",
      });
      setEditDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(
        error.response?.data?.error || "خطا در بروزرسانی نظرسنجی",
        {
          variant: "error",
        }
      );
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deletePoll.mutateAsync(selectedPoll._id);
      enqueueSnackbar("نظرسنجی با موفقیت حذف شد", { variant: "success" });
      setDeleteDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || "خطا در حذف نظرسنجی", {
        variant: "error",
      });
    }
  };

  const columns = [
    { field: "title", headerName: "عنوان", flex: 1 },
    { field: "description", headerName: "توضیحات", flex: 1 },
    {
      field: "createdBy",
      headerName: "سازنده",
      flex: 1,
      valueGetter: (params) => params.row.createdBy?.name || "نامشخص",
    },
    {
      field: "endDate",
      headerName: "تاریخ پایان",
      flex: 1,
      valueGetter: (params) =>
        format(new Date(params.row.endDate), "yyyy/MM/dd"),
    },
    {
      field: "isActive",
      headerName: "فعال",
      flex: 1,
      renderCell: (params) => (
        <Typography color={params.value ? "success.main" : "error.main"}>
          {params.value ? "بله" : "خیر"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "عملیات",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            onClick={() => handleEditClick(params.row)}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteClick(params.row)}
            color="error"
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={polls || []}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          loading={isLoading}
          getRowId={(row) => row._id}
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>ویرایش نظرسنجی</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="عنوان"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="توضیحات"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              label="تاریخ پایان"
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
              }
              label="فعال"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>انصراف</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            ذخیره
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>حذف نظرسنجی</DialogTitle>
        <DialogContent>
          <Typography>
            آیا از حذف نظرسنجی {selectedPoll?.title} اطمینان دارید؟
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>انصراف</Button>
          <Button
            onClick={handleDeleteSubmit}
            variant="contained"
            color="error"
          >
            حذف
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default PollsTab;
