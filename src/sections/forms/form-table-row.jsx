import { useState } from "react";
import PropTypes from "prop-types";

import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";

import Iconify from "src/components/iconify";
import { fDate, fDateTime } from "src/utils/format-time";

const statusColors = {
  pending: "#DFEDFF",
  complete: "#EAFFEF",
  assigned: "#FFF4D3",
  "not assigned": "white",
  cancelled: "#FFE6E3",
};

export default function FormTableRow({
  createdAt,
  initiatorId,
  slNo,
  employeeCode,
  // employeeName,
  customerCode,
  complainNo,
  complainDate,
  customerName,
  purchasedFrom,
  eflRefund,
  region,
  sbu,
  invoiceNo,
  invoiceDate,
  invoiceValue,
  category,
  severeness,
  invoiceCopy,
  productCode,
  productName,
  productSNO,
  productStatus,
  installationDate,
  tds,
  bpNameCode,
  waterPressure,
  complainHistory,
  reason,
  detailsOfParts,
  decision,
  remark,
  modeOfPayment,
  beneficiaryHolder,
  bankName,
  accountNo,
  ifscCode,
  proofDocument,
  status,
  pendingWith,
  pendingDays,
  repRetOrderNo,
  refundRemarks,
  rfmClearance,
  refundSapDoc,
  utrNo,
  refundDate,
  replacementOrderNo,
  onClick,
  tab,
  verificationVideo,
  technicianLastVisitDate,
  productCategory,
  policyStatus,
}) {
  const [open, setOpen] = useState(null);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const renderStatus = () => {
    return productStatus?.toLowerCase() === "pending"
      ? "Acknowledge"
      : productStatus?.charAt(0).toUpperCase() + productStatus?.slice(1);
  };

  const renderColor = () =>
    statusColors[productStatus?.toLowerCase()] || "white";

  return (
    <>
      <TableRow tabIndex={-1} sx={{ backgroundColor: renderColor() }}>
        <TableCell>{fDateTime(createdAt)}</TableCell>
        <TableCell onClick={onClick} sx={{ cursor: "pointer" }}>
          {slNo}
        </TableCell>
        <TableCell>{initiatorId}</TableCell>
        <TableCell>{employeeCode}</TableCell>
        {/* <TableCell>{employeeName}</TableCell> */}
        <TableCell>{complainNo}</TableCell>
        <TableCell>{fDate(complainDate)}</TableCell>
        <TableCell>{customerCode}</TableCell>
        <TableCell>{customerName}</TableCell>
        <TableCell>{purchasedFrom}</TableCell>
        <TableCell>{eflRefund}</TableCell>
        <TableCell>{region}</TableCell>
        <TableCell>{sbu}</TableCell>
        <TableCell>{invoiceNo}</TableCell>
        <TableCell>{fDate(invoiceDate)}</TableCell>
        <TableCell>{invoiceValue}</TableCell>
        <TableCell>{category}</TableCell>
        <TableCell>{severeness}</TableCell>
        <TableCell>
          {invoiceCopy ? (
            <a href={invoiceCopy} target="_blank">
              Attached File
            </a>
          ) : (
            "NA"
          )}
        </TableCell>
        <TableCell>{productCode}</TableCell>
        <TableCell>{productName}</TableCell>
        <TableCell>{productSNO}</TableCell>
        <TableCell>{productStatus}</TableCell>
        <TableCell>{fDate(installationDate)}</TableCell>
        <TableCell>{tds}</TableCell>
        <TableCell>{bpNameCode}</TableCell>
        <TableCell>{waterPressure}</TableCell>
        <TableCell>{complainHistory}</TableCell>
        <TableCell>{reason}</TableCell>
        <TableCell>{detailsOfParts}</TableCell>
        <TableCell>{decision}</TableCell>
        <TableCell
          style={{
            maxWidth: "30vw",
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          title={remark}
        >
          {remark}
        </TableCell>
        <TableCell>{policyStatus}</TableCell>
        <TableCell>{productCategory}</TableCell>
        <TableCell>{fDate(technicianLastVisitDate)}</TableCell>
        <TableCell>
          {verificationVideo ? (
            <a href={verificationVideo} target="_blank">
              Attached File
            </a>
          ) : (
            "NA"
          )}
        </TableCell>
        <TableCell>{modeOfPayment}</TableCell>
        <TableCell>{beneficiaryHolder}</TableCell>
        <TableCell>{bankName}</TableCell>
        <TableCell>{accountNo}</TableCell>
        <TableCell>{ifscCode}</TableCell>
        <TableCell>
          {proofDocument ? (
            <a href={proofDocument} target="_blank">
              Attached File
            </a>
          ) : (
            "NA"
          )}
        </TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{pendingWith}</TableCell>
        <TableCell>{pendingDays}</TableCell>
        <TableCell>{replacementOrderNo}</TableCell>
        <TableCell>{refundRemarks}</TableCell>
        <TableCell>{rfmClearance}</TableCell>
        <TableCell>{refundSapDoc}</TableCell>
        <TableCell>{utrNo}</TableCell>
        <TableCell>{fDate(refundDate)}</TableCell>
      </TableRow>

      {/* Popover Menu */}
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: "error.main" }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

FormTableRow.propTypes = {
  createdAt: PropTypes.string,
  initiatorId: PropTypes.string,
  slNo: PropTypes.string,
  customerCode: PropTypes.string,
  customerCode1: PropTypes.string,
  complainNo: PropTypes.string,
  complainDate: PropTypes.string,
  customerName: PropTypes.string,
  purchasedFrom: PropTypes.string,
  region: PropTypes.string,
  sbu: PropTypes.string,
  invoiceNo: PropTypes.string,
  invoiceDate: PropTypes.string,
  invoiceValue: PropTypes.string,
  category: PropTypes.string,
  invoiceCopy: PropTypes.string,
  productCode: PropTypes.string,
  productName: PropTypes.string,
  productSNO: PropTypes.string,
  productStatus: PropTypes.string,
  installationDate: PropTypes.string,
  tds: PropTypes.string,
  bpNameCode: PropTypes.string,
  waterPressure: PropTypes.string,
  complainHistory: PropTypes.array,
  reason: PropTypes.string,
  detailsOfParts: PropTypes.string,
  decision: PropTypes.string,
  remark: PropTypes.string,
  modeOfPayment: PropTypes.string,
  beneficiaryHolder: PropTypes.string,
  bankName: PropTypes.string,
  accountNo: PropTypes.string,
  ifscCode: PropTypes.string,
  proofDocument: PropTypes.string,
  status: PropTypes.string,
  pendingWith: PropTypes.string,
  pendingDays: PropTypes.string,
  // repRetOrderNo: PropTypes.string,
  // refundRemarks: PropTypes.string,
  // rfmClearance: PropTypes.string,
  // refundSapDoc: PropTypes.string,
  // utrNo: PropTypes.string,
  // refundDate: PropTypes.string,
  // onClick: PropTypes.func,
  // tab: PropTypes.string,
};
