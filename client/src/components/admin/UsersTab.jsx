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
import { useUsers, useUpdateUser, useDeleteUser } from "../../api/admin";
import { useSnackbar } from "notistack";

const UsersTab = () => {
  const { data: users, isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedUser, setSelectedUser] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isVerified: false,
    isAdmin: false,
  });

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      isAdmin: user.isAdmin,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await updateUser.mutateAsync({
        id: selectedUser._id,
        userData: formData,
      });
      enqueueSnackbar("اطلاعات کاربر با موفقیت بروزرسانی شد", {
        variant: "success",
      });
      setEditDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || "خطا در بروزرسانی کاربر", {
        variant: "error",
      });
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteUser.mutateAsync(selectedUser._id);
      enqueueSnackbar("کاربر با موفقیت حذف شد", { variant: "success" });
      setDeleteDialogOpen(false);
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error || "خطا در حذف کاربر", {
        variant: "error",
      });
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "نام",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "email",
      headerName: "ایمیل",
      flex: 1,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "isVerified",
      headerName: "تایید شده",
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
      field: "isAdmin",
      headerName: "ادمین",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography color={params.value ? "success.main" : "text.secondary"}>
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
        }}
      >
        <DataGrid
          rows={
            Array.isArray(users)
              ? users.map((user) => ({
                  ...user,
                  id: user._id,
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
          <p className="text-xl">ویرایش کاربر</p>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="نام"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="ایمیل"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              fullWidth
            />

            <div className="flex items-center">
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isVerified}
                    onChange={(e) =>
                      setFormData({ ...formData, isVerified: e.target.checked })
                    }
                  />
                }
                label="تایید شده"
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isAdmin}
                    onChange={(e) =>
                      setFormData({ ...formData, isAdmin: e.target.checked })
                    }
                  />
                }
                label="ادمین"
              />
            </div>
          </Box>

          <div className="flex items-center gap-x-4 mt-4">
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
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        slotProps={{ paper: { sx: { minWidth: 500 } } }}
      >
        <DialogContent>
          <p className="text-xl mb-2">حذف کاربر</p>
          <p>آیا از حذف کاربر {selectedUser?.name} اطمینان دارید؟</p>
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

export default UsersTab;
