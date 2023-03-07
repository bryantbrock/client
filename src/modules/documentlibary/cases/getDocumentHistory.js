export async function getDocumentHistory(documentID) {
  const response = await fetch("/api/library/documents/get-document-history", {
    method: "POST",
    headers: {
      "Content-type": "json/application",
    },
    body: JSON.stringify({
      id: documentID,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });

  return response;
}
