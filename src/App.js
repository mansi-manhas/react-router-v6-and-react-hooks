import React, { useCallback, useEffect, useMemo, useState } from "react";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "./Login";
import DynamicRoutingUserProfile from "./DynamicRoutingUserProfile";
import Users from "./Users";

const App = () => {
  return (
    <BrowserRouter>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/contact">Contact</Link>
          </li>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/form">Form</Link>
          </li>
          <li>
            <Link to="/posts">Posts Management</Link>
          </li>
          <li>
            <Link to="/dashboard">Protected Dashboard</Link>
          </li>
          <li>
            <Link to="/users">All Users</Link>
          </li>
          <li>
            <Link to="/users/12345">User ID Details</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/form" element={<Form />} />
        <Route path="/posts" element={<Posts/ >}/>
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProfileDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/users/*" element={<Users />} />
        <Route path="/users/:id" element={<DynamicRoutingUserProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

const Home = () => (
  <div>
    <h1>Home</h1>
  </div>
);

const About = () => (
  <div>
    <h1>About</h1>
  </div>
);

const Contact = () => (
  <div>
    <h1>Contact</h1>
  </div>
);

/***
 * Form Component
 */

const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  }, []);

  return { values, handleChange };
};

const FormComponent = ({ values }) => {
  const isFormValid = useMemo(() => {
    return values.name.length > 0 && values.email.includes("@");
  }, [values.name, values.email]);

  return <div>Form is {isFormValid ? "Valid" : "Invalid"}</div>;
};

const Form = () => {
  const { values, handleChange } = useForm({ name: "", email: "" });

  return (
    <div>
      <form>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          values={values.name}
          onChange={handleChange}
        />
        <label>Email: </label>
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
        />
      </form>
      <FormComponent values={values} />
    </div>
  );
};

/**
 * Posts Management Component
 */

const useApi = (url) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(url);
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    }

    fetchData();
  }, [url]);

  const postData = async (newData) => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newData)
      });
      const result = await response.json();
      setData((prev) => [...prev, result]);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }

  return { data, loading, error, postData };

}

const usePostsForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const handleChange = useCallback((event) => {
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }))
  }, []);

  const handleSubmit = useCallback((callback) => (event) => {
    event.preventDefault();
    callback(values);
  }, [values]);

  return {values, handleChange, handleSubmit};
}


const Posts = () => {
  const { data: posts, postData } = useApi("https://jsonplaceholder.typicode.com/posts");
  const { values, handleChange, handleSubmit } = usePostsForm({title: "", body: ""});

  const addPost = () => {
    postData({ title: values.title, body: values.body });
  }

  return (
    <div>
      <h1>Posts</h1>
      {posts.map((post) => (
        <div key={post.id}>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
        </div>
      ))}

      <h2>Add a post</h2>
      <form onSubmit={handleSubmit(addPost)}>
        <input name="title" value={values.title} onChange={handleChange} />
        <textarea name="body" value={values.body} onChange={handleChange} />
        <button type="submit">Add Post</button>
      </form>
    </div>
  )

}



const Profile = () => (
  <div>
    <h1>Profile</h1>
    <nav>
      <ul>
        <li>
          <Link to="overview">Overview</Link>
        </li>
        <li>
          <Link to="settings">Settings</Link>
        </li>
        <li>
          <Link to="posts">Posts</Link>
        </li>
        <li>
          <Link to="dashboard">Protected Dashboard</Link>
        </li>
      </ul>
    </nav>
    <Routes>
      <Route path="overview" element={<ProfileOverview />} />
      <Route path="settings" element={<ProfileSettings />} />
      <Route path="posts" element={<ProfilePosts />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <ProfileDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  </div>
);

const ProfileOverview = () => <h1>Profile Overview</h1>;

const ProfileSettings = () => <h1>Profile Settings</h1>;

const ProfilePosts = () => <h1>Profile Posts</h1>;

const ProfileDashboard = () => <h1>Protected Dashboard</h1>;
