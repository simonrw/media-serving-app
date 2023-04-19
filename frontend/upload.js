const registerItem = async (file) => {
  const id = window.uuid.v4();
  let { register: url } = await graphQLRequest(
    "RegisterItem",
    `
    mutation RegisterItem($id:ID!, $name:String!, $type:String!) {
      register(id: $id, name: $name, type: $type)
    }
    `,
    { id, name: file.name, type: file.type }
  );

  return url.replace("172.17.0.2", "localhost.localstack.cloud");
};

const uploadFile = async (e) => {
  e.preventDefault();

  const input = document.querySelector("input#file");
  if (!input.files || !input.files.length) {
    console.error("no files attached");
  }
  const file = input.files[0];
  if (!file) {
    alert("No file chosen");
  }

  const endpoint = new AWS.Endpoint("http://localhost.localstack.cloud:4566");
  const url = await registerItem(file);

  await putObject(file, url);

};

const putObject = async (file, url) => {
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "video/mp4",
    },
    body: file,
  });

  // TODO: status code
};

document.addEventListener('DOMContentLoaded', async () => {

  // add form
  const form = document.getElementById("form");
  form.addEventListener('submit', uploadFile);
});
