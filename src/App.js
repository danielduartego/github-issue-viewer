import "./App.css";
import IconClose from "./assets/close.svg";
import IconIssueClosed from "./assets/issue-closed.svg";
import IconPullRequest from "./assets/pull-request.svg";
import React, { Component } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";

export class App2 extends Component {
  constructor(props) {
    super();
    this.state = {
      alert: false,
      searching: true,
      isLoading: false,
      isLoadingMore: false,
      noIssues: false,
      gitInput: "",
      issues: [],
      state: "all",
      page: 1,
    };
  }

  onKeyPress = (e) => {
    if (e.which === 13)
      if (
        this.state.gitInput !== "" &&
        this.state.gitInput.includes("github.com")
      ) {
        this.setState({
          isLoading: true,
        });
        this.handleSearch();
      } else {
        this.setAlert();
      }
  };

  setAlert = () => {
    this.setState({ alert: true, isLoading: false });
    setTimeout(() => {
      this.setState({ alert: false });
    }, 3000);
  };

  handleSearch = async () => {
    let userRepo = this.state.gitInput.split("github.com")[1].split("/");
    let user = userRepo[1];
    let repo = userRepo[2];
    let url = "";

    if (user.length > 0 && repo.length > 0) {
      if (this.state.state === "pulls") {
        url = `https://api.github.com/repos/${user}/${repo}/pulls?filter=all&page=${this.state.page}&per_page=51`;
      } else {
        url = `https://api.github.com/repos/${user}/${repo}/issues?filter=all&page=${this.state.page}&state=${this.state.state}&per_page=51`;
      }

      fetch(url, { Accept: "application/vnd.github.v3+json" })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            const err = new Error("Not 2xx response");
            err.res = res;
            throw err;
          }
        })
        .then((result) => {
          if (result.length > 0) {
            let newIssues = this.state.issues.concat(result);
            this.setState({
              issues: newIssues,
              isLoading: false,
              isLoadingMore: false,
              searching: false,
              noIssues: false,
            });
          } else {
            this.setState({
              isLoading: false,
              isLoadingMore: false,
              searching: false,
              noIssues: true,
            });
          }
        })
        .catch((error) => {
          this.setAlert();
        });
    } else {
      this.setAlert();
    }
  };

  handleLoadMore = () => {
    this.setState(
      { page: this.state.page + 1, isLoadingMore: true },
      this.handleSearch
    );
  };

  handleState = (newState) => {
    this.setState(
      {
        isLoading: true,
        issues: [],
        page: 1,
        state: newState,
      },
      this.handleSearch
    );
  };

  newSearch = () => {
    this.setState({ searching: true, issues: [], page: 1, state: "all" });
  };

  render() {
    let {
      alert,
      searching,
      isLoading,
      isLoadingMore,
      issues,
      gitInput,
      state,
      noIssues,
    } = this.state;
    return (
      <div>
        {searching ? (
          <div className="search">
            {alert ? (
              <Alert
                severity="error"
                className="alert"
                onClose={() => {
                  this.setState({ alert: false });
                }}
              >
                Please provide a GitHub Repository url
              </Alert>
            ) : null}
            <Container maxWidth="xl">
              {isLoading ? (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  sx={{
                    mt: 3,
                    mb: 3,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                  }}
                >
                  <CircularProgress style={{ color: "black" }} />
                </Grid>
              ) : (
                <Grid
                  xs={12}
                  sm={12}
                  container
                  item
                  direction="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Typography variant="h4" style={{ color: "black" }}>
                    GitHub Issue Viewer
                  </Typography>

                  <TextField
                    variant="outlined"
                    placeholder="Paste a link to a GitHub repo"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                    name="gitInput"
                    onChange={(e) =>
                      this.setState({ gitInput: e.target.value })
                    }
                    onKeyPress={this.onKeyPress}
                    sx={{ mt: 3 }}
                    className="input-field"
                  />
                </Grid>
              )}
            </Container>
          </div>
        ) : (
          <div>
            <AppBar position="static" color="default" elevation={0}>
              <Toolbar>
                <Typography variant="h5" sx={{ flexGrow: 1 }}>
                  GitHub Issue Viewer
                </Typography>
                <Typography variant="h5">{gitInput}</Typography>
              </Toolbar>
            </AppBar>

            <Container maxWidth="xl" sx={{ mb: 5 }}>
              <Grid container sx={{ mt: 3, mb: 3 }}>
                <Grid
                  xs={12}
                  sm={6}
                  container
                  item
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Link
                    component="button"
                    color="inherit"
                    variant="h6"
                    underline={state === "all" ? "always" : "hover"}
                    onClick={() => this.handleState("all")}
                  >
                    All Issues
                  </Link>
                  <Link
                    component="button"
                    color="inherit"
                    variant="h6"
                    underline={state === "open" ? "always" : "hover"}
                    onClick={() => this.handleState("open")}
                  >
                    Open Issues
                  </Link>
                  <Link
                    component="button"
                    color="inherit"
                    variant="h6"
                    underline={state === "closed" ? "always" : "hover"}
                    onClick={() => this.handleState("closed")}
                  >
                    Closed Issues
                  </Link>
                  <Link
                    component="button"
                    color="inherit"
                    variant="h6"
                    underline={state === "pulls" ? "always" : "hover"}
                    onClick={() => this.handleState("pulls")}
                  >
                    Pull Request
                  </Link>
                </Grid>

                <Grid
                  xs={12}
                  sm={6}
                  container
                  item
                  direction="row"
                  justifyContent="flex-end"
                >
                  <IconButton
                    aria-label="delete"
                    size="large"
                    onClick={this.newSearch}
                  >
                    <img src={IconClose} className="icon-close" alt="close" />
                  </IconButton>
                </Grid>
              </Grid>

              <div>
                {isLoading ? (
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <CircularProgress style={{ color: "black" }} />
                  </Grid>
                ) : (
                  <Grid container spacing={4}>
                    {issues.map((issue) => (
                      <Grid item key={issue.id} xs={12} sm={6} md={4}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="h2"
                            >
                              {issue.state === "closed" ? (
                                <img
                                  src={IconIssueClosed}
                                  className="icon-issue-closed"
                                />
                              ) : null}
                              {typeof issue.pull_request !== "undefined" ? (
                                <img
                                  src={IconPullRequest}
                                  className="icon-pull-request"
                                />
                              ) : null}
                              {issue.title !== "" && issue.title.length > 70
                                ? issue.title.substring(0, 70) + "..."
                                : issue.title}
                            </Typography>
                            <Typography>
                              {issue.body !== null && issue.body.length > 150
                                ? issue.body.substring(0, 150) + "..."
                                : issue.body}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            {issue.labels.length > 0
                              ? issue.labels.map((label) => (
                                  <Chip
                                    key={label.id}
                                    label={label.name}
                                    style={{
                                      backgroundColor: "#" + label.color,
                                    }}
                                    variant={
                                      label.color === "ffffff"
                                        ? "outlined"
                                        : null
                                    }
                                    size="small"
                                  />
                                ))
                              : null}
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}

                {!noIssues ? (
                  <div>
                    {isLoadingMore ? (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        sx={{
                          mt: 3,
                          mb: 3,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <CircularProgress style={{ color: "black" }} />
                      </Grid>
                    ) : null}

                    <Button
                      color="inherit"
                      variant="outlined"
                      size="large"
                      fullWidth
                      sx={{ mt: 5 }}
                      onClick={this.handleLoadMore}
                    >
                      Load More
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Container maxWidth="xl">
                      <Grid
                        xs={12}
                        sm={12}
                        sx={{ mt: 15 }}
                        container
                        item
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Typography variant="h4" style={{ color: "black" }}>
                          No issues to display
                        </Typography>
                      </Grid>
                    </Container>
                  </div>
                )}
              </div>
            </Container>
          </div>
        )}
      </div>
    );
  }
}

export default App2;
