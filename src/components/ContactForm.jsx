import { useState } from "react";

export default function ContactForm({ data, onSubmit, onCancel }) {
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(data);
  const [form, setForm] = useState({
    name: data ? data.name : "",
    phone: data ? data.phone : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = isEditMode ? { ...form, id: data.id } : form;
    await onSubmit(payload, isEditMode);
    if (!isEditMode) {
      setForm({ name: "", phone: "" });
    }
    setLoading(false);
  };

  const handleCancel = (e) => {
    e.preventDefault();
    if (onCancel) {
      onCancel();
    } else {
      setForm({ name: "", phone: "" });
    }
  };

  return (
    <div className="form-card">
      <h3 className="form-title">
        {isEditMode ? "Edit Contact" : "Add Contact"}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
            placeholder="John Doe"
            required
          />
        </div>
        <div className="form-group">
          <label>Phone</label>
          <input
            type="number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
            placeholder="08123456789"
            required
          />
        </div>
        <div className="btn-group">
          <button type="submit" disabled={loading} className="btn btn-primary">
            {isEditMode ? "UPDATE" : "CREATE"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="btn btn-secondary"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
}
