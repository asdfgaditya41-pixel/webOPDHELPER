import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where, doc } from "firebase/firestore";
import { db } from "../services/firebase";

/**
 * useRealtimeCollection
 * @param {string} path - The collection path or full document path.
 * @param {object} options - { queryConstraints: [], isDocument: false }
 */
export const useRealtimeCollection = (path, { queryConstraints = [], isDocument = false } = {}) => {
  const [data, setData] = useState(isDocument ? null : []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!path) return;

    if (isDocument) {
      const docRef = doc(db, path);
      const unsub = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          setData({ id: docSnap.id, ...docSnap.data() });
        } else {
          setData(null);
        }
        setLoading(false);
      });
      return () => unsub();
    } else {
      const colRef = collection(db, path);
      const q = queryConstraints.length > 0 ? query(colRef, ...queryConstraints) : colRef;

      const unsub = onSnapshot(q, (snapshot) => {
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setData(result);
        setLoading(false);
      });
      return () => unsub();
    }
  }, [path, JSON.stringify(queryConstraints), isDocument]);

  return { data, loading };
};
