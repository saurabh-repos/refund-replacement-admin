import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import { userRequest } from "src/requestMethod";
import ExcelIcon from "../../../public/assets/excel.svg";

const columns = [
  { id: "category", label: "Category", color: "#1777ED", textColor: "#FFF" },
  {
    id: "totalPending",
    label: "Total Pending",
    color: "#1777ED",
    textColor: "#FFF",
  },
  { id: "today", label: "Today", color: "#FFCC33", textColor: "#FFF" },
  { id: "oneDay", label: "1 Day", color: "#FFAB00", textColor: "#FFF" },
  { id: "twoDay", label: "2 Day", color: "#FF9933", textColor: "#FFF" },
  { id: "threeDay", label: "3 Day", color: "#FF6600", textColor: "#FFF" },
  { id: "fourDay", label: "4 Day", color: "#FF3300", textColor: "#FFF" },
  { id: "fiveDay", label: "5 Day", color: "#CC0000", textColor: "#FFF" },
  { id: "moreThanFive", label: ">5 Day", color: "#990000", textColor: "#FFF" },
];

const rows = [
  { category: "Comm-1 (Verify Doc and Data)" },
  { category: "Area Head" },
  { category: "ZSH" },
  { category: "RM" },
  { category: "Comm-2 (Order Creation)" },
  { category: "SCM" },
];

const ReportTable = () => {
  const [region, setRegion] = useState("East");
  const pendingRequests = { North: 42, South: 569, East: 69, West: 415 };
  const totalPending = 1095;

  const handleExport = async () => {
    try {
      // const response = await userRequest.get("/admin/exportFormsToExcel", {
      //   responseType: "blob",
      // });

      // const blob = new Blob([response.data], {
      //   type: "application/octet-stream",
      // });
      // const url = URL.createObjectURL(blob);
      // const a = document.createElement("a");
      // a.href = url;
      // a.download = "Request.xlsx";
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      console.log("Exporting data");
    } catch (error) {
      toast.error("Error exporting data. Please try again.");
    }
  };

  return (
    <Paper sx={{ p: 2, mt: 4, borderRadius: 2, width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <Typography variant="body2">TAT: Pending Requests</Typography>
          <Typography variant="body2" sx={{ color: "red" }}>Total: {totalPending}</Typography>
        </div>

        <div
          style={{
            display: "flex",
            // flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="#000">
              Region:
            </Typography>
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              size="small"
              sx={{
                borderBottom: "1px solid #000",
                borderRadius: "0px",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              {Object.keys(pendingRequests).map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </div>

          <Typography variant="caption" color="#000">
            Pending Requests: <strong>{pendingRequests[region]}</strong>
          </Typography>
        </div>

        <Button
          onClick={handleExport}
          variant="text"
          sx={{ textTransform: "none", color: "#167beb", border: "none" }}
        >
          Export{" "}
          <img
            src={ExcelIcon}
            alt="Excel"
            style={{ width: "1.2rem", marginLeft: "5px" }}
          />
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map(({ id, label, color, textColor }) => (
                <TableCell
                  key={id}
                  align="center"
                  sx={{
                    backgroundColor: color || "#F0F0F0",
                    color: textColor || "#000",
                    fontWeight: "bold",
                  }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} hover>
                {columns.map(({ id }) => (
                  <TableCell key={id} align="center">
                    {row[id] || "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "8px",
          fontSize: "0.875rem",
          color: "#666",
          gap: "8px",
        }}
      >
        <span style={{ color: "#1777ED" }}>
          North: <strong style={{ color: "#000" }}>42</strong>
        </span>{" "}
        |
        <span style={{ color: "#28A745" }}>
          {" "}
          South: <strong style={{ color: "#000" }}>569</strong>
        </span>{" "}
        |
        <span style={{ color: "#FFC107" }}>
          {" "}
          East: <strong style={{ color: "#000" }}>69</strong>
        </span>{" "}
        |
        <span style={{ color: "#DC3545" }}>
          {" "}
          West: <strong style={{ color: "#000" }}>415</strong>
        </span>
      </div>
    </Paper>
  );
};

export default ReportTable;
