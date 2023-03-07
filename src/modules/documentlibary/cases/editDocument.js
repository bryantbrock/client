export async function editDocument(documentData) {
  const response = await fetch("/api/library/documents/update-document", {
    method: "POST",
    headers: {
      "Content-type": "json/application",
    },
    body: JSON.stringify({
      id: documentData.id,
      name: documentData.name || null,
      description: documentData.description || null,
      tags: documentData.tags || null, // null when the version is greater than 1
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
