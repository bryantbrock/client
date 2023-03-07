export async function createNewDocument(documentData) {
  const response = await fetch("/api/library/documents/create-new-document", {
    method: "POST",
    headers: {
      "Content-type": "json/application",
    },
    body: JSON.stringify({
      name: documentData.name || null,
      description: documentData.description || null,
      is_template: documentData.is_template,
      parent_id: documentData.parent_id,
      client_id: documentData.client_id,
      path: documentData.path,
      tags: documentData.tags || null, // null when the version is greater than 1
      version: documentData.version || 1,
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
