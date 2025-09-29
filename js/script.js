const button = document.getElementById("startBtn");
const textarea = document.getElementById("urls");

function getUrls() {
  let rawInput = textarea.value.trim();

  // якщо користувач вставив все в лапках — приберемо їх
  if (rawInput.startsWith('"') && rawInput.endsWith('"')) {
    rawInput = rawInput.slice(1, -1);
  }

  return rawInput
    .replace(/[\r\n]+/g, "") // прибираємо переходи рядків
    .split(";") // ділимо за ;
    .map((s) => s.trim()) // прибираємо пробіли
    .filter(Boolean); // ігноруємо порожні рядки
}

button.onclick = async () => {
  directoryHandle = await window.showDirectoryPicker();

  const urls = getUrls();
  console.log(urls);

  if (urls.length === 0) {
    return;
  }

  await Promise.all(
    urls.map(async (u, i) => {
      const response = await fetch(
        `https://photo-array-proxy.onrender.com/img?url=${encodeURIComponent(
          u
        )}`
      );
      const blob = await response.blob();
      const extension = blob.type.split("/")[1] || "png";

      const fileHandle = await directoryHandle.getFileHandle(
        `image${i}.${extension}`,
        { create: true }
      );
      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    })
  );

  alert("All done!");
};
