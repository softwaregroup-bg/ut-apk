import React, { PropTypes } from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import TableCell from '../TableCell.js';

const Row = ({ headers, data, users }) => {
    let row = [];
    headers.forEach((h, i) => {
        switch (h.value) {
            case 'applicationNumber':
                row.push(<TableCell key={i}>{data.get('applicationId')}</TableCell>);
                break;
            case 'customer':
                row.push(<TableCell key={i} className='padding-all-20 f-default f-semibold border-bottom bg-white'>{data.customerName}</TableCell>);
                break;
            case 'amount':
                row.push(<TableCell key={i}>{data.loanAmount}</TableCell>);
                break;
            case 'duration':
                row.push(<TableCell key={i} className='padding-all-20 f-default border-bottom bg-white f-center'>{data.term}</TableCell>);
                break;
            case 'by':
                row.push(<TableCell key={i}>{data.par}</TableCell>);
                break;
            case 'creation':
                row.push(<TableCell key={i}>{data.get('createdOn')}</TableCell>);
                break;
            case 'assignmenTableCellate' :
                row.push(<TableCell key={i}>{data.assignmenTableCellate}</TableCell>);
                break;
            case 'loanCycle' :
                row.push(<TableCell key={i}>{data.loanCycle}</TableCell>);
                break;
            case 'loanState':
                var statutClass;
                if (data.loanState === 'Approuve') {
                    statutClass = 'padding-all-20 f-green border-bottom bg-white';
                } else if (data.loanState === 'Reject') {
                    statutClass = 'padding-all-20 f-red border-bottom bg-white';
                } else {
                    statutClass = 'padding-all-20 f-blue border-bottom bg-white';
                }
                row.push(<TableCell key={i} className={statutClass}>{data.loanState}</TableCell>);
                break;
            case 'creditCommitteeOn' :
                row.push(<TableCell key={i}>{data.creditCommitteeOn}</TableCell>);
                break;
            case 'sector' :
                row.push(<TableCell key={i}>{data.sector}</TableCell>);
                break;
            case 'assignTo':
                row.push(
                    <TableCell key={i} className='f-default border-bottom bg-white padding-all-10'>
                        <Select
                          className='select-purple'
                          name='evaluatedBy'
                          value='1000'
                          options={users}
                        />
                    </TableCell>
                );
                break;
            case 'portfolioManager' :
                row.push(
                    <TableCell key={i} className='f-default border-bottom bg-white padding-all-10'>
                        <Select
                          className='select-purple'
                          name='evaluatedBy'
                          value='1000'
                          options={users}
                        />
                    </TableCell>
                );
                break;
            case 'contractIdNumber' :
                row.push(<TableCell key={i}>{data.contractIdNumber}</TableCell>);
                break;
            case 'lateDays' :
                row.push(<TableCell key={i}>{data.lateDays}</TableCell>);
                break;
            case 'currentAccount' :
                row.push(<TableCell key={i}>{data.currentAccount}</TableCell>);
                break;
            case 'savingAccount' :
                row.push(<TableCell key={i}>{data.savingAccount}</TableCell>);
                break;
            case 'installment' :
                row.push(<TableCell key={i}>{data.installment}</TableCell>);
                break;
            case 'portFolioManagerName' :
                row.push(<TableCell key={i}>{data.portFolioManager}</TableCell>);
                break;
            case 'maturity' :
                row.push(<TableCell key={i}>{data.maturity}</TableCell>);
                break;
            case 'nextInstallment' :
                row.push(<TableCell key={i}>{data.nextInstallment}</TableCell>);
                break;
            case 'status' :
                var statusClass = data.status + 'Img';
                row.push(
                    <TableCell key={i} className='padding-all-20 f-default border-bottom bg-white f-center'>
                        <div className={statusClass} />
                    </TableCell>
                );
                break;
            default: {
                row.push(<TableCell key={i}>&nbsp;</TableCell>);
                break;
            }
        }
    });
    return (
        <tr className='f-nowrap'>
            {row}
        </tr>
    );
};
Row.propTypes = {
    data: PropTypes.object.isRequired,
    headers: PropTypes.array.isRequired,
    users: PropTypes.array
};

export default Row;
