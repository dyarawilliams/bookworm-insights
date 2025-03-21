import React from 'react';
import { PanelBar, PanelBarItem } from '@progress/kendo-react-layout';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import SearchBar from './SearchBar';

const Sidebar = ({
    onSearch,
    isLoading,
    categories,
    selectedCategory,
    onCategoryChange
}) => {
    return (
        <div className="sidebar">
            <PanelBar>
                <PanelBarItem title="Search Books" expanded={true}>
                    <div className="panel-content">
                        <SearchBar
                            onSearch={onSearch}
                            isLoading={isLoading}
                        />
                    </div>
                </PanelBarItem>

                <PanelBarItem title="Categories" expanded={true}>
                    <div className="panel-content">
                        <div className="k-form-field">
                            <label htmlFor="category-filter">Filter by Category</label>
                            <DropDownList
                                id="category-filter"
                                data={categories}
                                value={selectedCategory}
                                onChange={(e) => onCategoryChange(e.value)}
                                style={{ width: '100%' }}
                                aria-label="Filter books by category"
                            />
                        </div>
                    </div>
                </PanelBarItem>

                <PanelBarItem title="About">
                    <div className="panel-content">
                        <p>Bookworm Insights helps you discover, track, and manage your reading journey.</p>
                        <p>Search for books, add them to your personal library, and keep track of your literary adventures.</p>
                    </div>
                </PanelBarItem>
            </PanelBar>
        </div>
    );
};

export default Sidebar;