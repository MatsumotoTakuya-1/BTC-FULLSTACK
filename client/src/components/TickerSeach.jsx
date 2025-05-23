import axios from "axios";
import { useState } from "react";
import {
  Button,
  TextField,
  Box,
  Container,
  Table,
  TableHead,
} from "@mui/material";

import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

function TickerSeach() {
  const [companyName, setCompanyName] = useState("");
  const [ticker, setTicker] = useState([]);
  const [toggle, setToggle] = useState(false);

  const processingSeach = async () => {
    try {
      const res = await axios.post("/api/predict/ticker", { companyName });
      // console.log(res.data.seach);
      setTicker(
        res.data.seach.map((item) => ({
          shortname: item.shortname,
          symbol: item.symbol,
        }))
      );
      setCompanyName("");
    } catch (err) {
      alert("検索失敗");
      console.error(err);
    }
  };

  const toggleMenu = () => {
    setToggle(!toggle);
  };
  return (
    <div>
      <Container maxWidth="md" sx={{ mt: 1, mb: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          // alignItems="center"
          mb={1}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              processingSeach();
            }}
          >
            <TextField
              label="企業名"
              placeholder="company name"
              variant="outlined"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 2 }}
            >
              ティッカー検索
            </Button>
          </form>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          // alignItems="center"
          mb={1}
        >
          <Button variant="contained" color="primary" onClick={toggleMenu}>
            {toggle ? "🔼閉じる" : "🔽開く"}
          </Button>
        </Box>

        {toggle && (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="light">企業名</TableCell>
                  <TableCell align="light">ティッカー</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ticker.map((item) => (
                  <TableRow
                    key={item.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="light">{item.shortname}</TableCell>
                    <TableCell align="light">{item.symbol}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* {toggle && (
          <table>
            <thead>
              <tr>
                <th>企業名</th>
                <th>ティッカー</th>
              </tr>
            </thead>
            {ticker.map((item) => (
              <tr key={item.id}>
                <td>{item.shortname}</td>
                <td>{item.symbol}</td>
              </tr>
            ))}
          </table>
        )} */}
      </Container>
    </div>
  );
}

export default TickerSeach;
