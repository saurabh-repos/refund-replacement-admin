import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteConfirmation from "../delete-confirmation";
import MasterTabs from "../master-tab";
import ReasonProductTable from "../reason-product";
import ReasonAMCTable from "../reason-amc";
import { userRequest } from "src/requestMethod";

const menuItems = ["Reason - Product", "Reason - AMC"];

const tableComponents = {
  "Reason - Product": ReasonProductTable,
  "Reason - AMC": ReasonAMCTable,
};

const MasterView = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedCategory = menuItems[selectedTab];
  const TableComponent =
    tableComponents[selectedCategory] || ReasonProductTable;

  const fetchMasterData = async () => {
    try {
      let res;
      setLoading(true);
      if (selectedTab === 0) {
        res = await userRequest.get(
          `/user/getMasters?key=Reason&category=PRODUCT`
        );
      } else {
        res = await userRequest.get(`/user/getMasters?key=Reason&category=AMC`);
      }
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);
  useEffect(() => {
    fetchMasterData();
  }, [selectedTab]);

  const handleOpenModal = (item = null) => {
    setCurrentItem(item);
    setInputValue(item ? item.name : "");
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  const handleSave = async () => {
    try {
      const payload = {
        key: "Reason",
        value: inputValue,
        category: selectedTab === 0 ? "PRODUCT" : "AMC",
      };
      const endpoint = selectedTab === 0 
        ? "/admin/createMasters?Key=Reason&category=PRODUCT" 
        : "/admin/createMasters?Key=Reason&category=AMC";
      
      await userRequest.post(endpoint, payload);
      fetchMasterData();
    } catch (err) {
      console.log(err);
    } finally {
      handleCloseModal();
    }
  };

  const handleDelete = () => {
    setData((prev) => {
      const updated = { ...prev };
      updated[selectedCategory] = updated[selectedCategory].filter(
        (_, idx) => idx !== currentItem
      );
      return updated;
    });
    handleCloseDeleteDialog();
  };

  return (
    <Box sx={{ width: "100%", px: 3 }}>
      <MasterTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        menuItems={menuItems}
      />

      <Paper elevation={3} sx={{ borderRadius: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {selectedCategory}
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
            sx={{
              backgroundColor: "#167BEB",
              "&:hover": { backgroundColor: "#1877F2" },
            }}
          >
            Add
          </Button>
        </Box>

        <TableComponent
          data={data || []}
          loading={loading}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
        />
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>
          {currentItem === null ? "Add Entry" : "Edit Entry"}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Field Name"
            variant="outlined"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              backgroundColor: "#6200ea",
              "&:hover": { backgroundColor: "#4b00b5" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <DeleteConfirmation
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleDelete={handleDelete}
      />
    </Box>
  );
};

export default MasterView;