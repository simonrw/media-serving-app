const apiId = "e7fa16afb26f49fa8a38521fc2";
const apiKey = "0c8a4964";

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


