import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import confetti from "canvas-confetti";

function WishPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isOwner = searchParams.get("owner") === "true";

  const [wish, setWish] = useState(null);
  const [copied, setCopied] = useState(false);
  const confettiPlayed = useRef(false);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/wish/${id}`)
      .then((res) => setWish(res.data));
  }, [id]);

  // 🎊 Confetti once
  useEffect(() => {
    if (wish && !confettiPlayed.current) {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#06b6d4", "#22c55e", "#f97316"],
      });
      confettiPlayed.current = true;
    }
  }, [wish]);

  const handleShare = async () => {
    const shareLink = `${window.location.origin}/wish/${id}`;
    await navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!wish) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading your wish…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4
      bg-linear-to-br from-slate-100 via-indigo-50 to-cyan-100">

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl
        p-6 md:p-10 grid md:grid-cols-2 gap-8 animate-fadeIn">

        {/* Image */}
        <div className="overflow-hidden rounded-2xl">
          <img
            src={wish.imageUrl}
            alt="Birthday"
            className="w-full h-full object-cover
              hover:scale-105 transition duration-500"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">
            Happy Birthday, {wish.birthdayName} 🎉
          </h1>

          <p className="text-slate-700 text-lg leading-relaxed mb-8 whitespace-pre-line">
            {wish.message}
          </p>

          {isOwner && (
            <div className="flex gap-4">
              <button
                onClick={handleShare}
                className="px-6 py-3 rounded-xl bg-indigo-600
                  hover:bg-indigo-700 transition text-white shadow">
                {copied ? "Link Copied ✅" : "Share Link"}
              </button>

              <button
                onClick={() => navigate(`/edit/${id}`)}
                className="px-6 py-3 rounded-xl border
                  hover:bg-slate-100 transition">
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WishPage;
