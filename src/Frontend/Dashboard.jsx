import React, { useState, useEffect, useMemo } from 'react';
import './Dashboard.css';

const CAREER_PROFILES = [
  {
    keywords: ['computer science', 'information systems', 'data science', 'software', 'game development'],
    skills: 'Programming, algorithms, data structures, systems design, problem-solving',
    careers: [
      { title: 'Software Engineer', salary: '$130,000 median' },
      { title: 'Machine Learning Engineer', salary: '$155,000 median' },
      { title: 'Cloud Solutions Architect', salary: '$150,000 median' }
    ]
  },
  {
    keywords: ['engineering', 'physics', 'mathematics'],
    skills: 'Quantitative analysis, mathematical modeling, technical design, critical thinking',
    careers: [
      { title: 'Petroleum Engineer', salary: '$145,000 median' },
      { title: 'Aerospace Engineer', salary: '$130,000 median' },
      { title: 'Engineering Manager', salary: '$165,000 median' }
    ]
  },
  {
    keywords: ['finance', 'accounting', 'economics', 'business administration', 'management', 'marketing'],
    skills: 'Financial analysis, strategic planning, data interpretation, leadership, communication',
    careers: [
      { title: 'Investment Banking Associate', salary: '$175,000 total compensation' },
      { title: 'Financial Manager', salary: '$156,000 median' },
      { title: 'Corporate Controller / CPA Leader', salary: '$140,000 median' }
    ]
  },
  {
    keywords: ['biology', 'biological', 'chemistry', 'nursing', 'health', 'dietetics'],
    skills: 'Lab techniques, patient care, research methodology, anatomy, data analysis',
    careers: [
      { title: 'Pharmacist', salary: '$136,000 median' },
      { title: 'Physician Assistant', salary: '$130,000 median' },
      { title: 'Biotech Research Scientist', salary: '$120,000 median' }
    ]
  },
  {
    keywords: ['education', 'teaching', 'special education', 'adolescent'],
    skills: 'Curriculum design, classroom management, communication, mentoring, assessment',
    careers: [
      { title: 'School Administrator (Principal)', salary: '$103,000 median' },
      { title: 'Instructional Coordinator', salary: '$78,000 median' },
      { title: 'Special Education Director', salary: '$115,000 median' }
    ]
  },
  {
    keywords: ['journalism', 'communications', 'public relations', 'advertising', 'multimedia'],
    skills: 'Writing, media production, storytelling, brand strategy, audience engagement',
    careers: [
      { title: 'Public Relations Director', salary: '$127,000 median' },
      { title: 'Marketing Director', salary: '$158,000 median' },
      { title: 'Digital Media Strategist', salary: '$105,000 median' }
    ]
  },
  {
    keywords: ['agriculture', 'environmental', 'earth', 'animal'],
    skills: 'Field research, sustainability practices, resource management, data collection',
    careers: [
      { title: 'Agricultural Engineer', salary: '$98,000 median' },
      { title: 'Environmental Scientist', salary: '$78,000 median' },
      { title: 'Agribusiness Operations Manager', salary: '$110,000 median' }
    ]
  },
  {
    keywords: ['political science', 'sociology', 'criminal justice', 'law', 'social'],
    skills: 'Research, argumentation, policy analysis, ethics, public speaking',
    careers: [
      { title: 'Attorney', salary: '$145,000 median' },
      { title: 'Policy Analyst', salary: '$95,000 median' },
      { title: 'Compliance Director', salary: '$125,000 median' }
    ]
  },
  {
    keywords: ['music', 'theatre', 'art', 'design', 'visual'],
    skills: 'Creative direction, visual communication, collaboration, ideation, project management',
    careers: [
      { title: 'Creative Director', salary: '$145,000 median' },
      { title: 'UX/UI Designer', salary: '$105,000 median' },
      { title: 'Art Director', salary: '$112,000 median' }
    ]
  },
  {
    keywords: ['english', 'languages', 'philosophy'],
    skills: 'Writing, critical analysis, research, persuasion, cross-cultural communication',
    careers: [
      { title: 'Technical Writer', salary: '$91,000 median' },
      { title: 'Corporate Communications Manager', salary: '$120,000 median' },
      { title: 'Content Strategy Lead', salary: '$115,000 median' }
    ]
  }
];

const DEFAULT_CAREERS = [
  { title: 'Operations Manager', salary: '$101,000 median' },
  { title: 'Project Manager', salary: '$98,000 median' },
  { title: 'Business Analyst', salary: '$99,000 median' }
];
const DEFAULT_SKILLS = 'Critical thinking, communication, research, project management, adaptability';

function getCareerOutcomes(major) {
  const text = `${major.major} ${major.Department} ${major.collegeOfMajor}`.toLowerCase();
  const matchedProfile = CAREER_PROFILES.find((profile) =>
    profile.keywords.some((keyword) => text.includes(keyword))
  );

  return {
    careers: matchedProfile ? matchedProfile.careers : DEFAULT_CAREERS,
    skills: matchedProfile ? matchedProfile.skills : DEFAULT_SKILLS
  };
}

