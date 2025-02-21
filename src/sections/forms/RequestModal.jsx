import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { userRequest } from 'src/requestMethod';
import { fDate } from 'src/utils/format-time';
import RequestEditableFields from './RequestEditableFields';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 5,
  borderRadius: 2,
  width: '85dvw',
  maxHeight: '80vh',
  overflowY: 'auto',
};

export default function RequestModal({ open, onClose, rowData, getRequestData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(rowData);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await userRequest.get(`/admin/getRequestByIdForAdmin?id=${rowData?.slNo}`);
      setData(res?.data?.data);
    } catch (err) {
      console.log('err:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      getData();
    }
  }, [open]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return { color: 'green', fontWeight: 'bold' };
      case 'pending':
        return { color: 'orange', fontWeight: 'bold' };
      case 'declined':
        return { color: 'red', fontWeight: 'bold' };
      default:
        return { color: 'gray', fontWeight: 'bold' };
    }
  };

  const formatStatus = (status) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'Approved';
      case 'declined':
        return 'Declined';
      case 'pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const renderSteps = (data) => {
    return Object.keys(data)
      .filter((key) => key.startsWith("step"))
      .sort((a, b) => parseInt(a.replace("step", ""), 10) - parseInt(b.replace("step", ""), 10))
      .map((stepKey) => {
        const stepDataArray = data[stepKey];
  
        return stepDataArray.map((stepData, index) => (
          <tr style={{ borderBottom: "1px solid #aeaeae" }} key={`${stepKey}-${index}`}>
            <td style={{ padding: "8px", textAlign: "center" }}>{stepData.email}</td>
            <td style={{ padding: "8px", textAlign: "center" }}>
              {stepData.createdAt ? fDate(stepData.createdAt) : "N/A"}
            </td>
            <td style={{ padding: "8px", textAlign: "center" }}>
              {stepData.status === "Pending" ? "N/A" : fDate(stepData.updatedAt)}
            </td>
            <td style={{ padding: "8px", textAlign: "center", ...getStatusStyle(stepData.status) }}>
              {formatStatus(stepData.status || "Pending")}
            </td>
            <td
              style={{
                padding: "8px",
                textAlign: "center",
                maxWidth: "30dvw",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
              title={stepData.comment}
            >
              {stepData.comment ?? "N/A"}
            </td>
          </tr>
        ));
      });
  };
  
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        keepMounted
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <div className="modal-content">
            <h3>Current Status</h3>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '200px',
                }}
              >
                <CircularProgress />
              </div>
            ) : data ? (
              <>
                <table
                  className="status-table"
                  style={{ width: '100%', borderCollapse: 'collapse' }}
                >
                  <thead>
                    <tr>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Email</th>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                        Assigned On
                      </th>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>
                        Actioned On
                      </th>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Status</th>
                      <th style={{ borderBottom: '1px solid #ddd', padding: '8px' }}>Comment</th>
                    </tr>
                  </thead>
                  <tbody>{renderSteps(data)}</tbody>
                </table>
                <RequestEditableFields
                  getRequestData={getRequestData}
                  id={rowData?._id}
                  data={{
                    reqOrderNo: rowData?.reqOrderNo,
                    refundRemark: rowData?.refundRemark,
                    rfmClearances: rowData?.rfmClearances,
                    refundSap: rowData?.refundSap,
                    utrNo: rowData?.utrNo,
                    refundDate: rowData?.refundDate,
                  }}
                />
              </>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
