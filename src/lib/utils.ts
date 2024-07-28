interface Video {
  id: number,
  file_name: String,
  file_path: String,
  index: number,
  delete: String,
}

const getIndexedDB = () => {
  const indexedDB =
    window.indexedDB ||
    (window as any).mozIndexedDB ||
    (window as any).webkitIndexedDB ||
    (window as any).msIndexedDB ||
    (window as any).shimIndexedDB;
  if (!indexedDB) {
    console.log("IndexedDB could not be found in this browser.");
    return null;
  }
  return indexedDB;
}

export const SaveAllRecordsToIndexedDB = (objects: Array<Video>) => {
  const indexDB = initIndexedDB();
  if (!indexDB) return;
  const request = indexDB.open("videosDatabase", 1);
  request.onsuccess = function () {
    console.log("Database opened successfully");
    const db = request.result;
    const transaction = db.transaction("videos", "readwrite");
    const store = transaction.objectStore("videos");
    for (let i = 0; i < objects.length; i++) {
      let object = objects[i];
      if (object.id && object.id !== -1) {
        if(object.delete == '0') {
          // Update video object
          const updateRequest = store.put(object);
          updateRequest.onsuccess = () => {
            console.log('successfully updated an object');
          };
          updateRequest.onerror = () => {
            console.log('error in request to update');
          };
        } else {
          // Delete video object
          const deleteRequest = store.delete(object.id);
          deleteRequest.onsuccess = () => {
            console.log('successfully delete an object');
          };
          deleteRequest.onerror = () => {
            console.log('error in request to delete');
          };
        }
      } else {
        // Create new video object
        const createRequest = store.add(object);
        createRequest.onsuccess = () => {
          console.log('successfully add an object');
        };
        createRequest.onerror = () => {
          console.log('error in request to update');
        };
      }
    }
  }
}

export const getAllRecordsFromDB = () => {
  return new Promise(function (resolve) {
    const indexDB = initIndexedDB();
    if (!indexDB) return;
    const request = indexDB.open("videosDatabase", 1);
    request.onsuccess = function () {
      console.log("Database opened successfully");
      const db = request.result;
      const transaction = db.transaction("videos", "readwrite");
      const store = transaction.objectStore("videos");
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = (ev) => {
        const req: any = ev.target;
        return resolve(req.result);
        //move on to the next request in the transaction or
        //commit the transaction
      };
    }
  })
}

export const initIndexedDB = () => {
  const indexDB = getIndexedDB();
  if (indexDB === null) return;
  const request = indexDB.open("videosDatabase", 1);
  request.onupgradeneeded = function () {
    const db = request.result;
    db.createObjectStore("videos", { keyPath: "id", autoIncrement: true });
  }

  request.onerror = function (event) {
    console.error("An error occurred with IndexedDB");
    console.error(event);
  };
  return indexDB;
}

export const formDataToObject = (formData: any): any => {
  let data: any = {};
  Object.keys(formData).forEach(key => {
    const [subkey, field] = key.split('.');
    if (!data[subkey]) {
      data[subkey] = {};
    }
    if (field === 'id' && formData[key] == -1) {
      return;
    }
    if(field === 'id') {
      data[subkey][field] = parseInt(formData[key]);
    } else {
      data[subkey][field] = formData[key];
    }
  });
  return Object.keys(data).map(idx => data[idx]);
}