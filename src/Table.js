import React from 'react'
import "./Table.css";
import numeral from "numeral";

function Table({countries}) {
    return (
        <table className="table">
            <tbody>
            {
                countries.map(({country,cases},index) => (
                    <tr key={index}>
                        <td>{country}</td>
                        <td><strong>{numeral(cases).format("0,0")}</strong></td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    )
}

export default Table
