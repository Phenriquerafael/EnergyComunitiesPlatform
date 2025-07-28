import { FunctionComponent } from "react";

interface TableProps {
    x: string[];
    y: string[]; // Assuming y is an array of strings for the table rows
    data?: { [key: string]: any[][] }; // Assuming data is an object with string keys and array values
}

const Table: FunctionComponent<TableProps> = ({ x, y, data }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    {x.map((header: string, index: number) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {y.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {x.map((col, colIndex) => (
                            <td key={colIndex}>{data?.[col]?.[rowIndex]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
 
export default Table;