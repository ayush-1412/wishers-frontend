import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

function EditWish() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [birthdayName, setBirthdayName] = useState("");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch existing wish data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const fetchWish = async () => {
      try {
        const res = await api.get(`/api/wish/${id}`);
        setBirthdayName(res.data.birthdayName);
        setMessage(res.data.message);
        setImageUrl(res.data.imageUrl);
      } catch {
        alert("Failed to load wish");
      }
    };

    fetchWish();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!birthdayName || !message) {
      alert("Name and message are required");
      return;
    }

    try {
      setLoading(true);

      let finalImageUrl = imageUrl;

      // 🔹 If user selected a new image, upload it
      if (newImage) {
        const formData = new FormData();
        formData.append("image", newImage);

        const uploadRes = await api.post("/api/wish/upload", formData);
        finalImageUrl = uploadRes.data.imageUrl;
      }

      // 🔹 Update wish
      await api.put(`/api/wish/${id}`, {
        birthdayName,
        message,
        imageUrl: finalImageUrl,
      });

      // 🔹 Go back to wish page (creator mode)
      navigate(`/wish/${id}?owner=true`);
    } catch (err) {
      alert("Failed to update wish");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-100">

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl
        animate-fadeIn"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">
          Edit Birthday Wish ✏️
        </h2>

        <input
          type="text"
          placeholder="Birthday person's name"
          className="w-full border p-2 mb-3 rounded"
          value={birthdayName}
          onChange={(e) => setBirthdayName(e.target.value)}
        />

        <textarea
          placeholder="Your message"
          className="w-full border p-2 mb-3 rounded"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Existing image preview */}
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Current"
            className="w-full h-40 object-cover rounded mb-3"
          />
        )}

        <input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setNewImage(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700
          transition text-white py-2 rounded-xl"
        >
          {loading ? "Updating..." : "Update Wish"}
        </button>
      </form>
    </div>
  );
}

export default EditWish;
