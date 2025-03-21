import React, { useState, useEffect } from 'react';
import { TabStrip, TabStripTab } from '@progress/kendo-react-layout';
import { Notification } from '@progress/kendo-react-notification';
import { Fade } from '@progress/kendo-react-animation';
import { IntlProvider, LocalizationProvider } from '@progress/kendo-react-intl';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Bookshelf from './components/Bookshelf';
import BookDetails from './components/BookDetails';
import booksApi from './services/googleBooksApi';
import useLocalStorage from './hooks/useLocalStorage';
import './App.css';

// Custom Splitter Components
const SimpleSplitter = ({ children, className }) => {
  return (
    <div className={`simple-splitter ${className || ''}`}>
      {children}
    </div>
  );
};

const SimpleSplitterPane = ({ children, initialSize, minSize, maxSize, className }) => {
  return (
    <div 
      className={`simple-splitter-pane ${className || ''}`}
      style={{ 
        flexBasis: initialSize || 'auto',
        minWidth: minSize || 'auto',
        maxWidth: maxSize || 'none'
      }}
    >
      {children}
    </div>
  );
};

function App() {
  // State management with React Hooks
  const [searchResults, setSearchResults] = useState([]);
  const [library, setLibrary] = useLocalStorage('bookworm-library', []);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ visible: false, type: '', message: '' });
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [gridState, setGridState] = useState({
    skip: 0,
    take: 10,
    sort: [{ field: 'title', dir: 'asc' }]
  });

  // Extract categories from library books
  useEffect(() => {
    if (library.length > 0) {
      const uniqueCategories = ['All', ...new Set(
        library.flatMap(book => book.categories || ['Uncategorized'])
      )];
      setCategories(uniqueCategories);
    }
  }, [library]);

  // Search for books
  const handleSearch = async (query) => {
    setIsLoading(true);
    try {
      const results = await booksApi.searchBooks(query);
      console.log('API Results:', results); // Debugging log
      setSearchResults(results);
      setNotification({
        visible: true,
        type: 'success',
        message: `Found ${results.length} books for "${query}"`
      });
      // Switch to search results tab
      setActiveTab(0);
    } catch (error) {
      setNotification({
        visible: true,
        type: 'error',
        message: 'Failed to fetch books. Please try again.'
      });
      console.error(error)
    } finally {
      setIsLoading(false);
    }
  };

  // Add book to library
  const addToLibrary = (book) => {
    if (!library.some(item => item.id === book.id)) {
      setLibrary([...library, book]);
      setNotification({
        visible: true,
        type: 'success',
        message: `"${book.title}" added to your library`
      });
    } else {
      setNotification({
        visible: true,
        type: 'info',
        message: `"${book.title}" is already in your library`
      });
    }
  };

  // Remove book from library
  const removeFromLibrary = (bookId) => {
    setLibrary(library.filter(book => book.id !== bookId));
    setNotification({
      visible: true,
      type: 'success',
      message: 'Book removed from your library'
    });
  };

  // View book details
  const viewBookDetails = (book) => {
    setSelectedBook(book);
    setShowDetails(true);
  };

  // Handle grid data state changes
  const handleGridDataStateChange = (e) => {
    setGridState(e.dataState);
  };

  // Filter library books by category
  const filteredLibrary = selectedCategory === 'All'
    ? library
    : library.filter(book => book.categories && book.categories.includes(selectedCategory));

  // Sort data
  const sortData = (data, sort) => {
    if (!sort || sort.length === 0) return data;
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      for (const { field, dir } of sort) {
        if (a[field] < b[field]) return dir === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
    return sortedData;
  };

  // Paginate data
  const paginateData = (data, skip, take) => {
    return data.slice(skip, skip + take);
  };

  // Process data for grid
  const processData = (data, gridState) => {
    const sortedData = sortData(data, gridState.sort);
    const paginatedData = paginateData(sortedData, gridState.skip, gridState.take);
    return paginatedData;
  };

  const processedSearchResults = processData(searchResults, gridState);
  const processedLibrary = processData(filteredLibrary, gridState);

  // Hide notification after 3 seconds
  useEffect(() => {
    let timer;
    if (notification.visible) {
      timer = setTimeout(() => {
        setNotification({ ...notification, visible: false });
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [notification]);

  return (
    <>
      <LocalizationProvider>
        <IntlProvider locale="en">
          <div className='app-container'>
            <Header />
            <a href="#main-content" className="skip-link">Skip to main content</a>
            {/* Notification Component */}
            <Fade enter={true} exit={true}>
              {notification.visible && (
                <Notification
                  type={{ style: notification.type, icon: true }}
                  closable={true}
                  onClose={() => setNotification({ ...notification, visible: false })}
                >
                  <span>{notification.message}</span>
                </Notification>
              )}
            </Fade>

            {/* Main Content */}
            <main id="main-content">
              <SimpleSplitter className="main-splitter">
                {/* Sidebar */}
                <SimpleSplitterPane initialSize="25%" minSize="200px" maxSize="350px" className="sidebar-pane">
                  <Sidebar
                    onSearch={handleSearch}
                    isLoading={isLoading}
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </SimpleSplitterPane>

                {/* Main Content Area */}
                <SimpleSplitterPane className="content-pane">
                  <TabStrip
                    selected={activeTab}
                    onSelect={(e) => setActiveTab(e.selected)}
                    animation={true}
                  >
                    <TabStripTab title="Search Results">
                      <Bookshelf
                        books={processedSearchResults}
                        isLoading={isLoading}
                        gridTitle={`Found ${searchResults.length} books`}
                        onBookSelect={viewBookDetails}
                        library={library}
                        onAddToLibrary={addToLibrary}
                        gridState={gridState}
                        onGridStateChange={handleGridDataStateChange}
                        isLibraryView={false}
                      />
                    </TabStripTab>

                    <TabStripTab title={`My Library (${library.length})`}>
                      <Bookshelf
                        books={processedLibrary}
                        isLoading={false}
                        gridTitle={selectedCategory === 'All'
                          ? `Your library has ${library.length} books`
                          : `${filteredLibrary.length} books in "${selectedCategory}" category`}
                        onBookSelect={viewBookDetails}
                        isLibraryView={true}
                        onRemoveFromLibrary={removeFromLibrary}
                        gridState={gridState}
                        onGridStateChange={handleGridDataStateChange}
                      />
                    </TabStripTab>
                  </TabStrip>
                </SimpleSplitterPane>
              </SimpleSplitter>
            </main>

            {/* Book Details Dialog */}
            <BookDetails
              book={selectedBook}
              isOpen={showDetails}
              onClose={() => setShowDetails(false)}
              isInLibrary={selectedBook ? library.some(book => book.id === selectedBook.id) : false}
              onAddToLibrary={addToLibrary}
              onRemoveFromLibrary={removeFromLibrary}
            />

          </div>
        </IntlProvider>
      </LocalizationProvider>
    </>
  );
}

export default App;