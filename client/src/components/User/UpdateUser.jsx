import { useState } from "react";
import api from "../../api/api";

export default function UpdateUser({ userId }) {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const { data } = await api.put(`/users/${userId}`, formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessage(`✅ Updated ${data.name}`);
    } catch (err) {
      setMessage("❌ Failed to update user");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Update User</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" placeholder="New Name" onChange={handleChange} className="border p-2 w-full" />
        <input name="email" placeholder="New Email" onChange={handleChange} className="border p-2 w-full" />
        <button type="submit" className="bg-yellow-500 text-white px-4 py-2 rounded">Update</button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
