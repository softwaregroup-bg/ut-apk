import { getTabValidations as getApkInfoTabValidations } from './config';

/**
 * If there are errors - the tab adds a "hasRaisedError" validation to the TabContainer,
 * and the TabContainer shows an error dialog when the user tries to Save a Product.
 * @param {Object|Immutable.Map} errors
 */
export const getTabValidations = (errors, allData, remote) => {
    let generalInfoTabValidations = getApkInfoTabValidations();
    return generalInfoTabValidations;
};

export const customValidators = {
};
