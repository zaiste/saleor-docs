import React from "react";
import GraphiQL from "graphiql";
import fetch from "isomorphic-fetch";

import "./styles.css";

const loginMutation = `mutation {
    tokenCreate(email: "admin@example.com", password: "admin") {
    token
  }
}`

const fetcher = async params => {
  const loginData = await fetch("http://localhost:8000/graphql/", {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({"query": loginMutation})
  })
  const token = (await loginData.json()).data.tokenCreate.token;
  console.log(token);
  const data = await fetch("http://localhost:8000/graphql/", {
    method: "post",
    headers: { "content-type": "application/json", "Authorization": `JWT ${token}`},
    body: JSON.stringify(params)
  });
  return data.json();
};

const GraphQL = ({ height = 20, query, response=undefined, readOnly=false }) => (
  <div className={readOnly ? "graphql-example read-only" : "graphql-example"} style={{ height: `${height}rem` }}>
    <GraphiQL response={response} fetcher={fetcher} query={query} readOnly={readOnly} >
      <GraphiQL.Logo>
        {readOnly ? "GraphQL Read only example" : "GraphQL Example"}
      </GraphiQL.Logo>
      <GraphiQL.Toolbar />
    </GraphiQL>
  </div>
);

export default GraphQL;
