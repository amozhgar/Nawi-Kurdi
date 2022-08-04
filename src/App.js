import React, { useEffect, useState } from "react";
import { Card, Col, Row, Input, Space, Pagination } from "antd";
import "antd/dist/antd.css";
const superagent = require("superagent");
const { Search } = Input;

const onSearch = (value) => console.log(value);

function App() {
  const [naw, setNaw] = useState([]);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState("");
  const [page, setPage] = useState(1);
  const [nawPerPage, setNawPerPage] = useState(9);

  const fetchData = async () => {
    await superagent
      .get("https://nawikurdi.com/api")
      .query({ limit: "100", offset: "1" })
      .then((res) => {
        setNaw(res.body.names);
        setTotal(res.body.names.length);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastNaw = page * nawPerPage;
  const indexOfFirstNaw = indexOfLastNaw - nawPerPage;
  const currentNaw = naw.slice(indexOfFirstNaw, indexOfLastNaw);

  return (
    <div className="site-card-wrapper">
      <Space
        direction="vertical"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "40px",
        }}
      >
        <Search
          placeholder="Search"
          allowClear
          enterButton="Search"
          size="large"
          onSearch={onSearch}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Space>
      <Row gutter={16}>
        {currentNaw.length > 0
          ? currentNaw
              .filter((val) => {
                if (search === "") {
                  return val;
                } else if (
                  val.name
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
                ) {
                  return val;
                }
              })
              .map((nawi) => (
                <Col span={8} key={nawi.nameId}>
                  <Card title={nawi.name} bordered={false}>
                    {nawi.desc}
                    <h4>{nawi.gender}</h4>
                  </Card>
                </Col>
              ))
          : null}
      </Row>
      <br />
      <br />
      <Pagination
        onChange={(val) => setPage(val)}
        current={page}
        pageSize={nawPerPage}
        total={total}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "50px",
        }}
      />
    </div>
  );
}

export default App;
