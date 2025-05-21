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
import { toJalali } from "../../utils/date";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFnsJalali } from "@mui/x-date-pickers/AdapterDateFnsJalali";

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
      endDate: new Date(poll.endDate),
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
          endDate: formData.endDate,
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
    {
      field: "title",
      headerName: "عنوان",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "توضیحات",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "سازنده",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        return params?.name;
      },
    },
    {
      field: "endDate",
      headerName: "تاریخ پایان",
      flex: 1,
      align: "center",
      headerAlign: "center",
      valueGetter: (params) => {
        return toJalali(params);
      },
    },
    {
      field: "isActive",
      headerName: "فعال",
      flex: 1,
      align: "center",
      headerAlign: "center",
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
      align: "center",
      headerAlign: "center",
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
      <Box
        sx={{
          height: 600,
          width: "100%",
          overflow: "auto",
          "& .MuiDataGrid-root": {
            minWidth: 800,
          },
          "& .MuiDataGrid-cell": {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          "& .MuiDataGrid-cell[data-field='description']": {
            maxHeight: "100px !important",
            overflow: "auto",
            whiteSpace: "normal",
            lineHeight: "1.5",
            padding: "8px",
            display: "block",
            textAlign: "left",
          },
        }}
      >
        <DataGrid
          rows={
            Array.isArray(polls)
              ? polls.map((poll) => ({
                  ...poll,
                  id: poll._id,
                  createdBy: poll.createdBy || { name: "نامشخص" },
                  endDate: poll.endDate || new Date().toISOString(),
                }))
              : []
          }
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          loading={isLoading}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        slotProps={{ paper: { sx: { minWidth: 500 } } }}
      >
        <DialogContent>
          <p className="text-xl">ویرایش نظرسنجی</p>
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
            <LocalizationProvider dateAdapter={AdapterDateFnsJalali}>
              <DatePicker
                label="تاریخ پایان"
                value={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date })}
                minDate={new Date()}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "filled",
                  },
                }}
              />
            </LocalizationProvider>
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

            <div className="flex items-center gap-x-4">
              <Button
                color="error"
                fullWidth
                onClick={() => setEditDialogOpen(false)}
              >
                انصراف
              </Button>

              <Button
                fullWidth
                onClick={handleEditSubmit}
                variant="contained"
                color="primary"
              >
                ذخیره
              </Button>
            </div>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{ paper: { sx: { minWidth: 500 } } }}
      >
        <DialogContent>
          <p className="text-xl mb-2">حذف نظرسنجی</p>
          <p>آیا از حذف نظرسنجی {selectedPoll?.title} اطمینان دارید؟</p>
        </DialogContent>

        <DialogActions>
          <Button fullWidth onClick={() => setDeleteDialogOpen(false)}>
            انصراف
          </Button>
          <Button
            fullWidth
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
