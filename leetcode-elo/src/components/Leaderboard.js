import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  List,
  ListItem,
  Grid,
  Box,
  CircularProgress,
  TextField,
  CardActionArea,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import RemoveIcon from "@mui/icons-material/Remove";

const CustomCard = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
  transition: "0.3s",
  "&:hover": {
    transform: "scale(1.02)",
    boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
  },
}));

const ImageContainer = styled(Paper)(({ theme }) => ({
  height: 200,
  width: "100%",
  backgroundImage: `url(${process.env.PUBLIC_URL}/purple_squirrel.png)`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  marginBottom: theme.spacing(2),
}));

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch(
          `${process.env.PUBLIC_URL}/users_by_elo.json`
        );
        const data = await response.json();
        data.sort((a, b) => b.current_problem_delta - a.current_problem_delta);
        setLeaderboard(data);
      } catch (error) {
        console.error("Failed to fetch leaderboard data:", error);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleCardClick = (profileName) => {
    window.open(`https://leetcode.com/${profileName}`, "_blank");
  };

  const filteredLeaderboard = searchTerm
    ? leaderboard.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : leaderboard;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentDate = new Date();
  const currentMonthName = monthNames[currentDate.getMonth()];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={4}>
          <ImageContainer />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
          >
            {currentMonthName} Leetcode Challenge
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx={{ fontFamily: "'Roboto', sans-serif", fontWeight: 500 }}
          >
            Solve 30 Problems for month of {currentMonthName}
          </Typography>
        </Grid>
      </Grid>
      <TextField
        fullWidth
        label="Search by username"
        variant="outlined"
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Grid container spacing={2} sx={{ fontWeight: "bold" }}>
        <Grid item xs={2}>
          NAME (USERNAME)
        </Grid>
        <Grid item xs={2}>
          CONTEST RATING
        </Grid>
        <Grid item xs={2}>
          RATING CHANGE
        </Grid>
        <Grid item xs={3}>
          NEW PROBLEMS SOLVED THIS MONTH
        </Grid>
        <Grid item xs={3}>
          TOTAL PROBLEMS SOLVED
        </Grid>
      </Grid>
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {filteredLeaderboard.map((user, index) => (
          <CustomCard key={index}>
            <CardActionArea onClick={() => handleCardClick(user.username)}>
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <ListItem
                    alignItems="center"
                    sx={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center", // Centers content within ListItem
                    }}
                  >
                    <Typography
                      variant="h6"
                      component="span"
                      sx={{
                        fontFamily: "'Roboto', sans-serif",
                        textAlign: "center",
                        width: "100%", // Ensures text fills the available width
                      }}
                    >
                      #{index + 1} {user.name} ({user.username})
                    </Typography>
                  </ListItem>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "'Roboto', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    {user.elo}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={2}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  {user.prev_elo !== undefined && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        bgcolor: "rgba(0,0,0,0.1)",
                        p: 0.5,
                        borderRadius: 1,
                        width: "fit-content",
                      }}
                    >
                      {user.elo > user.prev_elo ? (
                        <ArrowUpwardIcon sx={{ color: "green" }} />
                      ) : user.elo < user.prev_elo ? (
                        <ArrowDownwardIcon sx={{ color: "red" }} />
                      ) : (
                        <RemoveIcon sx={{ color: "grey" }} />
                      )}
                      <Typography
                        variant="subtitle2"
                        component="span"
                        sx={{ fontFamily: "'Roboto', sans-serif", ml: 0.5 }}
                      >
                        {user.elo - user.prev_elo} since last contest
                      </Typography>
                    </Box>
                  )}
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "'Roboto', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    {user.current_problem_delta ?? 0}
                  </Typography>
                </Grid>
                <Grid
                  item
                  xs={3}
                  sx={{ display: "flex", justifyContent: "center" }}
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      fontWeight: "bold",
                      fontFamily: "'Roboto', sans-serif",
                      textAlign: "center",
                    }}
                  >
                    {user.current_problem_count ?? 0}
                  </Typography>
                </Grid>
              </Grid>
            </CardActionArea>
          </CustomCard>
        ))}
      </List>
    </Container>
  );
}

export default Leaderboard;