function getMurrayCurriculumLink(majorName) {
  const encoded = encodeURIComponent(majorName);
  return `https://www.murraystate.edu/programs/app/#/results?search=${encoded}`;
}

// each tag has a list of keywords we check against the major name, department, and college
// first match wins, so order matters — more specific tags should come before broad ones
const MAJOR_TAGS = [
  { tag: 'STEM', keywords: ['computer science', 'engineering', 'mathematics', 'physics', 'data science', 'software', 'statistics', 'information systems', 'game development'] },
  { tag: 'Business', keywords: ['business', 'accounting', 'finance', 'economics', 'marketing', 'management', 'entrepreneurship'] },
  { tag: 'Health', keywords: ['biology', 'biological', 'chemistry', 'nursing', 'health', 'dietetics', 'pre-med'] },
  { tag: 'Education', keywords: ['education', 'teaching', 'special education', 'adolescent'] },
  { tag: 'Arts & Media', keywords: ['art', 'design', 'theatre', 'music', 'journalism', 'communications', 'multimedia', 'visual', 'advertising'] },
  { tag: 'Law & Policy', keywords: ['political science', 'sociology', 'criminal justice', 'law', 'social work', 'public'] },
  { tag: 'Agriculture', keywords: ['agriculture', 'environmental', 'earth', 'animal'] },
  { tag: 'Humanities', keywords: ['english', 'languages', 'philosophy', 'history'] },
];

// prepend 'All' so the chip row always has a clear-filter option
const ALL_TAGS = ['All', ...MAJOR_TAGS.map(t => t.tag)];

// falls back to 'Other' if nothing matches — keeps the badge from being blank
function getMajorTag(major) {
  const text = `${major.major} ${major.Department} ${major.collegeOfMajor}`.toLowerCase();
  const match = MAJOR_TAGS.find(({ keywords }) => keywords.some(k => text.includes(k)));
  return match ? match.tag : 'Other';
}

