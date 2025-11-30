# 🧠 Smart Task Analyzer

The **Smart Task Analyzer** is a full-stack mini-application designed to intelligently prioritize a user's task list using a custom scoring algorithm that evaluates **Urgency**, **Importance**, **Effort**, and **Dependencies**.
It follows a decoupled architecture using a **Django REST API backend** and a modern **Vite/React frontend**.

---

## 🚀 Setup & Running the Application

Follow the steps below to set up both the backend (Django) and frontend (React via Vite).

---

## 1️⃣ Backend Setup — Django API

1. **Clone the repository** and navigate to the project root:

   ```
   task-analyzer/
   ```

2. **Create & activate a virtual environment**

   * Windows:

     ```
     python -m venv venv
     .\venv\Scripts\activate
     ```
   * Mac/Linux:

     ```
     python -m venv venv
     source venv/bin/activate
     ```

3. **Install dependencies**

   ```
   pip install django python-dotenv
   ```

4. **Run database migrations**

   ```
   python manage.py makemigrations tasks
   python manage.py migrate
   ```

5. **Start the Django server**

   ```
   python manage.py runserver
   ```

   Backend runs at:
   **[http://127.0.0.1:8000](http://127.0.0.1:8000)**

---

## 2️⃣ Frontend Setup — React + Vite

1. Navigate to the frontend folder:

   ```
   cd frontend-react
   ```

2. Install node dependencies:

   ```
   npm install
   ```

3. Start the development server:

   ```
   npm run dev
   ```

Frontend typically runs at:
**[http://localhost:5173](http://localhost:5173)**

**Access the App:**
Open the frontend URL — it automatically proxies API calls to Django.

---

## 💡 Algorithm Explanation — Priority Score

Each task receives a **numerical priority score**, where a **higher value = higher priority**.
This scoring logic is implemented in:

```
tasks/scoring.py
```

### 📊 Scoring Overview

| Factor              | Logic                                                          | Purpose                                     |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------- |
| **1. Urgency**      | Overdue: **+200**, Due ≤3 days: **+100**, Due ≤7 days: **+50** | Urgency is the most important factor        |
| **2. Importance**   | `importance (1–10) × 10`                                       | Strong linear weight                        |
| **3. Effort**       | ≤1 hr: **+30**, ≤5 hrs: **+10**, Penalty: `-2 × hours`         | Rewards quick wins & discourages long tasks |
| **4. Dependencies** | If a dependency isn’t complete → **score = 0**                 | Prevents prioritization of blocked tasks    |

### 📘 Example

A task with:

* Importance: **5 → 50**
* Due in **1 day → +100**
* Effort: **1hr → +28**

Final score = **178**

---

## 🏗️ Design Decisions & Trade-offs

| Decision                                       | Rationale                                  | Trade-off                        |
| ---------------------------------------------- | ------------------------------------------ | -------------------------------- |
| **Django + React decoupled architecture**      | Clean separation; reusable API             | Requires two dev servers         |
| **Heavy urgency weighting**                    | Makes deadlines dominate for clarity       | Less nuance in edge cases        |
| **JSON input instead of Django forms**         | Faster development and easier bulk testing | Less user-friendly               |
| **DB models implemented but not used heavily** | Meets requirements; simplifies core logic  | No persistence of real task data |

---

## ⏱️ Time Breakdown

| Phase                           | Planned      | Actual           |
| ------------------------------- | ------------ | ---------------- |
| Django setup                    | 15 mins      | 20 mins          |
| Backend: Models, scoring, views | 1 hr 45 mins | 2 hrs 15 mins    |
| Frontend (original HTML/CSS)    | 1 hr 30 mins | 45 mins          |
| React/Vite refactor             | N/A          | 1 hr 15 mins     |
| QA, debugging, docs             | 30 mins      | 1 hr 30 mins     |
| **Total**                       | **4 hrs**    | **5 hrs 5 mins** |

---

## 🔮 Future Improvements

1. **Persist tasks in database** → Full CRUD support.
2. **User authentication** → Personalized task lists.
3. **Improved UI/UX** → Replace JSON input with interactive forms.
4. **Dynamic dependency tracking** → Mark tasks as complete in realtime.
5. **Customizable scoring weights** → Allow user-defined prioritization modes.

---

Thank you for exploring the **Smart Task Analyzer**!
Feel free to extend, modify, or experiment with the algorithm.
