import React, { useState, useEffect } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { FaHome, FaQrcode, FaBook, FaUserCircle, FaHistory, FaCog } from 'react-icons/fa';
import axios from 'axios';
import Dashboard from './Dashboard';
import Courses from './Courses';
import Scan from './Scan';
import ScanQR from './ScanQR';
import History from './History';
import Settings from './Settings';

const StudentDashboard = () => {
  const [studentName, setStudentName] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const detectMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      if (
        /android/i.test(userAgent) ||
        /iPad|iPhone|iPod/.test(userAgent) ||
        (navigator.userAgentData && navigator.userAgentData.mobile)
      ) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    detectMobileDevice();
  }, []);

  useEffect(() => {
    if (!hasRedirected) {
      if (isMobile) {
        navigate('attendance');
      } else {
        navigate('dashboard');
      }
      setHasRedirected(true);
    }
  }, [isMobile, hasRedirected, navigate]);

  useEffect(() => {
    const fetchStudentData = async () => {
        try {
            const authToken = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId');

            console.log("Retrieved authToken:", authToken);
            console.log("Retrieved userId:", userId);

            if (!authToken) {
                console.error("No auth token found! User might not be logged in.");
                navigate('/'); // Redirect to login page if no token
                return;
            }

            if (!userId) {
                console.error("No user ID found! API request might fail.");
            }

            // Ensure API URL does not include "undefined"
            const apiUrl = `${process.env.REACT_APP_BASE_URL}/api-auth/v1/me/`;
            console.log("Fetching student data from:", apiUrl);

            const response = await axios.get(apiUrl, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

            console.log("Student API Response:", response.data);
            setStudentName(response.data.name);
        } catch (error) {
            console.error("Error fetching student data:", error.response ? error.response.data : error.message);
            setStudentName('Student');
        }
    };

    fetchStudentData();
}, []);


  const handleSignOut = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  const renderScanComponent = <ScanQR />;

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div
          style={{
            padding: '10px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #ddd',
          }}
        >
          <img
            src="/images/team-logo.png"
            alt="Team Logo"
            onError={(e) => (e.target.src = '/default-icon.png')} // Fallback icon
            style={{
              width: '40px',
              height: 'auto',
              borderRadius: '5px',
              marginRight: '10px',
            }}
          />
          <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>UCF Attendance</h3>
        </div>

        <div style={{ flex: 1, overflow: 'auto' }}>
          <Routes>
            <Route path="attendance" element={<Scan />} />
            <Route path="history" element={<History />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>

        <nav
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px 0',
            backgroundColor: '#f8f9fa',
            borderTop: '1px solid #ddd',
          }}
        >
          <NavLink
            to="attendance"
            style={({ isActive }) => ({
              textAlign: 'center',
              color: isActive ? '#007bff' : '#333',
              textDecoration: 'none',
            })}
          >
            <FaQrcode size={24} />
            <p style={{ fontSize: '12px', marginTop: '5px' }}>Attendance</p>
          </NavLink>
          <NavLink
            to="history"
            style={({ isActive }) => ({
              textAlign: 'center',
              color: isActive ? '#007bff' : '#333',
              textDecoration: 'none',
            })}
          >
            <FaHistory size={24} />
            <p style={{ fontSize: '12px', marginTop: '5px' }}>History</p>
          </NavLink>
          <NavLink
            to="settings"
            style={({ isActive }) => ({
              textAlign: 'center',
              color: isActive ? '#007bff' : '#333',
              textDecoration: 'none',
            })}
          >
            <FaCog size={24} />
            <p style={{ fontSize: '12px', marginTop: '5px' }}>Settings</p>
          </NavLink>
        </nav>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav
        style={{
          width: '250px',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #ddd',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
            <img
              src="/images/team-logo.png"
              alt="Team Logo"
              onError={(e) => (e.target.src = '/default-icon.png')} // Fallback icon
              style={{
                width: '50px',
                height: 'auto',
                borderRadius: '5px',
                marginRight: '10px',
              }}
            />
            <h3 style={{ margin: 0, color: '#333' }}>App Name</h3>
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={{ marginBottom: '15px' }}>
              <NavLink
                to="dashboard"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#007bff' : '#333',
                  backgroundColor: isActive ? '#dee2e6' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '5px',
                })}
              >
                <FaHome style={{ marginRight: '10px', fontSize: '18px' }} />
                Dashboard
              </NavLink>
            </li>
            <li style={{ marginBottom: '15px' }}>
              <NavLink
                to="scan"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#007bff' : '#333',
                  backgroundColor: isActive ? '#dee2e6' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '5px',
                })}
              >
                <FaQrcode style={{ marginRight: '10px', fontSize: '18px' }} />
                Scan
              </NavLink>
            </li>
            <li style={{ marginBottom: '15px' }}> {/* Increased margin for spacing */}
              <NavLink
                to="courses"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#007bff' : '#333',
                  backgroundColor: isActive ? '#dee2e6' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '5px',
                })}
              >
                <FaBook style={{ marginRight: '10px', fontSize: '18px' }} />
                Courses
              </NavLink>
            </li>
            <li>
              <NavLink
                to="settings"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? '#007bff' : '#333',
                  backgroundColor: isActive ? '#dee2e6' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '10px',
                  borderRadius: '5px',
                })}
              >
                <FaCog style={{ marginRight: '10px', fontSize: '18px' }} />
                Settings
              </NavLink>
            </li>
          </ul>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#f8f9fa',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
          onClick={handleSignOut}
        >
          <FaUserCircle style={{ fontSize: '24px', marginRight: '10px' }} />
          <span style={{ fontSize: '16px', color: '#333' }}>{studentName || 'Student'}</span>
        </div>
      </nav>

      <div style={{ flex: 1, padding: '20px' }}>
        <Routes>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="scan" element={renderScanComponent} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default StudentDashboard;
