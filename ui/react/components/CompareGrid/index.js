import React, {PropTypes} from 'react';
import Accordion from 'ut-front-react/components/Accordion';
import DataList from 'ut-front-react/components/DataList';
import TitledContentBox from 'ut-front-react/components/TitledContentBox';
import Text from 'ut-front-react/components/Text';

import {capitalizeFirstLetter} from '../../helpers';
import styles from './styles.css';

function getPrimaryLanguage(langId, languages) {
    if (languages && languages.length) {
        let primaryLanguage = languages.filter((lang) => {
            return langId === lang.key;
        });

        return primaryLanguage && primaryLanguage.length ? primaryLanguage[0]['name'] : '';
    }
}

const CompareGrid = ({currentValues, newValues, languages}) => {
    // When created agent is send for approval for a first time,
    // his data is stored as current value in the db so we set newValues the same as currentValues in order to prevent type errors.
    let isNew = currentValues.agent && currentValues.agent.length && currentValues.agent[0]['isNew'];

    if (isNew === 1) {
        newValues = currentValues;
    }

    let langId = currentValues.agent && currentValues.agent.length ? currentValues.agent[0]['primaryLanguageId'] : '';
    let langIdUnapproved = newValues.agent && newValues.agent.length ? newValues.agent[0]['primaryLanguageId'] : '';
    let rejectReason = newValues.agent && newValues.agent.length ? newValues.agent[0]['rejectReason'] : '';
    let isDeleted = newValues.agent && newValues.agent.length ? newValues.agent[0]['isDeleted'] : '';

    function compareValuesWithDifferentLength(arr1, arr2) {
        let obj = {
            // this is used to indicate if the accordion should be open or not
            isOpen: false
        };
        if (!obj.isOpen && isNew && rejectReason) {
            obj.isOpen = true;
        }
        // map over the current values
        obj.current = arr1.map((el) => {
            // if the value passed is primary it should be bold
            let bold = el.value === 'Primary' ? 'bold' : '';
            // check if current value exist in the array of new values
            if (arr2.find((e) => e.key === el.key)) {
                // if it exist find its index in the array with the new values
                let index = arr2.findIndex((e) => e.key === el.key);
                let sameKey = el.key === (arr2[index] && arr2[index]['key']);
                let sameValue = el.value === (arr2[index] && arr2[index]['value']);
                // if the same keys and values are not changed this means that there is no change on the current value
                if (sameKey && sameValue) {
                    el.keyClass = 'cell bold top-bottom-padding';
                    el.valueClass = 'cell top-bottom-padding ' + bold;
                    return el;
                // Otherwise there is a change and the proper css classes should be applied
                } else {
                    el.keyClass = 'cell bold top-bottom-padding changedCurrentValue';
                    el.valueClass = 'cell top-bottom-padding changedCurrentValue ' + bold;
                    // if there is change this means that accordion should be open
                    if (!obj.isOpen) {
                        obj.isOpen = true;
                    }
                    return el;
                }
            } else {
                // if current value is not present in new values that means it is deleted and proper css classes should be applied
                el.keyClass = 'cell bold top-bottom-padding changedCurrentValue';
                el.valueClass = 'cell top-bottom-padding changedCurrentValue ' + bold;
                if (!obj.isOpen) {
                    obj.isOpen = true;
                }
                return el;
            }
        });
        // similar logic is used for new values too
        obj.unapproved = arr2.map((el) => {
            let bold = el.value === 'Primary' ? 'bold' : '';
            if (arr1.find((e) => e.key === el.key)) {
                let index = arr1.findIndex((e) => e.key === el.key);
                let sameKey = el.key === (arr1[index] && arr1[index]['key']);
                let sameValue = el.value === (arr1[index] && arr1[index]['value']);
                if (sameKey && sameValue) {
                    el.keyClass = 'cell bold top-bottom-padding';
                    el.valueClass = 'cell top-bottom-padding ' + bold;
                    return el;
                } else {
                    el.keyClass = 'cell bold top-bottom-padding changedNewValue';
                    el.valueClass = 'cell top-bottom-padding changedNewValue ' + bold;
                    if (!obj.isOpen) {
                        obj.isOpen = true;
                    }
                    return el;
                }
            } else {
                el.keyClass = 'cell bold top-bottom-padding changedNewValue';
                el.valueClass = 'cell top-bottom-padding changedNewValue ' + bold;
                if (!obj.isOpen) {
                    obj.isOpen = true;
                }
                return el;
            }
        });
        return obj;
    }

    function compareValues(arr1, arr2) {
        let obj = {
            isOpen: false
        };
        obj.current = arr1.map((el, i) => {
            if (el.value === (arr2[i] && arr2[i]['value'])) {
                el.keyClass = 'cell bold top-bottom-padding';
                el.valueClass = 'cell top-bottom-padding';
                return el;
            } else {
                el.keyClass = 'cell bold top-bottom-padding changedCurrentValue';
                el.valueClass = 'cell top-bottom-padding changedCurrentValue';
                if (!obj.isOpen) {
                    obj.isOpen = true;
                }
                return el;
            }
        });
        obj.unapproved = arr2.map((el, i) => {
            if (el.value === (arr1[i] && arr1[i]['value'])) {
                el.keyClass = 'cell bold top-bottom-padding';
                el.valueClass = 'cell top-bottom-padding';
                return el;
            } else {
                el.keyClass = 'cell bold top-bottom-padding changedNewValue';
                el.valueClass = 'cell top-bottom-padding changedNewValue';
                if (!obj.isOpen) {
                    obj.isOpen = true;
                }
                return el;
            }
        });
        return obj;
    }
    // When unlock agent procedure is called there aren't any new values for person returned from the database in that case use those that are already approved
    if (currentValues.agent && currentValues.agent[0]['isEnabled'] === false) {
        Object.keys(newValues).forEach((key) => {
            // swap every key except agent
            if (key !== 'agent') {
                newValues[key] = currentValues[key];
            }
        });
    }
    // organize data in categories
    let externalUsersCurrent = currentValues.externalUsers && currentValues.externalUsers.reduce((acc, curr) => {
        let username;
        let value;
        if (curr.generic && curr.userTypeDropDownKey !== 'nonGeneric') {
            username = 'User Alias';
            value = curr.userAlias;
        } else {
            username = 'User Name';
            value = curr.username;
        }
        let unitObj = {
            name: curr.externalSystemName,
            data: [
                {
                    key: username,
                    value: value || 'Not Set'
                },
                {
                    key: 'Generic',
                    value: curr.generic ? 'Yes' : 'No'
                },
                {
                    key: 'Active',
                    value: curr.active ? 'Yes' : 'No'
                }
            ]
        };
        acc.push(unitObj);
        return acc;
    }, []);

    let externalUsersUnapproved = newValues.externalUsers && newValues.externalUsers.reduce((acc, curr) => {
        let username;
        let value;
        if (curr.generic && curr.userTypeDropDownKey !== 'nonGeneric') {
            username = 'User Alias';
            value = curr.userAlias;
        } else {
            username = 'User Name';
            value = curr.username;
        }
        let unitObj = {
            name: curr.externalSystemName,
            data: [
                {
                    key: username,
                    value: value || 'Not Set'
                },
                {
                    key: 'Generic',
                    value: curr.generic ? 'Yes' : 'No'
                },
                {
                    key: 'Active',
                    value: curr.active ? 'Yes' : 'No'
                }
            ]
        };

        acc.push(unitObj);
        return acc;
    }, []);

    let generalInfoCurrent = [
        {
            key: 'First Name',
            value: currentValues.person && currentValues.person.firstName ? currentValues.person.firstName : 'Not Set'
        },
        {
            key: 'Last Name',
            value: currentValues.person && currentValues.person.lastName ? currentValues.person.lastName : 'Not Set'
        },
        {
            key: 'Gender',
            value: currentValues.person && currentValues.person.gender ? currentValues.person.gender : 'Not Set'
        },
        {
            key: 'Primary Language',
            value: currentValues.agent ? getPrimaryLanguage(langId, languages) : 'Not Set'
        },
        {
            key: 'Phone Model',
            value: currentValues.person && currentValues.person.phoneModel ? currentValues.person.phoneModel : 'Not Set'
        },
        {
            key: 'Computer Model',
            value: currentValues.person && currentValues.person.computerModel ? currentValues.person.computerModel : 'Not Set'
        },
        {
            key: 'Status',
            value: currentValues.agent && currentValues.agent.length ? currentValues.agent[0]['statusId'] : 'Not Set'
        },
        {
            key: 'Lock',
            value: currentValues.agent && currentValues.agent.length && currentValues.agent[0]['isEnabled'] ? 'Unlocked' : 'Locked'
        }

    ];

    let generalInfoUnapproved = [
        {
            key: 'First Name',
            value: newValues.person && newValues.person.firstName ? newValues.person.firstName : 'Not Set'
        },
        {
            key: 'Last Name',
            value: newValues.person && newValues.person.lastName ? newValues.person.lastName : 'Not Set'
        },
        {
            key: 'Gender',
            value: newValues.person && newValues.person.gender ? newValues.person.gender : 'Not Set'
        },
        {
            key: 'Primary Language',
            value: newValues.agent ? getPrimaryLanguage(langIdUnapproved, languages) : 'Not Set'
        },
        {
            key: 'Phone Model',
            value: newValues.person && newValues.person.phoneModel ? newValues.person.phoneModel : 'Not Set'
        },
        {
            key: 'Computer Model',
            value: newValues.person && newValues.person.computerModel ? newValues.person.computerModel : 'Not Set'
        },
        {
            key: 'Status',
            value: newValues.agent && newValues.agent.length ? newValues.agent[0]['statusId'] : 'Not Set'
        },
        {
            key: 'Lock',
            value: newValues.agent && newValues.agent.length && newValues.agent[0]['isEnabled'] ? 'Unlocked' : 'Locked'
        }
    ];

    let emailCurrent = currentValues.email
        ? currentValues.email.map((mail) => {
            return {
                key: capitalizeFirstLetter(mail.emailTypeId),
                value: mail.value
            };
        }) : [];

    let emailUnapproved = newValues.email
        ? newValues.email.map((mail) => {
            return {
                key: capitalizeFirstLetter(mail.emailTypeId),
                value: mail.value
            };
        }) : [];

    let addressesCurrent = currentValues.address
        ? currentValues.address.map((singleAddress) => {
            return {
                key: capitalizeFirstLetter(singleAddress.addressTypeId),
                value: singleAddress.value
            };
        })
        : [];

    let addressesUnapproved = newValues.address
        ? newValues.address.map((singleAddress) => {
            return {
                key: capitalizeFirstLetter(singleAddress.addressTypeId),
                value: singleAddress.value
            };
        })
        : [];

    let phoneCurrent = currentValues.phone
        ? currentValues.phone.map((singlePhone) => {
            return {
                key: capitalizeFirstLetter(singlePhone.phoneTypeId),
                value: singlePhone.phoneNumber
            };
        })
        : [];

    let phoneUnapproved = newValues.phone
        ? newValues.phone.map((singlePhone) => {
            return {
                key: capitalizeFirstLetter(singlePhone.phoneTypeId),
                value: singlePhone.phoneNumber
            };
        })
        : [];

    let usernameCurrent;

    if (currentValues.hash && currentValues.hash[0]) {
        currentValues.hash.map(h => {
            if (h.type === 'password') {
                usernameCurrent = h.identifier || 'Not Set';
            }
            return h;
        });
    }

    let credentialsCurrent = [
        {
            key: 'Username',
            value: usernameCurrent
        },
        {
            key: 'Access Policy',
            value: currentValues['policy.basic'] && currentValues['policy.basic']['length'] ? currentValues['policy.basic'][0]['name'] : 'Not Set'
        }
    ];

    let usernameUnapproved;

    if (newValues.hash && newValues.hash[0]) {
        newValues.hash.map(h => {
            if (h.type === 'password') {
                usernameUnapproved = h.identifier || 'Not Set';
            }
            return h;
        });
    }

    let credentialsUnapproved = [
        {
            key: 'Username',
            value: usernameUnapproved
        },
        {
            key: 'Access Policy',
            value: newValues['policy.basic'] && newValues['policy.basic']['length'] ? newValues['policy.basic'][0]['name'] : 'Not Set'
        }
    ];

    let rolesCurrent = currentValues.roles
        ? currentValues.roles.filter((role) => {
            return role.isAssigned;
        }).map((filteredRole) => {
            let value = filteredRole.isDefault ? 'Primary' : 'Secondary';

            return {
                key: filteredRole.name,
                value: value
            };
        })
        : [];
    let rolesUnapproved = newValues.roles
        ? newValues.roles.filter((role) => {
            return role.isAssigned;
        }).map((filteredRole) => {
            let value = filteredRole.isDefault ? 'Primary' : 'Secondary';

            return {
                key: filteredRole.name,
                value: value
            };
        })
        : [];

    let memberOfCurrent = currentValues.memberOf
        ? currentValues.memberOf.map((unit) => {
            let value = unit.isDefault ? 'Primary' : 'Secondary';

            return {
                key: unit.organizationName,
                value: value
            };
        })
        : [];
    let memberOfUnapproved = newValues.memberOf
        ? newValues.memberOf.map((unit) => {
            let value = unit.isDefault ? 'Primary' : 'Secondary';

            return {
                key: unit.organizationName,
                value: value
            };
        })
        : [];

    // arrays for current and new values for external users have different length
    // we need the bigger one
    let externalSystems = {};

    if (externalUsersCurrent && externalUsersUnapproved) {
        let findBiggerArrayIndex = (arr1, arr2) => {
            return arr1.length > arr2.length ? arr1.length : arr2.length;
        };
        // combine data into single object for each category and add the css classes
        let loopLength = findBiggerArrayIndex(externalUsersCurrent, externalUsersUnapproved);

        for (let i = 0; i < loopLength; i++) {
            let fallBack = {data: []};
            let obj = {};
            let unitUnapproved = externalUsersUnapproved[i] || fallBack;
            let unitApproved = externalUsersCurrent[i] || fallBack;
            obj.name = unitApproved.name || unitUnapproved.name;
            obj.nameUnapproved = unitUnapproved.name || unitApproved.name;
            obj.data = compareValuesWithDifferentLength(unitApproved.data, unitUnapproved.data);
            externalSystems.isOpen = false;
            externalSystems.systems = externalSystems.systems || [];
            externalSystems.systems.push(obj);

            if (!externalSystems.isOpen) {
                externalSystems.systems.forEach(sys => {
                    if (sys.data.isOpen) {
                        externalSystems.isOpen = true;
                    }
                });
            }
        }
    }
    // combine data into single object for each category and add the css classes

    let generalInfo = generalInfoCurrent && generalInfoUnapproved ? compareValues(generalInfoCurrent, generalInfoUnapproved) : [];
    let email = emailCurrent && emailUnapproved ? compareValuesWithDifferentLength(emailCurrent, emailUnapproved) : [];
    let address = addressesCurrent && addressesUnapproved ? compareValuesWithDifferentLength(addressesCurrent, addressesUnapproved) : [];
    let phone = phoneCurrent && phoneUnapproved ? compareValuesWithDifferentLength(phoneCurrent, phoneUnapproved) : [];
    let credentials = credentialsCurrent && credentialsUnapproved ? compareValues(credentialsCurrent, credentialsUnapproved) : [];
    let roles = rolesCurrent && rolesUnapproved ? compareValuesWithDifferentLength(rolesCurrent, rolesUnapproved) : [];
    let memberOf = memberOfCurrent && memberOfUnapproved ? compareValuesWithDifferentLength(memberOfCurrent, memberOfUnapproved) : [];

    return (
        <div className={styles.wrapper}>
            {isNew && !isDeleted ? <h1 className={styles.newUser}>New User</h1> : ''}
            {isDeleted ? <h1 className={styles.rejectTextField}>User will be deleted</h1> : ''}
            {rejectReason && rejectReason.length
            ? <Accordion title={<Text>Changes Rejected</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={false}>
                <div className={styles.container}>
                    <div className={styles.whole}>
                        <p className={styles.rejectTextField}>{rejectReason}</p>
                    </div>
                </div>
            </Accordion> : ''}
            <Accordion title={<Text>General info</Text>} marginBottom={false} externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!generalInfo.isOpen}>
                <div className={styles.container}>
                    <div className={(isDeleted || isNew) ? styles.whole : (isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>information</Text>}>
                            <DataList data={generalInfo && generalInfo.current} />
                        </TitledContentBox>
                    </div>
                    {(isDeleted || isNew)
                       ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>updated information</Text>}>
                            <DataList data={generalInfo && generalInfo.unapproved} />
                        </TitledContentBox>
                    </div>}
                </div>
            </Accordion>
            {(email.current || email.unapproved) && (email.current.length || email.unapproved.length) ? <Accordion title={<Text>Email</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!email.isOpen}>
                <div className={styles.container}>
                    <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>information</Text>}>
                            <DataList data={email && email.current} />
                        </TitledContentBox>
                    </div>
                    {(isDeleted || isNew)
                        ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>updated information</Text>}>
                            <DataList data={email && email.unapproved} />
                        </TitledContentBox>
                    </div>}
                </div>
            </Accordion> : ''}
            {(address.current || address.unapproved) && (address.current.length || address.unapproved.length) ? <Accordion title={<Text>Address</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!address.isOpen}>
                <div className={styles.container}>
                    <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>information</Text>}>
                            <DataList data={address && address.current} />
                        </TitledContentBox>
                    </div>
                    {(isDeleted || isNew)
                    ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>updated information</Text>}>
                            <DataList data={address && address.unapproved} />
                        </TitledContentBox>
                    </div>}
                </div>
            </Accordion> : ''}
            {(phone.current || phone.unapproved) && (phone.current.length || phone.unapproved.length) ? <Accordion title={<Text>Phone</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!phone.isOpen}>
                <div className={styles.container}>
                    <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>information</Text>}>
                            <DataList data={phone && phone.current} />
                        </TitledContentBox>
                    </div>
                    {(isDeleted || isNew)
                        ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>updated information</Text>}>
                            <DataList data={phone && phone.unapproved} />
                        </TitledContentBox>
                    </div>}
                </div>
            </Accordion> : ''}
            {memberOf.current && memberOf.current.length ? <Accordion title={<Text>Business Unit</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!memberOf.isOpen}>
                <div className={styles.container}>
                    <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>information</Text>}>
                            <DataList data={memberOf && memberOf.current} />
                        </TitledContentBox>
                    </div>
                    {(isDeleted || isNew)
                        ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>updated information</Text>}>
                            <DataList data={memberOf && memberOf.unapproved} />
                        </TitledContentBox>
                    </div>}
                </div>
            </Accordion> : ''}
            {(roles.current || roles.unapproved) && (roles.current.length || roles.unapproved.length) ? <Accordion title={<Text>Assigned Roles</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!roles.isOpen}>
                <div className={styles.container}>
                    <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>information</Text>}>
                            <DataList data={roles && roles.current} />
                        </TitledContentBox>
                    </div>
                    {(isDeleted || isNew)
                        ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>updated information</Text>}>
                            <DataList data={roles && roles.unapproved} />
                        </TitledContentBox>
                    </div>}
                </div>
            </Accordion> : ''}
            {credentials.current && credentials.current.length ? <Accordion title={<Text>Credentials</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!credentials.isOpen}>
                <div className={styles.container}>
                    <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>information</Text>}>
                            <DataList data={credentials && credentials.current} />
                        </TitledContentBox>
                    </div>
                    {(isDeleted || isNew)
                        ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                        <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={<Text>updated information</Text>}>
                            <DataList data={credentials && credentials.unapproved} />
                        </TitledContentBox>
                    </div>}
                </div>
            </Accordion> : ''}
            {externalSystems && externalSystems.systems && externalSystems.systems.length ? <Accordion title={<Text>External Credentials</Text>} marginBottom={false} fullWidth externalBodyClasses={styles.accordionBody} externalTitleClasses={styles.accordionTitle} className={styles.accordion} collapsed={!externalSystems.isOpen}>
                {externalSystems.systems.map((sys, i) => {
                    return <div key={i} className={styles.container}>
                                <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                                    <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={sys.data.current.length ? `information ${sys.name}` : 'information'}>
                                        <DataList data={sys.data.current} />
                                    </TitledContentBox>
                                </div>
                                {(isDeleted || isNew)
                                    ? '' : <div className={(isDeleted || isNew) ? styles.whole : styles.half}>
                                    <TitledContentBox externalContentClasses={styles.titledBoxBody} externalHeaderClasses={styles.titleBoxTitle} title={sys.data.unapproved.length ? `updated information ${sys.nameUnapproved}` : 'updated information'}>
                                        <DataList data={sys.data.unapproved} />
                                    </TitledContentBox>
                                </div>}
                            </div>;
                })}
            </Accordion> : ''}
        </div>
    );
};

CompareGrid.propTypes = {
    currentValues: PropTypes.object.isRequired,
    newValues: PropTypes.object.isRequired,
    languages: PropTypes.array
};

export default CompareGrid;
