import React, { useState } from 'react';

function App() {
  const [image, setImage] = useState(null);
  const [readingType, setReadingType] = useState("career");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please upload a palm photo.");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("type", readingType);

    try {
      const res = await fetch("https://palm-reading-backend-1.onrender.com/analyze", {

        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert(data.message || "Submitted!");
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Palm Reading</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        <div style={{ margin: "10px 0" }}>
          <select onChange={(e) => setReadingType(e.target.value)} value={readingType}>
            <option value="career">Career</option>
            <option value="love">Love</option>
            <option value="personality">Personality</option>
          </select>
        </div>
        <button type="submit">Get Reading</button>
      </form>
    </div>
  );
}

export default App;
