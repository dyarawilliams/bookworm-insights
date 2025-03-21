import React from 'react';
import { Grid, GridColumn, GridToolbar } from '@progress/kendo-react-grid';
import { Button } from '@progress/kendo-react-buttons';
import { ProgressBar } from '@progress/kendo-react-progressbars';

const Bookshelf = ({
    books,
    isLoading,
    gridTitle,
    onBookSelect,
    isLibraryView = false,
    library = [],
    onAddToLibrary,
    onRemoveFromLibrary,
    gridState,
    onGridStateChange
}) => {

    // Check if a book is in the library
    const isInLibrary = (bookId) => {
        return library.some(book => book.id === bookId);
    };

    return (
        <div className="bookshelf">
            {isLoading ? (
                <div className="loading-container">
                    <ProgressBar value={false} />
                    <p>Loading books...</p>
                </div>
            ) : (
                <Grid
                    data={books}
                    sortable={true}
                    pageable={{
                        buttonCount: 5,
                        pageSizes: [10, 20, 50],
                        info: true,
                        type: 'numeric'
                    }}
                    {...gridState}
                    onDataStateChange={onGridStateChange}
                    style={{ height: 'calc(100vh - 200px)' }}
                    aria-label={gridTitle}
                >
                    <GridToolbar>
                        <div className="grid-title">{gridTitle}</div>
                    </GridToolbar>

                    <GridColumn field="title" title="Title" width="250px" />
                    <GridColumn field="authors" title="Author(s)" width="200px" />
                    <GridColumn field="publishedDate" title="Published" width="120px" />
                    <GridColumn
                        field="categories"
                        title="Categories"
                        cellRender={props => (
                            <td>{Array.isArray(props.dataItem.categories)
                                ? props.dataItem.categories.join(', ')
                                : 'Uncategorized'}
                            </td>
                        )}
                        width="150px"
                    />

                    <GridColumn width="100px"
                        cellRender={props => (
                            <td className="k-command-cell">
                                <Button
                                    themeColor="info"
                                    size="small"
                                    onClick={() => onBookSelect(props.dataItem)}
                                    title="View details"
                                    aria-label={`View details for ${props.dataItem.title}`}
                                >
                                    Details
                                </Button>
                            </td>
                        )}
                    />

                    <GridColumn width="120px"
                        cellRender={props => {
                            const bookInLibrary = isInLibrary(props.dataItem.id);
                            return (
                                <td className="k-command-cell">
                                    {!isLibraryView ? (
                                        <Button
                                            themeColor={bookInLibrary ? "warning" : "primary"}
                                            size="small"
                                            onClick={() => onAddToLibrary(props.dataItem)}
                                            disabled={bookInLibrary}
                                            title={bookInLibrary ? "Already in library" : "Add to library"}
                                            aria-label={`Add ${props.dataItem.title} to library`}
                                        >
                                            {bookInLibrary ? "Added" : "Add"}
                                        </Button>
                                    ) : (
                                        <Button
                                            themeColor="error"
                                            size="small"
                                            onClick={() => onRemoveFromLibrary(props.dataItem.id)}
                                            title="Remove from library"
                                            aria-label={`Remove ${props.dataItem.title} from library`}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </td>
                            );
                        }}
                    />
                </Grid>
            )}
        </div>
    );
};

export default Bookshelf;