const Dashboard = ({ user, onLogout, onNavigateToQuiz }) => {
  const [majors, setMajors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [expandedMajorId, setExpandedMajorId] = useState(null);
  const [loading, setLoading] = useState(true);
  // favorites is a Set of major IDs so we can do O(1) lookups when rendering each card
  const [favorites, setFavorites] = useState(new Set());
  // toggled by clicking the Saved Majors stat card
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  // holds up to 3 full major objects for the comparison panel
  const [compareList, setCompareList] = useState([]);

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

    // interest tag filter — getMajorTag does keyword matching each time, but the list is small enough it's fine
    if (selectedTag !== 'All') {
      filtered = filtered.filter(major => getMajorTag(major) === selectedTag);
    }

    // when the user clicks the Saved Majors card, hide everything they haven't hearted
    if (showFavoritesOnly) {
      filtered = filtered.filter(major => favorites.has(major.id));
    }

    return filtered;
  }, [majors, searchTerm, selectedCollege, selectedDepartment, selectedTag, showFavoritesOnly, favorites]);

  // Fetch majors data from backend
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMajors();
  }, []);

  // pull the user's saved major IDs from the DB on load and store them in a Set
  useEffect(() => {
    if (!user?.id) return;
    fetch(`http://localhost:3000/api/favorites/${user.id}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setFavorites(new Set(data.map(f => f.major_id)));
        }
      })
      .catch(() => {}); // silently fail — favorites just won't show as saved
  }, [user?.id]);

  const handleLearnMoreToggle = (majorId) => {
    setExpandedMajorId((currentId) => (currentId === majorId ? null : majorId));
  };

  const toggleFavorite = async (majorId) => {
    const isFav = favorites.has(majorId);
    // optimistic update — flip the UI immediately so it feels instant
    setFavorites(prev => {
      const next = new Set(prev);
      if (isFav) next.delete(majorId); else next.add(majorId);
      return next;
    });
    try {
      if (isFav) {
        await fetch(`http://localhost:3000/api/favorites/${user.id}/${majorId}`, { method: 'DELETE' });
      } else {
        await fetch('http://localhost:3000/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, majorId })
        });
      }
    } catch {
      // if the network call fails, roll back to whatever it was before
      setFavorites(prev => {
        const next = new Set(prev);
        if (isFav) next.add(majorId); else next.delete(majorId);
        return next;
      });
    }
  };

  const toggleCompare = (major) => {
    setCompareList(prev => {
      // if it's already in the list, remove it
      if (prev.find(m => m.id === major.id)) return prev.filter(m => m.id !== major.id);
      // hard cap at 3 so the comparison panel doesn't get too cramped
      if (prev.length >= 3) return prev;
      return [...prev, major];
    });
  };

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
        <div
          className={`stat-card stat-card-fav${showFavoritesOnly ? ' active' : ''}`}
          onClick={() => setShowFavoritesOnly(v => !v)}
          title={showFavoritesOnly ? 'Show all majors' : 'Show saved majors only'}
        >
          <div className="stat-number">{favorites.size}</div>
          <div className="stat-label">&#9829; Saved Majors</div>
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

        <div className="tag-filter-row">
          {ALL_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              className={`tag-chip${selectedTag === tag ? ' active' : ''}`}
              onClick={() => setSelectedTag(tag)}
            >
              {tag}
            </button>
          ))}
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
              <div key={major.id} className={`major-card${compareList.find(m => m.id === major.id) ? ' comparing' : ''}`}>
                <div className="major-header">
                  <h3 className="major-title">{major.major}</h3>
                  <span className="college-badge">{major.collegeOfMajor}</span>
                </div>
                <div className="major-details">
                  <p className="department">{major.Department}</p>
                  <span className="interest-tag">{getMajorTag(major)}</span>
                </div>

                <div className="major-card-actions">
                  <button className="learn-more-btn" onClick={() => handleLearnMoreToggle(major.id)}>
                    {expandedMajorId === major.id ? 'Hide Details' : 'Learn More'}
                  </button>
                  <button
                    type="button"
                    className={`fav-btn${favorites.has(major.id) ? ' active' : ''}`}
                    onClick={() => toggleFavorite(major.id)}
                    title={favorites.has(major.id) ? 'Remove from saved' : 'Save this major'}
                    aria-label={favorites.has(major.id) ? 'Remove from saved' : 'Save major'}
                  >
                    {favorites.has(major.id) ? '♥' : '♡'}
                  </button>
                  <button
                    type="button"
                    className={`compare-btn${compareList.find(m => m.id === major.id) ? ' active' : ''}`}
                    onClick={() => toggleCompare(major)}
                    disabled={!compareList.find(m => m.id === major.id) && compareList.length >= 3}
                    title={compareList.find(m => m.id === major.id) ? 'Remove from comparison' : 'Add to comparison'}
                  >
                    {compareList.find(m => m.id === major.id) ? '− Compare' : '+ Compare'}
                  </button>
                </div>

                {expandedMajorId === major.id && (
                  <div className="major-more-details">
                    <h4 className="more-title">High-Paying Career Paths</h4>
                    <ul className="career-list">
                      {getCareerOutcomes(major).careers.map((career) => (
                        <li key={career.title} className="career-item">
                          <span className="career-name">{career.title}</span>
                          <span className="career-salary">{career.salary}</span>
                        </li>
                      ))}
                    </ul>

                    <p className="major-skills">
                      <span className="skills-label">Key skills you&#39;ll develop: </span>
                      {getCareerOutcomes(major).skills}
                    </p>

                    <a
                      href={getMurrayCurriculumLink(major.major)}
                      target="_blank"
                      rel="noreferrer"
                      className="curriculum-link"
                    >
                      View Murray State curriculum/program details
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comparison Panel */}
      {compareList.length >= 1 && (
        <div className="comparison-panel">
          <div className="comparison-header">
            <span className="comparison-title">
              {compareList.length < 2
                ? 'Select at least 2 majors to compare'
                : `Comparing ${compareList.length} Major${compareList.length > 1 ? 's' : ''}`}
            </span>
            <button type="button" className="comparison-clear-btn" onClick={() => setCompareList([])}>
              Clear All
            </button>
          </div>

          {compareList.length >= 2 && (
            <div className="comparison-grid">
              {compareList.map(major => {
                const { careers, skills } = getCareerOutcomes(major);
                return (
                  <div key={major.id} className="comparison-col">
                    <div className="comparison-col-header">
                      <h4 className="comparison-major-name">{major.major}</h4>
                      <button
                        type="button"
                        className="comparison-remove-btn"
                        onClick={() => toggleCompare(major)}
                        aria-label={`Remove ${major.major} from comparison`}
                      >
                        ×
                      </button>
                    </div>
                    <div className="comparison-row">
                      <span className="comparison-label">College</span>
                      <span className="comparison-value">{major.collegeOfMajor}</span>
                    </div>
                    <div className="comparison-row">
                      <span className="comparison-label">Department</span>
                      <span className="comparison-value">{major.Department}</span>
                    </div>
                    <div className="comparison-row">
                      <span className="comparison-label">Interest Area</span>
                      <span className="comparison-value">{getMajorTag(major)}</span>
                    </div>
                    <div className="comparison-row comparison-careers">
                      <span className="comparison-label">Top Careers</span>
                      <ul className="comparison-career-list">
                        {careers.map(c => (
                          <li key={c.title}><strong>{c.title}</strong> — {c.salary}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="comparison-row">
                      <span className="comparison-label">Key Skills</span>
                      <span className="comparison-value comparison-skills">{skills}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;