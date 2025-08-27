import api from "../../api/api";

export default function DeleteUser({ userId }) {
  const handleDelete = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      await api.delete(`/users/${userId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert("✅ User deleted successfully");
    } catch (err) {
      alert("❌ Error deleting user");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Delete User
    </button>
  );
}
