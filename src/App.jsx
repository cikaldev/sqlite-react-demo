import { useState } from "react";
import useContact from "./lib/use-contact";
import ContactForm from "./components/ContactForm";

export default function App() {
  const [editingUser, setEditingUser] = useState(null);
  const { loading, contacts, patchData, postData, deleteData } = useContact();

  const handleSubmit = async (data, isEditMode) => {
    if (isEditMode) {
      await patchData(data);
    } else {
      await postData(data);
    }
    setEditingUser(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>React Demo</h1>
        <p>SQLite-over-HTTP Database CRUD Example</p>
        <p className="nav">
          <a href="https://gate.warungds.com" target="_blank">Documentation</a>
          <spa>&bull;</spa>
          <a href="https://gate.warungds.com/sdk/js/index.js" target="_blank">SDK</a>
          <spa>&bull;</spa>
          <a href="https://github.com/cikaldev/sqlite-react-demo" target="_blank">Github</a>
        </p>
      </header>

      <main>
        <ContactForm
          key={editingUser ? editingUser.id : "new"}
          data={editingUser}
          onSubmit={handleSubmit}
          onCancel={() => setEditingUser(null)}
        />

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="status-cell">
                    <span className="animate-pulse">[LOADING_DATA...]</span>
                  </td>
                </tr>
              ) : contacts.length ? (
                contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td className="td-id">#{contact.id}</td>
                    <td className="td-name">{contact.name}</td>
                    <td>{contact.phone}</td>
                    <td className="text-right">
                      <button
                        onClick={() => setEditingUser(contact)}
                        className="action-link"
                      >
                        [EDIT]
                      </button>
                      <button
                        onClick={() => deleteData(contact.id)}
                        className="action-link text-danger"
                      >
                        [DELETE]
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="status-cell">
                    NO_RECORDS_FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
