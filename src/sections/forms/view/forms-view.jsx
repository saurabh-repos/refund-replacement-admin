import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "src/components/scrollbar";
import CircularIndeterminate from "src/utils/loader";
import FormTableToolbar from "../form-table-toolbar";
import FormTableHead from "../form-table-head";
import FormTableRow from "../form-table-row";
import { applyFilter, getComparator } from "src/utils/utils";
import excel from "../../../../public/assets/excel.svg";
import TableNoData from "../table-no-data";
import { publicRequest, userRequest } from "src/requestMethod";
import FilterModal from "../FilterModal";
import RequestModal from "../RequestModal";

export default function FormPage() {
  const [data, setData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [region, setRegion] = useState();
  const [status, setStatus] = useState();
  const [refund, setRefund] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [openModal, setOpenModal] = useState(false);

  const [regionData, setRegionData] = React.useState();

  const getRegionData = async () => {
    try {
      const res = await publicRequest.get("/user/getMasters?key=Region");
      setRegionData(res?.data?.data);
    } catch (err) {
      console.log("err:", err);
    }
  };

  React.useEffect(() => {
    getRegionData();
  }, []);

  const getData = async () => {
    try {
      const res = await userRequest.get("/admin/getForms", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          sort: orderBy,
          // order: order,
          region: region,
          status,
          refund: refund,
          startDate: startDate,
          endDate: endDate,
        },
      });
      setLoading(false);
      setData(res?.data?.data);
      setTotalCount(res?.data?.data?.totalForms || 0);
    } catch (err) {
      console.log("err:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    getData();
  }, [
    debouncedSearch,
    page,
    rowsPerPage,
    region,
    status,
    refund,
    startDate,
    endDate,
  ]);

  const sortableColumns = ["createdAt", "customerName"];

  const handleSort = (event, id) => {
    if (sortableColumns.includes(id)) {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setRowsPerPage(rowsPerPage);
    setLimit(rowsPerPage);
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setLimit(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleFilterChange = (field, value) => {
    setPage(0);
    setSearch(value);
  };

  const dataFiltered = applyFilter({
    inputData: data?.forms,
    comparator: getComparator(order, orderBy),
    search,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let notFound = !dataFiltered.length && !!search;

  // console.log(notFound);
  const headLabel = [
    { id: "createdAt", label: "Timestamp", sortable: true, minWidth: 180 },
    { id: "slNo", label: "Request No.", minWidth: 120 },
    { id: "initiatorId", label: "Email address", minWidth: 130 },
    { id: "employeeCode", label: "Requestor Employee Code", minWidth: 170 },
    // { id: 'employeeName', label: 'Requestor Employee Name', minWidth: 170 },
    { id: "complainNo", label: "Complaint or Work Order No", minWidth: 150 },
    { id: "complainDate", label: "Complain or Work Order Date", minWidth: 150 },
    { id: "customerCode", label: "Customer Code", minWidth: 140 },
    { id: "customerName", label: "Customer Name", minWidth: 145 },
    {
      id: "purchasedFrom",
      label: "Customer Purchased / Ordered From",
      minWidth: 180,
    },
    { id: "region", label: "Region", minWidth: 110 },
    { id: "sbu", label: "SBU", minWidth: 120 },
    { id: "invoiceNo", label: "Invoice No", minWidth: 140 },
    { id: "invoiceDate", label: "Invoice Date", minWidth: 150 },
    { id: "invoiceValue", label: "Invoice Value", minWidth: 150 },
    { id: "category", label: "Category", minWidth: 120 },
    { id: "invoiceCopy", label: "Attach Valid Invoice Copy", minWidth: 125 },
    { id: "productCode", label: "Product Code", minWidth: 130 },
    { id: "productName", label: "Product Name", minWidth: 130 },
    { id: "productSNO", label: "Product Serial No.", minWidth: 160 },
    { id: "productStatus", label: "Product Status", minWidth: 150 },
    { id: "installationDate", label: "Installation Date", minWidth: 160 },
    { id: "tds", label: "Input/Output TDS in unit found", minWidth: 160 },
    { id: "bpNameCode", label: "BP Name & Code", minWidth: 160 },
    { id: "waterPressure", label: "Water Pressure in Unit", minWidth: 140 },
    {
      id: "complainHistory",
      label:
        "Previous Complaint No & Details of activity (Repeat Failure Case Only)",
      minWidth: 200,
    },
    {
      id: "reason",
      label: "Reason for Return, Refund or Replacement",
      minWidth: 200,
    },
    {
      id: "detailsOfParts",
      label: "Details of Parts required for repair but not available",
      minWidth: 200,
    },
    { id: "decision", label: "Final Decision", minWidth: 140 },
    { id: "remark", label: "Remarks for Replacement Or Refund", minWidth: 200 },
    { id: "modeOfPayment", label: "Refund Mode", minWidth: 150 },
    { id: "beneficiaryHolder", label: "Beneficiary Name", minWidth: 160 },
    { id: "bankName", label: "Bank Name", minWidth: 130 },
    { id: "accountNo", label: "Bank Account No.", minWidth: 160 },
    { id: "ifscCode", label: "IFSC-Code", minWidth: 130 },
    { id: "proofDocument", label: "Bank Account Proof", minWidth: 200 },
    { id: "status", label: "Overall Status", minWidth: 140 },
    { id: "pendingWith", label: "Pending With", minWidth: 120 },
    { id: "pendingDays", label: "Pending days", minWidth: 120 },
    { id: "replacementOrderNo", label: "Replacement Order No.", minWidth: 140 },
    { id: "reptNo", label: "Rep/Ret-Order No.", minWidth: 160 },
    { id: "refundRemarks", label: "Refund Remarks", minWidth: 150 },
    { id: "rfmClearance", label: "RFM-Clearance", minWidth: 140 },
    { id: "refundSAPDoc", label: "Refund Sap Doc", minWidth: 140 },
    { id: "utrNo", label: "UTR No.", minWidth: 120 },
    { id: "refundDate", label: "Refund Date", minWidth: 140 },
  ];

  const params = new URLSearchParams({
    search: debouncedSearch,
    region: region || "",
    status: status || "",
    refund: refund || "",
    startDate: startDate || "",
    endDate: endDate || "",
  });

  const handleExport = async () => {
    try {
      const exportResponse = await userRequest.get(
        `/admin/exportFormsToExcel?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      // Create a Blob object from the response data
      const blob = new Blob([exportResponse.data], {
        type: "application/octet-stream",
      });

      // Create a URL for the blob and initiate download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "Request.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data. Please try again later.");
    }
  };

  // const calculatePendingDays = (data) => {
  //   if (!data || !data.requestDetails) {
  //     return 'N/A';
  //   }

  //   const currentDate = new Date();
  //   let steps = data?.requestDetails;
  //   console.log("steps => ", steps);
  //   let lastStep = null;
  //   let pendingDays = 0;

  //   Object.keys(steps).forEach((stepKey) => {
  //     if (stepKey === 'assignedEmail') {
  //       return;
  //     }
  //     const step = steps[stepKey];
  //     if (step.status === 'Pending') {
  //       const stepDate = new Date(step.createdAt);
  //       if (!lastStep || stepDate > new Date(lastStep.createdAt)) {
  //         lastStep = step;
  //       }
  //     }
  //   });

  //   if (lastStep) {
  //     const stepDate = new Date(lastStep.createdAt);
  //     pendingDays = Math.floor((currentDate - stepDate) / (1000 * 60 * 60 * 24));
  //   }

  //   return pendingDays;
  // };

  const calculatePendingDays = (data) => {
    if (!data || !data.requestDetails) {
      return "N/A";
    }

    const currentDate = new Date();
    const steps = data.requestDetails;
    let lastApprovedStep = -1;
    let oldestPendingDate = null;

    // Identify the last approved step
    Object.keys(steps)
      .filter((key) => key.startsWith("step"))
      .sort(
        (a, b) =>
          parseInt(a.replace("step", ""), 10) -
          parseInt(b.replace("step", ""), 10)
      )
      .forEach((stepKey) => {
        const stepData = steps[stepKey];

        if (stepData.some((item) => item.status === "Approved")) {
          lastApprovedStep = parseInt(stepKey.replace("step", ""), 10);
        }
      });

    // Find the earliest pending step AFTER the last approved step
    Object.keys(steps)
      .filter((key) => key.startsWith("step"))
      .sort(
        (a, b) =>
          parseInt(a.replace("step", ""), 10) -
          parseInt(b.replace("step", ""), 10)
      )
      .forEach((stepKey) => {
        const stepNumber = parseInt(stepKey.replace("step", ""), 10);
        const stepData = steps[stepKey];

        // Skip steps that were approved already
        if (stepNumber <= lastApprovedStep) {
          return;
        }

        stepData.forEach((item) => {
          if (item.status === "Pending") {
            const stepDate = new Date(item.createdAt);
            if (!oldestPendingDate || stepDate < oldestPendingDate) {
              oldestPendingDate = stepDate;
            }
          }
        });
      });

    // Calculate pending days
    if (oldestPendingDate) {
      return Math.floor(
        (currentDate - oldestPendingDate) / (1000 * 60 * 60 * 24)
      );
    }

    return "N/A";
  };

  return (
    <Container>
      <Card>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginRight: "20px",
          }}
        >
          <FormTableToolbar
            search={search}
            onFilterChange={handleFilterChange}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              alignItems: "center",
              fontSize: "0.8rem",
              fontWeight: "bold",
              cursor: "pointer",
              gap: "8px",
            }}
          >
            <span onClick={handleOpen} style={{ color: "#167beb" }}>
              Filter
            </span>
            |
            <span onClick={handleExport} style={{ color: "#167beb" }}>
              Export{" "}
              <img src={excel} style={{ width: "1.2rem", marginLeft: "5px" }} />
            </span>
          </div>
        </div>

        <FilterModal
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          setRegion={setRegion}
          setStatus={setStatus}
          setRefund={setRefund}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
          regionData={regionData}
        />

        <Scrollbar>
          {loading && <CircularIndeterminate />}
          {!loading && (
            <TableContainer sx={{ overflow: "unset" }}>
              <Table sx={{ minWidth: 800 }}>
                <FormTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={data?.length}
                  onRequestSort={handleSort}
                  headLabel={headLabel}
                />
                <TableBody>
                  {dataFiltered &&
                    dataFiltered.map((row) => (
                        <FormTableRow
                          key={row?._id}
                          createdAt={row?.createdAt}
                          initiatorId={row?.initiatorId}
                          slNo={row?.slNo}
                          employeeCode={row?.employeeCode}
                          // employeeName={row?.employeeName}
                          customerCode={row?.customerCode}
                          complainNo={row?.complainNo}
                          complainDate={row?.complainDate}
                          customerName={row?.customerName}
                          purchasedFrom={row?.purchasedFrom}
                          region={row?.region}
                          sbu={row?.sbu}
                          invoiceNo={row?.invoiceNo}
                          invoiceDate={row?.invoiceDate}
                          invoiceValue={row?.invoiceValue}
                          category={row?.category}
                          invoiceCopy={row?.invoiceCopy}
                          productCode={row?.productCode}
                          productName={row?.productName}
                          productSNO={row?.productSNO}
                          productStatus={row?.productStatus}
                          installationDate={row?.installationDate}
                          tds={row?.tds}
                          bpNameCode={row?.bpNameCode}
                          waterPressure={row?.waterPressure}
                          complainHistory={row?.complainHistory}
                          reason={row?.reason}
                          detailsOfParts={row?.spareCode}
                          decision={row?.decision}
                          remark={row?.remark}
                          modeOfPayment={row?.modeOfPayment}
                          beneficiaryHolder={row?.beneficiaryHolder}
                          bankName={row?.bankName}
                          accountNo={row?.accountNo}
                          ifscCode={row?.ifscCode}
                          proofDocument={row?.proofDocument}
                          status={row?.status}
                          pendingWith={
                            row?.requestDetails?.assignedEmail.length > 0
                              ? row?.requestDetails?.assignedEmail.length> 0 ? row?.requestDetails?.assignedEmail[0]?.email : "N/A"
                              : "N/A"
                          }
                          // pendingWith='N/A'
                          pendingDays={
                            row?.requestDetails?.assignedEmail[0]
                              ? calculatePendingDays(row)
                              : "N/A"
                          }
                          replacementOrderNo={row?.replacementOrderNo}
                          repRetOrderNo={row?.reqOrderNo}
                          refundRemarks={row?.refundRemark}
                          rfmClearance={row?.rfmClearances}
                          refundSapDoc={row?.refundSap}
                          utrNo={row?.utrNo}
                          refundDate={row?.refundDate}
                          onClick={() => {
                            setSelectedRowData(row);
                            setOpenModal(true);
                          }}
                        />
                    ))}

                  {notFound && <TableNoData query={search} />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Scrollbar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {/* <ColorIndicators /> */}

          <TablePagination
            page={page}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </Card>
      <RequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        rowData={selectedRowData}
        getRequestData={getData}
      />
    </Container>
  );
}
