import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import LoadingSpinner from './LoadingSpinner';
import { Form, InputGroup, FormControl, Button, Alert } from 'react-bootstrap';
import '../styles/Directory.css';

const Directory = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'Name',
    direction: 'ascending'
  });
  const { currentUser, userRole } = useAuth();  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://script.google.com/macros/s/AKfycbx8X0uRNqFZS2tCsnQ7mxQwO647Io9KsqmLwnTm-pjs_NVOBX6ieatWqDBmi7gesRT3/exec');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const result = await response.json();
        console.log('API Response:', result); // Log the response for debugging
        
        let receivedData = [];
        
        // Check if data exists and is properly formatted
        if (result && Array.isArray(result) && result.length > 0) {
          receivedData = result;
          setError(null);
        } else {
          // If API returns no data or wrong format, show empty data array
          console.log('No data returned from API');
          receivedData = [];
          setError('No directory data is currently available.');
        }
        
        // Format dates if present
        receivedData = receivedData.map(item => {
          const formattedItem = {...item};
          if (formattedItem["Start Date"]) {
            const date = new Date(formattedItem["Start Date"]);
            if (!isNaN(date)) {
              formattedItem["Start Date"] = date.toLocaleDateString();
            }
          }
          return formattedItem;
        });
        
        setData(receivedData);
        setFilteredData(receivedData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load directory data.');
        // Use empty array on error
        setData([]);
        setFilteredData([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchData();
    }
  }, [currentUser]);

  useEffect(() => {
    // Filter data based on search term
    if (searchTerm.trim() === '') {
      setFilteredData(data);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = data.filter(item => 
        Object.values(item).some(
          val => val && val.toString().toLowerCase().includes(lowercasedSearch)
        )
      );
      setFilteredData(filtered);
    }
  }, [data, searchTerm]);  // Apply sorting to filtered data
  const getSortedData = () => {
    if (!filteredData.length) {
      return filteredData;
    }
    
    // Get columns based on user role
    const visibleColumns = userRole === 'ADMIN' 
      ? ['Name', 'Department', 'Start Date', 'Email']
      : ['Name', 'Department'];
    
    // Check if the sorted column is visible for the current role
    if (sortConfig.key && !visibleColumns.includes(sortConfig.key)) {
      return filteredData;
    }
    
    return [...filteredData].sort((a, b) => {
      // Handle different data types for sorting
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      
      // Handle numbers
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return sortConfig.direction === 'ascending' 
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }
      
      // Handle dates
      if (sortConfig.key === 'Start Date') {
        const dateA = new Date(a[sortConfig.key]);
        const dateB = new Date(b[sortConfig.key]);
        
        if (!isNaN(dateA) && !isNaN(dateB)) {
          return sortConfig.direction === 'ascending' 
            ? dateA - dateB 
            : dateB - dateA;
        }
      }
      
      // Default string comparison
      if (aValue && bValue) {
        return sortConfig.direction === 'ascending' 
          ? aValue.toString().localeCompare(bValue.toString())
          : bValue.toString().localeCompare(aValue.toString());
      }
      
      // Handle undefined or null values
      if (!aValue && bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue && !bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
      return 0;
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    
    // Get headers based on user role
    let headers;
    if (userRole === 'ADMIN') {
      headers = ['Name', 'Department', 'Start Date', 'Email'];
    } else {
      headers = ['Name', 'Department'];
    }
    
    // Convert data to CSV format
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    filteredData.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || '';
        // Escape values that contain commas or quotes
        return `"${value.toString().replace(/"/g, '""')}"`;
      });
      csvRows.push(values.join(','));
    });
    
    // Create and download CSV file
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'directory_export.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };const handleRefresh = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://script.google.com/macros/s/AKfycbx8X0uRNqFZS2tCsnQ7mxQwO647Io9KsqmLwnTm-pjs_NVOBX6ieatWqDBmi7gesRT3/exec');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('API Response (refresh):', result); // Log the response for debugging
      
      let receivedData = [];
      
      // Check if data exists and is properly formatted
      if (result && Array.isArray(result) && result.length > 0) {
        receivedData = result;
        setError(null);
      } else {
        // If API returns no data or wrong format, show empty data array
        console.log('No data returned from API (refresh)');
        receivedData = [];
        setError('No directory data is currently available.');
      }
      
      // Format dates if present
      receivedData = receivedData.map(item => {
        const formattedItem = {...item};
        if (formattedItem["Start Date"]) {
          const date = new Date(formattedItem["Start Date"]);
          if (!isNaN(date)) {
            formattedItem["Start Date"] = date.toLocaleDateString();
          }
        }
        return formattedItem;
      });
      
      setData(receivedData);
      setFilteredData(receivedData);
      setSearchTerm('');
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to refresh directory data.');
      // Use empty array on error
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Function to sort data based on column
  const requestSort = (key) => {
    let direction = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  if (!currentUser) {
    return <div className="directory-container">Please log in to view the directory.</div>;
  }
  return (    <div className="directory-container">      <div className="directory-header">
        <h1>Employee Directory</h1>
        <div className="d-flex align-items-center header-buttons">
          {!loading && (
            <Button 
              variant="outline-secondary" 
              onClick={handleRefresh}
              className="refresh-btn"
              aria-label="Refresh directory"
            >
              <i className="bi bi-arrow-clockwise me-md-2"></i>
              <span className="d-none d-md-inline">Refresh</span>
            </Button>
          )}
          {/* Desktop export button is hidden and shown in directory-controls */}
          {!loading && filteredData.length > 0 && (
            <Button 
              variant="outline-danger" 
              onClick={exportToCSV}
              className="mobile-export-btn d-inline-flex d-md-none ms-2"
              aria-label="Export to CSV"
              style={{ borderColor: '#d72626', color: '#d72626' }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#d72626';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
                e.currentTarget.style.color = '#d72626';
              }}
            >
              <i className="bi bi-download"></i>
            </Button>
          )}
        </div>
      </div>
      
      {loading && <LoadingSpinner message="Loading directory data..." />}
      
      {!loading && error && <Alert variant="warning">{error}</Alert>}
      
      {!loading && (
        <>          <div className="directory-controls">
            {data.length > 0 && (
              <Form className="mb-4 search-form">
                <InputGroup>
                  <InputGroup.Text>
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <FormControl
                    placeholder="Search directory..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </InputGroup>
              </Form>
            )}
            
            {filteredData.length > 0 && (
              <>
                <Button 
                  variant="outline-danger" 
                  className="mb-4 export-btn d-none d-md-inline-flex"
                  onClick={exportToCSV}
                  style={{ borderColor: '#d72626', color: '#d72626' }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#d72626';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'white';
                    e.currentTarget.style.color = '#d72626';
                  }}
                  aria-label="Export to CSV"
                >
                  <i className="bi bi-download me-2"></i>
                  <span>Export to CSV</span>
                </Button>
              </>
            )}
          </div>

          {filteredData.length === 0 && !error ? (
            <div className="no-data">
              {data.length === 0 ? "No directory data available." : "No results match your search."}
            </div>
          ) : filteredData.length > 0 && (
            <div className="table-container">
              <table className="directory-table">
                <thead>
                  <tr>
                    {userRole === 'ADMIN' ? (
                      // Admin view - show name, department, start date, and email
                      Object.keys(filteredData[0] || {})
                        .filter(header => ['Name', 'Department', 'Start Date', 'Email'].includes(header))
                        .map((header) => (
                          <th key={header} onClick={() => requestSort(header)}>
                            {header}
                            {sortConfig.key === header && (
                              <span>
                                {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                              </span>
                            )}
                          </th>
                        ))
                    ) : (
                      // Regular user view - show only name and department
                      Object.keys(filteredData[0] || {})
                        .filter(header => ['Name', 'Department'].includes(header))
                        .map((header) => (
                          <th key={header} onClick={() => requestSort(header)}>
                            {header}
                            {sortConfig.key === header && (
                              <span>
                                {sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'}
                              </span>
                            )}
                          </th>
                        ))
                    )}
                  </tr>
                </thead>
                <tbody>
                  {getSortedData().map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {userRole === 'ADMIN' ? (
                        // Admin view - show name, department, start date, and email
                        ['Name', 'Department', 'Start Date', 'Email'].map((header, cellIndex) => (
                          <td key={cellIndex}>{row[header] !== null && row[header] !== undefined ? row[header] : ''}</td>
                        ))
                      ) : (
                        // Regular user view - show only name and department
                        ['Name', 'Department'].map((header, cellIndex) => (
                          <td key={cellIndex}>{row[header] !== null && row[header] !== undefined ? row[header] : ''}</td>
                        ))
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Directory;
