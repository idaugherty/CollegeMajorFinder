import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';

const Dashboard = ({ user, onLogout, onNavigateToQuiz }) => {
  const [majors, setMajors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [loading, setLoading] = useState(true);

  // Get unique colleges and departments for filters
  const colleges = ['All', ...new Set(majors.map(major => major.collegeOfMajor))];
  const departments = ['All', ...new Set(majors.map(major => major.Department))];

  // Get statistics
  const totalMajors = majors.length;
  const totalColleges = new Set(majors.map(major => major.collegeOfMajor)).size;
  const totalDepartments = new Set(majors.map(major => major.Department)).size;

  const fetchMajors = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/majors');
      const data = await response.json();
      setMajors(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching majors:', error);
      setLoading(false);
    }
  };

  // Filter majors based on search and filters using useMemo
  const filteredMajors = useMemo(() => {
    let filtered = majors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(major =>
        major.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
        major.Department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        major.collegeOfMajor.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by college
    if (selectedCollege !== 'All') {
      filtered = filtered.filter(major => major.collegeOfMajor === selectedCollege);
    }

    // Filter by department
    if (selectedDepartment !== 'All') {
      filtered = filtered.filter(major => major.Department === selectedDepartment);
    }

    return filtered;
  }, [majors, searchTerm, selectedCollege, selectedDepartment]);

  // Fetch majors data from backend
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMajors();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading College Major Finder...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="app-title">College Major Finder</h1>
            <p className="app-subtitle">Discover your perfect academic path</p>
          </div>
          <div className="header-user">
            <span className="user-greeting">Hello, {user?.display_name || user?.email}</span>
            <button className="logout-btn" onClick={onLogout}>Sign Out</button>
          </div>
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-number">{totalMajors}</div>
          <div className="stat-label">Total Majors</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalColleges}</div>
          <div className="stat-label">Colleges</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalDepartments}</div>
          <div className="stat-label">Departments</div>
        </div>
      </div>

      <div className="quiz-cta-container">
        <div className="quiz-cta-card">
          <div>
            <h2 className="quiz-cta-title">Take Your Personalized Major Quiz</h2>
            <p className="quiz-cta-subtitle">
              Answer a quick preference scale and get a ranked list of majors that best match you.
            </p>
          </div>
          <button className="quiz-cta-btn" onClick={onNavigateToQuiz}>Go to Quiz</button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="controls-container">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search majors, departments, or colleges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <select
            value={selectedCollege}
            onChange={(e) => setSelectedCollege(e.target.value)}
            className="filter-select"
          >
            {colleges.map(college => (
              <option key={college} value={college}>{college}</option>
            ))}
          </select>

          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="filter-select"
          >
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Majors Grid */}
      <div className="majors-container">
        <h2 className="section-title">
          Available Majors ({filteredMajors.length})
        </h2>

        {filteredMajors.length === 0 ? (
          <div className="no-results">
            <p>No majors found matching your criteria.</p>
          </div>
        ) : (
          <div className="majors-grid">
            {filteredMajors.map(major => (
              <div key={major.id} className="major-card">
                <div className="major-header">
                  <h3 className="major-title">{major.major}</h3>
                  <span className="college-badge">{major.collegeOfMajor}</span>
                </div>
                <div className="major-details">
                  <p className="department">{major.Department}</p>
                </div>
                <button className="learn-more-btn">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;