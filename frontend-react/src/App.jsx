import React, { useState } from 'react';
import './App.css'; 

// Component for rendering a single task card
const TaskCard = ({ task }) => {
  const status = task.status ? task.status.toLowerCase() : 'low';
  const statusClass = `status-${status}`;
  const score = task.priority_score || 0;
  
  let dependencyInfo = '';
  if (task.dependency_block) {
      dependencyInfo = <p><strong>Blocked:</strong> Depends on uncompleted task(s).</p>;
  } else if (task.dependencies && task.dependencies.length > 0) {
      dependencyInfo = <p><strong>Dependencies:</strong> [{task.dependencies.join(', ')}]</p>;
  }

  return (
      <div className={`task-card ${statusClass}`}>
          <div className="task-info">
              <h3>{task.title}</h3>
              <p>Due: {task.due_date} | Effort: {task.estimated_hours}h | Importance: {task.importance}/10</p>
              {dependencyInfo}
          </div>
          <div className={`priority-tag ${statusClass}`}>
              {task.status || 'Low'}<br/>
              Score: {score}
          </div>
      </div>
  );
};


function App() {
  // Retaining the default input data for easy testing
  const [taskInput, setTaskInput] = useState(`[
    {"id": 1, "title": "Finish Report Draft", "due_date": "2025-12-05", "importance": 9, "estimated_hours": 4},
    {"id": 2, "title": "Email HR about vacation", "due_date": "2025-12-01", "importance": 5, "estimated_hours": 1},
    {"id": 3, "title": "Buy groceries", "due_date": "2025-12-25", "importance": 3, "estimated_hours": 2},
    {"id": 4, "title": "Code Review for Project A", "due_date": "2025-12-04", "importance": 8, "estimated_hours": 3, "dependencies": [1]}
]`);
  const [results, setResults] = useState([]);
  const [explanation, setExplanation] = useState('Submit tasks to see the prioritized list here.');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (endpoint) => {
    setLoading(true);
    setError(null);
    setResults([]);
    setExplanation('Analyzing...');

    try {
      const tasks = JSON.parse(taskInput);
      if (!Array.isArray(tasks)) throw new Error('Input must be a JSON array.');

      // Proxy handles /api/tasks/... call to Django
      const response = await fetch(`/api/tasks/${endpoint}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tasks)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Server error (Status: ${response.status})`);
      }

      if (endpoint === 'analyze') {
        setResults(data);
        setExplanation('All Tasks Sorted by Priority Score:');
      } else { // 'suggest'
        setResults(data.suggestions);
        setExplanation(data.explanation);
      }

    } catch (err) {
      setError(`Error: ${err.message}. Please check your JSON format.`);
      setExplanation('Analysis Failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>🧠 Smart Task Analyzer</h1>
      </header>
      <main>
        <section className="input-container">
          <h2>Task Input (JSON Array)</h2>
          <textarea 
            id="taskInput" 
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
          ></textarea>
          <div className="controls">
            <button onClick={() => fetchData('analyze')} disabled={loading}>
              {loading ? 'Analyzing...' : 'Analyze & Sort (Score Driven)'}
            </button>
            <button onClick={() => fetchData('suggest')} disabled={loading}>
              {loading ? 'Suggesting...' : 'Get Top 3 Suggestion'}
            </button>
          </div>
          <p className="note">**Due dates must be in YYYY-MM-DD format.**</p>
        </section>

        <section className="results-container">
          <h2>Prioritized Results</h2>
          <div id="suggestionExplanation" className="explanation">
            <p>{explanation}</p>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div id="resultsDisplay" className="task-list">
            {results.length > 0 ? (
              results.map((task, index) => <TaskCard key={index} task={task} />)
            ) : (
              !loading && !error && <p>No results to display.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;