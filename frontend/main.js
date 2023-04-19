const bucketName = "cdkstack-testbucket560b80bc-4c0079c2";

const registerItem = async (file) => {
  const id = window.uuid.v4();
  let { register: url } = await graphQLRequest(
    "RegisterItem",
    `
    mutation RegisterItem($id:ID!, $name:String!, $type:String!) {
      register(id: $id, name: $name, type: $type)
    }
    `,
    { id, type: file.type }
  );

  return id;
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
  const id = await registerItem(file);
  window.AWS.config.update({ accessKeyId: 'access-key', secretAccessKey: 'access-pass', endpoint, })

  const s3 = new window.AWS.S3({
    region: "us-east-1",
    signatureVersion: "v4",
    endpoint,
  });

  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: bucketName,
      Key: id,
      Body: file,
      ContentType: file.type,
    },
    endpoint,
  });
  const promise = upload.promise();
  promise.then(() => console.log("Successfully uploaded file"), (err) => console.error("Failed to upload", err));


  // const url = s3.getSignedUrl("putObject", {
  //   Bucket: bucketName,
  //   Key: id,
  //   Expires: 3600,
  // });

  // await putObject(file, url);
};

// const putObject = async (file, url) => {
//   const upload = new S3.ManagedUpload({
//     params: {
//       Bucket: bucketName,
//       Key: 
//     },
//   });
//   // const res = await fetch(url, {
//   //   method: "PUT",
//   //   body: file,
//   //   headers: {
//   //     "Content-Type": file.type,
//   //   },
//   // });
// };

document.addEventListener('DOMContentLoaded', async () => {

  const uploadRegisterElem = document.getElementById("form");
  uploadRegisterElem.addEventListener('submit', uploadFile);
});
