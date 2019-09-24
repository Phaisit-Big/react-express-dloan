import React, { Component } from 'react';
import { Button, Table, Col } from 'reactstrap';
import DynamicHeader from '../Header.js';

class disbursementSummery extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    };

    //p-rest
    openInqPositionDetail() {
    var account = JSON.parse(sessionStorage.getItem("data_inqLoanAccount"));
    //console.log(account.account_number);
    fetch('/api/inqPositionDetail/' + account.account_number).then(response => response.json())
        .then(data => {
            //console.log(data);
            if (data) {
                const maximum = Math.max(...data.map(item => item.posnNbr));
                //console.log(maximum);
                const getdata = data.find(element => element.posnNbr === maximum);
                let body = {
                    account_sequence: getdata.posnNbr,
                    open_date: getdata.openDate,
                    principal_balance: getdata.bal
                };
                sessionStorage.setItem("data_inqPositionDetail", JSON.stringify(body));
                window.open('/ipdprestSummary', '_self');
            } else {
                alert("Data not found.");
            }
        }).catch(error => console.log(error))
    }

    // openInqPositionDetail() {
    //     let account = JSON.parse(sessionStorage.getItem("data_inqLoanAccount"));
    //     console.log(account.account_number);
    //     fetch('/api/inquiryPositionDetail/' + account.account_number).then(response => response.json())
    //         .then(data => {
                //console.log(data);
                // if (data) {
                //     const maximum = Math.max(...data.map(item => item.posnNbr));
                //     //console.log(maximum);
                //     const getdata = data.find(element => element.posnNbr === maximum);
                //     let body = {
                //         account_sequence: getdata.posnNbr,
                //         open_date: getdata.openDate,
                //         principal_balance: getdata.bal
                //     };
                //     sessionStorage.setItem("data_inqPositionDetail", JSON.stringify(body));
                //     window.open('/ipdSummary', '_self');
                // } else {
                //     alert("Data not found.");
                // }
            // }).catch(error => console.log(error))


        //mockdata
        // let data = {
        //     "rs_body": {
        //         "position_detail": [
        //             {
        //                 "account_number": 111111111103,
        //                 "account_sequence": 1,
        //                 "interest_index": "MRR",
        //                 "interest_spread": -3.00000,
        //                 "penalty_index": "PEN",
        //                 "open_date": "2019-09-12",
        //                 "open_datetime_stamp": "2019-09-12T11:19:10Z",
        //                 "grace_day": 5,
        //                 "is_catch_up": true,
        //                 "customer_type": "0703",
        //                 "account_branch": 20,
        //                 "daily_accrued_amount": 0.10959,
        //                 "unpaid_accrued_amount": 0.00000
        //             }
        //         ]
        //     }
        // }
        // if (data.rs_body) {
        //     sessionStorage.setItem("data_inqPositionDetail", JSON.stringify(data.rs_body.position_detail));
        //     window.open('/ipdSummary', '_self');
        // } else {
        //     alert("Data not found.");
        // }
    //};

    dynamicResponse = (data) => {
        let table = [];
        let children = [];
        // eslint-disable-next-line
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === "object") {
                    let obj = [];
                    // eslint-disable-next-line
                    for (let subdata in data[key]) {
                        if (data[key].hasOwnProperty(subdata)) {
                            if (typeof data[key][subdata] === "boolean") {
                                let catchup = String(data[key][subdata]);
                                obj.push(<tr><td>{subdata}</td><td>{catchup}</td></tr>)
                            } else {
                                obj.push(<tr><td>{subdata}</td><td>{data[key][subdata]}</td></tr>);
                            }
                        }
                    }
                    children.push(<tr><td>{key + " : "}</td><td><Table>{obj}</Table></td></tr>);
                } else {
                    children.push(<tr><td>{key}</td><td>{data[key]}</td></tr>);
                }
            }
        }
        table.push(<Table bordered >{children}</Table>);
        return table;
    };

    render() {
        const account = JSON.parse(sessionStorage.getItem("data_inqLoanAccount"));
        const data = JSON.parse(sessionStorage.getItem("response_disbursement"));
        return (
            <div className="App">
                <DynamicHeader />
                <br />
                    <h2>Form Data Disbursement</h2>
                <br />
                <Col md={{ size: 4, offset: 4 }}>
                    {/* <Alert color="success"><h3>Success!!</h3></Alert> */}
                    {this.dynamicResponse(data.rs_body)}
                </Col>
                <br />
                <Button color="success" onClick={this.openInqPositionDetail}>Inquiry Position Detail pREST
                    : {account.account_number}</Button>
            </div>
        );
    };
}

export default disbursementSummery;