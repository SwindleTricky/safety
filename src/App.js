import "./App.css";
import "./index.css";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import img_404 from "./images/404_img.png";
import loading from "./images/loading1.gif";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

function App() {
  let urlParm = parseURLParams(window.location.href);
  const token = JSON.parse(localStorage.getItem("token"));
  const api_service = process.env.REACT_APP_API_SERVICE;
  const [data, setData] = useState();
  const [data_length, setData_length] = useState(null);
  const [Load, setLoad] = useState(true);
  const [inputsearch, setInputSearch] = useState("");
  const MySwal = withReactContent(Swal);
  const [color, setColor] = useState();
  const urlParams = new URLSearchParams(window.location.search);

  let searchParam = urlParams.get("search") ? urlParams.get("search") : "";
  let stParam = urlParams.get("st") ? urlParams.get("st") : "";
  useEffect(() => {
    async function fetchdata() {
      try {
        if (urlParm?.uid) {
          await axios
            .post(
              api_service + "/piclist",
              {
                id: urlParm.uid[0],
              },
              {
                headers: {
                  Authorization: token?.token,
                },
              }
            )
            .catch((error) => {
              MySwal.fire({
                title: "ERROR " + error.response.status,
                text:
                  error.response.status === 401
                    ? "please login"
                    : error.response.statusText,
                icon: "error",
              }).then((result) => {
                if (result.isConfirmed || result.dismiss) {
                  localStorage.clear();
                  localStorage.setItem("prev", window.location.href)
                  window.location.replace("/login");
                }
              });
            })
            .then((res) => {
              setData(res.data);
              setData_length(res.data.length);
            });
        } else {
          await axios
            .post(api_service + "/sovereq", {
              // st: urlParm?.st[0] ? urlParm.st[0] : "",
              st: urlParams.get("st") ? urlParams.get("st") : "",
              search: urlParams.get("search") ? urlParams.get("search") : "",
            })
            .then((response) => {
              setData(response.data);
              setData_length(response.data.length);
            });
        }
      } catch (err) {
        console.log(err);
      }
    }
    fetchdata();
    // eslint-disable-next-line
  }, [api_service]);
  useEffect(() => {
    if (data !== undefined) {
      setLoad(false);
    }
  }, [data]);

  if (Load) {
    console.log("LOADING..");
    return (
      <>
        <div
          style={{
            margin: "40px",
            display: "flex", // Use flexbox
            justifyContent: "center", // Center content horizontally
            alignItems: "center", // Center content vertically
            height: "70vh", // Set the height of the div to be full viewport height or any desired value
          }}
        >
          <div>
            <img width={100} height={100} src={loading} alt="Loading..."></img>
          </div>
        </div>
      </>
    );
  }
  // let data_svoe = data.svoe
  let page;

  if (urlParm?.page) {
    // console.log(page.page[0]);
    page = urlParm?.page[0];
  } else {
    page = 1;
  }

  let active = parseInt(page);
  let items = [];

  for (
    let number = 1;
    number <= Math.ceil(data === "No data response" ? 1 : data_length / 5);
    number++
  ) {
    let pages = "?page=" + number + "&search=" + searchParam + "&st=" + stParam;

    if (number <= parseInt(page) + 2 && number >= parseInt(page) - 2) {
      items.push(
        <Pagination.Item key={number} href={pages} active={number === active}>
          {number}
        </Pagination.Item>
      );
    } else if (number === parseInt(page) + 3) {
      items.push(<Pagination.Ellipsis />);
    } else if (number === parseInt(page) - 3) {
      items.push(<Pagination.Ellipsis />);
    } else if (number === 1) {
      items.push(
        <Pagination.Item key={number} href={pages} active={number === active}>
          {number}
        </Pagination.Item>
      );
    } else if (
      number === Math.ceil(data === "No data response" ? 1 : data_length / 5)
    ) {
      items.push(
        <Pagination.Item key={number} href={pages} active={number === active}>
          {number}
        </Pagination.Item>
      );
    }
  }

  let allPage = page * 5;
  let stPage = allPage - 5;

  let dataPerPage = [];
  // let imgID;
  // let imgURL = "163.50.57.177:4040/img/" + data[0]?.idReq + ".png";
  let imgURL;

  const countByStatus = {
    1: 0, // Issue
    2: 0, // Approve
    3: 0, // Pic Confirm
    4: 0, // Finish
    5: 0, // Final Approve
    6: 0, // Reject
  };
  if (data !== "No data response") {
    data.forEach((e) => {
      countByStatus[e.STATUS] += 1;
    });
  }

  const issue = countByStatus[1];
  const approve = countByStatus[2];
  const picConfirm = countByStatus[3];
  const finish = countByStatus[4];
  const finalApprove = countByStatus[5];
  const reject = countByStatus[6];

  let searchHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    console.log(lowerCase);
    setInputSearch(lowerCase);
  };
  if (data !== "No data response") {
    for (let i = stPage; i < allPage; i++) {
      if (i < data_length) {
        // if (data[i].IMG) {
        //   imgID = parseURLParams(data[i].IMG);
        //   imgURL = `https://lh3.google.com/u/0/d/${imgID.id}`;
        // }
        if (data[i].IMG.split(", ").length === 1) {
          imgURL = "http://163.50.57.177:4040/img/" + data[i].REQ_ID + ".png";
        } else {
          imgURL = "http://163.50.57.177:4040/img/" + data[i].REQ_ID + "_0.png";
        }

        dataPerPage.push(
          <Link to={"./form?req_id=" + data[i].REQ_ID}>
            <div className="card mt-2 card-custom" key={data[i.REQ_ID]}>
              <div
                className="card-body card-body-custom"
                style={{ color: "white" }}
              >
                <div className="row">
                  <div className="col-3 d-flex align-items-center justify-content-center">
                    <img
                      src={imgURL ? imgURL : img_404}
                      alt=""
                      style={{ width: "10rem", height: "10rem" }}
                    />
                  </div>
                  <div className="col-9">
                    <div className="row">
                      <div className="col-6">
                        <h4>{data[i].LOCATION_NAME}</h4>
                      </div>
                      <div className="col-6 d-flex align-items-end justify-content-end"></div>
                    </div>
                    <div className="nice-form-group">
                      <label id="timeForm">Detail: {data[i].DETAIL}</label>
                      <label id="timeForm">Type: {data[i].TYPE}</label>
                      <label id="timeForm">
                        Risk level: {data[i].RISK_LEVEL}
                      </label>
                      <label id="timeForm">Requestor: {data[i].EMP_CD}</label>
                      <label>Request time: {data[i].F_DATETIME}</label>
                      <label>Last update: {data[i].F_UPDATE}</label>
                      <div className="d-flex align-items-end justify-content-end">
                        <label
                          className={`status-${
                            data[i].STATUS === 1
                              ? "issue"
                              : data[i].STATUS === 2
                              ? "approve"
                              : data[i].STATUS === 3
                              ? "confirm"
                              : data[i].STATUS === 4
                              ? "finish"
                              : data[i].STATUS === 5
                              ? "fapprove"
                              : data[i].STATUS === 6
                              ? "reject"
                              : "Unknown data"
                          }`}
                          id="timeForm"
                        >
                          {data[i].STATUS === 1
                            ? "Issued"
                            : data[i].STATUS === 2
                            ? "Approved"
                            : data[i].STATUS === 3
                            ? "PIC Confirm"
                            : data[i].STATUS === 4
                            ? "Finish"
                            : data[i].STATUS === 5
                            ? "Final approve"
                            : data[i].STATUS === 6
                            ? "Reject"
                            : "Unknown data"}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      }
    }
  } else {
    dataPerPage.push(
      <div className="card mt-2 card-custom">
        <div className="card-body card-body-custom" style={{ color: "white" }}>
          <div className="row">
            <div className="col-3 d-flex align-items-center justify-content-center">
              <img
                src={img_404}
                alt="pe"
                style={{ width: "10rem", height: "10rem" }}
              />
            </div>
            <div className="col-9">
              <div className="row">
                <div className="col-6">
                  <h4>No data</h4>
                </div>
                <div className="col-6 d-flex align-items-end justify-content-end"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paginationBasic = (
    <div
      className="d-flex align-items-center justify-content-center mt-3"
      color="#4c4c4c"
    >
      <Pagination size="sm">{items}</Pagination>
    </div>
  );

  const statusData = [
    {
      name: "Issue",
      item: issue,
      overColor: "#1679AB",
      outColor: "rgba(67, 156, 244, 0.58)",
      st: 1,
    },
    {
      name: "Approve",
      item: approve,
      overColor: "#1679AB",
      outColor: "rgb(219 212 142)",
      st: 2,
    },
    {
      name: "PIC confirm",
      item: picConfirm,
      overColor: "#1679AB",
      outColor: "rgb(249 204 107)",
      st: 3,
    },
    {
      name: "Finish",
      item: finish,
      overColor: "#1679AB",
      outColor: "rgb(130 247 192)",
      st: 4,
    },
    {
      name: "Final Approve",
      item: finalApprove,
      overColor: "#1679AB",
      outColor: "rgb(92 197 99)",
      st: 5,
    },
    {
      name: "Reject",
      item: reject,
      overColor: "#1679AB",
      outColor: "rgb(129 129 129)",
      st: 6,
    },
  ];

  return (
    <div className="background-custom">
      <div className="container">
        <div className="row mt-2">
          <div className="col-xl-3">
            <div
              className="card text-left"
              style={{ margin: "10px 0px 5px 0px" }}
            >
              <div
                id="status_card"
                style={{ color: "white" }}
                className="card-body card-body-custom"
              >
                {statusData.map((e) => {
                  return (
                    <>
                      <div
                        style={{
                          backgroundColor: color ? color : e.outColor,
                          borderRadius: "0.5rem",
                        }}
                      >
                        <a className="hash-tag" href={`./?st=${e.st}`}>
                          <p style={{ margin: "10px", padding: "5px 10px" }}>
                            <b>{e.name} : </b>
                            {e.item}
                          </p>
                        </a>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="col-xl-9">
            <div
              className="card text-center"
              style={{ margin: "10px 0px 5px 0px" }}
              color="#464749"
            >
              <div className="card-body card-body-custom">
                <div>
                  <div
                    className="row"
                    style={{ paddingTop: "15px" }}
                    color="#464749"
                  >
                    <div className="col-10">
                      <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlInput1"
                      >
                        <Form.Control
                          className="input-custom"
                          type="email"
                          placeholder="Input keyword for search"
                          onChange={searchHandler}
                        />
                      </Form.Group>
                    </div>
                    <div className="col-2">
                      <Button
                        className="button-custom"
                        variant="warning"
                        style={{ width: "100%" }}
                        onClick={() => {
                          console.log(inputsearch);
                          window.location.replace("/?search=" + inputsearch);
                        }}
                      >
                        {" "}
                        Search{" "}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {dataPerPage}
            {paginationBasic}
          </div>
        </div>
      </div>
    </div>
  );
  function parseURLParams(url) {
    var queryStart = url.indexOf("?") + 1,
      queryEnd = url.indexOf("#") + 1 || url.length + 1,
      query = url.slice(queryStart, queryEnd - 1),
      pairs = query.replace(/\+/g, " ").split("&"),
      parms = {},
      i,
      n,
      v,
      nv;
    if (query === url || query === "") return;
    for (i = 0; i < pairs.length; i++) {
      nv = pairs[i].split("=", 2);
      n = decodeURIComponent(nv[0]);
      v = decodeURIComponent(nv[1]);
      if (!parms.hasOwnProperty(n)) parms[n] = [];
      parms[n].push(nv.length === 2 ? v : null);
    }
    return parms;
  }
}

export default App;
