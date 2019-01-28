import React, { PropTypes } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Text from 'ut-front-react/components/Text';
import EmptyStateWrapper from '../../components/Table/EmptyStateWrapper';

export default function EmptyState(props) {
    const { isLoading, error, emptyMessage, loadingMessage, errorMessage } = props;
    return (
        <EmptyStateWrapper>
        {isLoading
            ? <div>
                <CircularProgress style={{display: 'block', margin: '0 auto'}} />
                <Text>{loadingMessage}</Text>
            </div>
            : (error ? <Text>{errorMessage}</Text> : <Text>{emptyMessage}</Text>)
        }
        </EmptyStateWrapper>
    );
}

EmptyState.defaultProps = {
    emptyMessage: 'No results found',
    loadingMessage: 'Searching...',
    errorMessage: 'Couldn\'t load search results'
};

EmptyState.propTypes = {
    isLoading: PropTypes.bool,
    error: PropTypes.any,
    emptyMessage: PropTypes.string,
    loadingMessage: PropTypes.string,
    errorMessage: PropTypes.string
};
