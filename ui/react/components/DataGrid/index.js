import React, { PropTypes } from 'react';
import Select from 'react-select';
import { List } from 'immutable';
import Row from './Row';

DataGrid.propTypes = {
    data: PropTypes.instanceOf(List).isRequired,
    headers: PropTypes.array.isRequired,
    users: PropTypes.array
};

export default function DataGrid({ headers, data, users }) {
    return (
        <table>
            <thead>
                <tr>
                    {headers.map((h, i) =>
                        <th key={i} className='padding-all-20 f-grey f-semibold border-bottom bg-white'>
                            {h.type === 'text' && h.description}
                            {h.type === 'text' || <Select className='select-purple' name='evaluatedBy' options={h.description} placeholder={h.placeholder} />}
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {data.map((d, i) =>
                    <Row key={i} headers={headers} data={d} users={users} />
                )}
            </tbody>
        </table>
    );
}
