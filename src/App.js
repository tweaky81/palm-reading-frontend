import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload a palm photo.");
    setLoading(true);

    try {
      // 1. Upload image
      const formData = new FormData();
      formData.append("palmImage", image);

      const uploadRes = await fetch("https://palm-reading-backend-1.onrender.com/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      const filename = uploadData.filename;

      // 2. Create Stripe checkout session
      const sessionRes = await fetch("https://palm-reading-backend-1.onrender.com/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });

      const sessionData = await sessionRes.json();
      if (!sessionData.url) throw new Error("Failed to create session");

      // 3. Redirect to Stripe
      window.location.href = sessionData.url;
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Palm Reading</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Upload & Pay £1.99"}
        </button>
      </form>
    </div>
  );
}

export default App;

