import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function CreateWish() {
  const navigate = useNavigate();

  // protect route
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const [birthdayName, setBirthdayName] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!birthdayName || !message || !image) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);

      // upload image
      const formData = new FormData();
      formData.append("image", image);
      const uploadRes = await api.post("/api/wish/upload", formData);

      // create wish
      const wishRes = await api.post("/api/wish", {
        birthdayName,
        message,
        imageUrl: uploadRes.data.imageUrl,
      });

      // ✅ IMPORTANT: creator lands with owner=true
      navigate(`/wish/${wishRes.data._id}?owner=true`);

    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded shadow"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create Birthday Wish 🎉
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

        <input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creating..." : "Create Wish"}
        </button>
      </form>
    </div>
  );
}

export default CreateWish;
