const registerItem = async () => {
};

const uploadFile = async (e) => {
  e.preventDefault();

  const res = await registerItem();

  const f = new FormData(e.target);
  const file = f.get('file');
  if (!file) {
    alert("No file chosen");
  }
};

document.addEventListener('DOMContentLoaded', async () => {

  const uploadRegisterElem = document.getElementById("form");
  uploadRegisterElem.addEventListener('submit', uploadFile);

});
