const apiId = "092ff22d9c22406bb2599a973a";
const apiKey = "f5a341ac";
const bucketName = "videoondemand-source71e471f1-17514202";

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


