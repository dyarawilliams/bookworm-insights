import React, { useState, useRef } from 'react';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';

const SearchBar = ({ onSearch, isLoading }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const searchInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            onSearch(searchTerm);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-form">
            <div className="k-form-field">
                <Input
                    ref={searchInputRef}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.value)}
                    placeholder="Search for books..."
                    disabled={isLoading}
                    aria-label="Search for books"
                    className="search-input"
                />
            </div>
            <Button
                type="submit"
                themeColor="primary"
                disabled={isLoading || !searchTerm.trim()}
                aria-label="Search books"
            >
                Search
            </Button>
        </form>
    );
};

export default SearchBar;