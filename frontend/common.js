const apiId = "25b9ccbf8ada43bdaac769bb26";
const apiKey = "3cfb7503";
const bucketName = "cdkstack-testbucket560b80bc-7664ed50";

const appsyncUrl = () => {
  return `http://localhost:4566/graphql/${apiId}`;
};

const graphQLRequest = async (name, query, params) => {
  const res = await fetch(appsyncUrl(), {
    method: "POST",
    headers: {
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      query,
      variables: params,
      operationName: name,
    }),
  });

  // TODO: check status code

  const { data, errors } = await res.json();
  if (errors) {
    throw errors;
  }

  return data;
};


