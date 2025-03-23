import { Box, Button, MenuItem, Select, Typography } from "@mui/material";

const CustomPagination = ({ total, rowsPerPage, page, onPageChange, onRowsPerPageChange }) => {
    const totalPages = Math.ceil(total / rowsPerPage);
  
    return (
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 2 }}>
        {/* Showing Results Text */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ fontSize: "14px", color: "#555" }}>Showing:</Typography>
          <Select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(e.target.value)}
            sx={{
              mx: 1,
              "& .MuiSelect-select": { fontSize: "14px", padding: "4px 8px" },
            }}
          >
            {[5, 10, 15].map((count) => (
              <MenuItem key={count} value={count}>
                {count}
              </MenuItem>
            ))}
          </Select>
          <Typography sx={{ fontSize: "14px", color: "#555" }}>of {total}</Typography>
        </Box>
  
        {/* Pagination Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            size="small"
            disabled={page === 0}
            onClick={() => onPageChange(page - 1)}
            sx={{
              fontSize: "14px",
              minWidth: "32px",
              backgroundColor: page === 0 ? "#f0f0f0" : "transparent",
              "&:hover": { backgroundColor: "#e6e6e6" },
            }}
          >
            Prev
          </Button>
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              size="small"
              onClick={() => onPageChange(index)}
              sx={{
                fontSize: "14px",
                minWidth: "32px",
                color: index === page ? "#fff" : "#555",
                backgroundColor: index === page ? "#377dff" : "transparent",
                "&:hover": { backgroundColor: index === page ? "#377dff" : "#e6e6e6" },
              }}
            >
              {index + 1}
            </Button>
          ))}
          <Button
            size="small"
            disabled={page === totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            sx={{
              fontSize: "14px",
              minWidth: "32px",
              backgroundColor: page === totalPages - 1 ? "#f0f0f0" : "transparent",
              "&:hover": { backgroundColor: "#e6e6e6" },
            }}
          >
            Next
          </Button>
        </Box>
      </Box>
    );
  };

  export default CustomPagination