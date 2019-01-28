export function immutableCellDataGetter({columnData, dataKey, rowData}) {
    return Array.isArray(dataKey) ? rowData.getIn(dataKey) : rowData.get(dataKey);
}
