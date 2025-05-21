// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";
import { useState } from "react";
import { Link as RouterLink } from "react-router";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  ListItemButton,
} from "@mui/material";
import {
  Add,
  Person,
  Menu as MenuIcon,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useUser } from "../api/auth";

const Navbar = () => {
  const { data: user } = useUser();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    ...(user?.isAdmin
      ? [
          {
            text: "پنل مدیریت",
            icon: <AdminPanelSettings />,
            to: "/admin",
          },
          {
            text: "ایجاد نظرسنجی جدید",
            icon: <Add />,
            to: "/create",
          },
        ]
      : []),
    ...(user
      ? [
          {
            text: "حساب کاربری",
            icon: <Person />,
            to: "/profile",
          },
        ]
      : [
          {
            text: "ورود",
            icon: <Person />,
            to: "/login",
          },
          {
            text: "ثبت نام",
            icon: <Add />,
            to: "/register",
          },
        ]),
  ];

  const drawer = (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div
        className="w-full"
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <List disablePadding>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItemButton component={RouterLink} to={item.to}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </motion.div>
          ))}
        </List>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <AppBar position="static" className="bg-white shadow-md">
        <Toolbar className="justify-between !px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              className="text-gray-800 no-underline hover:text-blue-600"
            >
              نظرسنجی شهرداری همدان
            </Typography>
          </motion.div>

          {isMobile ? (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <IconButton
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  onClick={toggleDrawer(true)}
                  sx={{ color: "gray.800" }}
                >
                  <MenuIcon />
                </IconButton>
              </motion.div>

              <Drawer
                anchor="left"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                slotProps={{
                  paper: { sx: { minWidth: "80%", overflowX: "hidden" } },
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <motion.div
              className="flex items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75 }}
            >
              {user ? (
                <>
                  {user.isAdmin && (
                    <>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          component={RouterLink}
                          to="/admin"
                          variant="contained"
                          color="primary"
                          startIcon={<AdminPanelSettings />}
                          className="bg-blue-600 hover:bg-blue-700"
                          sx={{ borderRadius: 50 }}
                        >
                          پنل مدیریت
                        </Button>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          component={RouterLink}
                          to="/create"
                          variant="contained"
                          color="primary"
                          startIcon={<Add />}
                          className="bg-blue-600 hover:bg-blue-700"
                          sx={{ borderRadius: 50 }}
                        >
                          ایجاد نظرسنجی جدید
                        </Button>
                      </motion.div>
                    </>
                  )}

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/profile"
                      variant="contained"
                      color="primary"
                      startIcon={<Person />}
                      className="bg-blue-600 hover:bg-blue-700"
                      sx={{ borderRadius: 50 }}
                    >
                      حساب کاربری
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/login"
                      variant="contained"
                      color="primary"
                      startIcon={<Person />}
                      className="bg-blue-600 hover:bg-blue-700"
                      sx={{ borderRadius: 50 }}
                    >
                      ورود
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/register"
                      variant="contained"
                      color="primary"
                      startIcon={<Add />}
                      className="bg-blue-600 hover:bg-blue-700"
                      sx={{ borderRadius: 50 }}
                    >
                      ثبت نام
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>
          )}
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Navbar;
