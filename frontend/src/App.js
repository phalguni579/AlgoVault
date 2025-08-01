import React, { useEffect, useState } from "react";

function App() {
  const [problems, setProblems] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    platform: "",
    tags: "",
    difficulty: "Easy",
    status: "Unsolved",
    solutionLink: "",
  });

  // Fetch problems from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/problems")
      .then(res => res.json())
      .then(data => setProblems(data))
      .catch(err => console.error(err));
  }, []);

  // Handle form input changes
  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit new problem
  const handleSubmit = e => {
    e.preventDefault();
    const newProblem = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()),
    };

    fetch("http://localhost:5000/api/problems", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProblem),
    })
      .then(res => res.json())
      .then(data => {
        setProblems([...problems, data]);
        setFormData({
          title: "",
          platform: "",
          tags: "",
          difficulty: "Easy",
          status: "Unsolved",
          solutionLink: "",
        });
      })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>AlgoVault - Coding Problems Tracker</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          name="title"
          placeholder="Problem Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          name="platform"
          placeholder="Platform (e.g., LeetCode)"
          value={formData.platform}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <input
          name="tags"
          placeholder="Tags (comma separated)"
          value={formData.tags}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        >
          <option>Unsolved</option>
          <option>Solved</option>
          <option>Revision Needed</option>
        </select>
        <input
          name="solutionLink"
          placeholder="Solution Link"
          value={formData.solutionLink}
          onChange={handleChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />
        <button type="submit" style={{ padding: 10, width: "100%" }}>
          Add Problem
        </button>
      </form>

      <h2>Problems List</h2>
      <ul>
        {problems.map(problem => (
          <li key={problem._id} style={{ marginBottom: 10 }}>
            <strong>{problem.title}</strong> [{problem.platform}] —{" "}
            {problem.difficulty} — Status: {problem.status}
            {problem.solutionLink && (
              <>
                {" "}
                — <a href={problem.solutionLink} target="_blank" rel="noreferrer">Solution</a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

