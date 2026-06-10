import { useEffect, useState } from "react";
import db from "./db";

const useContact = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const data = await db.table("contacts").get();
        if (!ignore) {
          setContacts(data || []);
        }
      } catch (err) {
        if (err.message && err.message.toLowerCase().includes("no such table")) {
          try {
            await db.createTable("contacts", {
              name: "TEXT",
              phone: "TEXT",
            });
            if (!ignore) {
              setContacts([]);
            }
          } catch (createErr) {
            console.error("Failed to auto-create contacts table:", createErr);
          }
        } else {
          console.error("Error fetching contacts:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const postData = async (form) => {
    setLoading(true);
    try {
      const data = await db.table("contacts").insert(form);
      if (data.id) {
        setContacts((prev) => [...prev, { id: data.id, ...form }]);
      }
    } catch (err) {
      console.error("Error creating contact:", err);
    } finally {
      setLoading(false);
    }
  };

  const patchData = async (form) => {
    setLoading(true);
    try {
      const { id, ...updatePayload } = form;
      await db.table("contacts").update(updatePayload, { id });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, ...updatePayload } : c))
      );
    } catch (err) {
      console.error("Error updating contact:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteData = async (id) => {
    try {
      await db.table("contacts").delete({ id });
      setContacts((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      console.error("Error deleting contact:", err);
    }
  };

  return {
    loading,
    setLoading,
    contacts,
    postData,
    patchData,
    deleteData,
  };
};

export default useContact;
