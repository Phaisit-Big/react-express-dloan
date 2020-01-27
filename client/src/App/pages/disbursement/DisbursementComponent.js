import React, { Component, useState } from 'react';
import { Table, Button, Col, Container, Form, FormGroup, Input, Label, Row } from 'reactstrap';
import DynamicHeader from '../Header.js';
import inputModel from './model.json';
import utility from '../Utility.js';
import SpinnerLoader from '../loading.js';
import ReactModal from 'react-modal';

const cloneDeep = require('lodash.clonedeep');
let installmentAmount = "";
let numberOfPayment = "";
const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class disbursementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rq_body: {
                account_number: "",
                disbursement_amount: 0,
                effective_date: "",
                channel_post_date: "",
                currency_code: "THB",
                service_branch: 0,
                clearing_and_settlement_key: "",
                other_properties: {
                    interest_index: "",
                    interest_spread: 0,
                    first_payment_date: "",
                    number_of_payment: 0,
                    installment_amount: 0,
                    payment_calculation_method: "",
                    interest_override_reason:"",
                    campaign_name:"",
                    interest_schedule:[]
                }
            },
            loading: false,
            disabled: "",
            rows:[],
            showModal:false,
            date:"",
            interest_index:"",
            interest_spread:"",
            // myArray : [{"date":"2020-01-01","interest_index":"1","interest_spread":"1"}]
            myArray : []

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeTest = this.handleChangeTest.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    };

    componentDidMount() {
        let disbursementAmount = 0;
        let accountNumber = "";

        if((JSON.parse(sessionStorage.getItem("disburse_interest")))){
            sessionStorage.removeItem("disburse_interest")
        }

        if (JSON.parse(sessionStorage.getItem("response_installment"))) {
            const dataInstallment = JSON.parse(sessionStorage.getItem("response_installment"));
            installmentAmount = dataInstallment.rs_body.installment_amount;
        } else {
            console.log("sessionStorage response_installment not found!");
        }

        if (JSON.parse(sessionStorage.getItem("request_disbursement"))) {
            const inputDisbursement = JSON.parse(sessionStorage.getItem("request_disbursement"));
            disbursementAmount = inputDisbursement.disbursement_amount;
            numberOfPayment = inputDisbursement.number_of_payment;
        } else {
            console.log("sessionStorage request_disbursement not found!");
        }

        if (JSON.parse(sessionStorage.getItem("account_number"))) {
            const account = JSON.parse(sessionStorage.getItem("account_number"));
            accountNumber = account;
        } else {
            console.log("sessionStorage account_number not found!");
        }
        const body = {
            account_number: accountNumber,
            disbursement_amount: disbursementAmount,
            effective_date: "",
            channel_post_date: "",
            currency_code: "THB",
            service_branch: 0,
            clearing_and_settlement_key: "CBS",
            other_properties: {
                interest_index: "",
                interest_spread: 0,
                first_payment_date: "",
                number_of_payment: String(numberOfPayment),
                installment_amount:String(installmentAmount),
                payment_calculation_method: "installment"
            }
        };
        this.setState({ rq_body: body });
    };

    handleChangeTest(event){
        console.log(event.target.value);
        if(event.target.name === "date"){
            this.setState({date : event.target.value});
        }else if(event.target.name === "interest_index"){
            this.setState({interest_index : event.target.value})
        }else if(event.target.name === "interest_spread"){
            this.setState({interest_spread : event.target.value});
        }
    }

    handleChange(event) {
        //this.setState({[event.target.name]:event.target.value});
        const { rq_body } = { ...this.state };
        const currentState = rq_body;
        const properties = currentState.other_properties;
        if (event.target.name === "interest_index" || event.target.name === "interest_spread"
            || event.target.name === "first_payment_date" || event.target.name === "number_of_payment"
            || event.target.name === "installment_amount" || event.target.name === "interest_override_reason"
            || event.target.name === "campaign_name"){

            properties[event.target.name] = event.target.value;

        } else if (event.target.name === "payment_calculation_method"){
            //check drop down payment_calculation_method field
            properties[event.target.name] = event.target.value;
            if(event.target.value === "minimum"){
                properties["installment_amount"] = "";
                properties["number_of_payment"] = "";
                this.setState({disabled : "disabled"});
            }else{
                properties["installment_amount"] = String(installmentAmount);
                properties["number_of_payment"] = String(numberOfPayment);
                this.setState({disabled : ""});
            }
        }
        else{
            currentState[event.target.name] = event.target.type === "number" ? Number(event.target.value) : event.target.value;
        }
        this.setState({ rq_body: currentState });
    };

    handleSubmit(event) {

        console.log(sessionStorage.getItem("disburse_interest"));

        //set Array for interest schedule
        const { rq_body } = { ...this.state };
        const currentState = rq_body;
        const properties = currentState.other_properties;
        properties["interest_schedule"] = JSON.parse(sessionStorage.getItem("disburse_interest"));


        // this.setState({ rq_body[""]["interest_schedule"] : JSON.parse(sessionStorage.getItem("disburse_interest"))});

        event.preventDefault();
        this.setState({ loading: true });
        //clone state for use in omit function.
        let body = cloneDeep(this.state);
        const request = utility.omit(body);
        // console.log(request);
        setTimeout(() => {
             this.setState({ loading: false });
             this.postList(request);
        }, 1000)
    };

    postList = (request) => {
        console.log("myRequest : " + JSON.stringify(request));
        fetch('/api/disbursement', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(request),
        }).then(response => response.json())
            .then(data => {

                if (data.rs_body) {
                    utility.clearSessionStorage("response_disbursement");
                    sessionStorage.setItem("response_disbursement", JSON.stringify(data));
                    window.open('/dbmSummary', '_self');
                } else {
                    alert("error code : " + data.errors.map(error => error.error_code) + "\n"
                        + "error desc : " + data.errors.map(error => error.error_desc) + "\n"
                        + "error type : " + data.errors.map(error => error.error_type));
                }
            }).catch(error => console.log(error))

        //mock data
        // let data =  {"rs_body":{"account_number":600000000067,"account_sequence":1,"balance":1000.00}}
        // if (data.rs_body) {
        //         sessionStorage.setItem("response_disbursement",JSON.stringify(data));
        //         window.open('/dbmSummary', '_self');
        // } else {
        //     alert("error code : " + data.errors.map(error => error.error_code) + "\n"
        //     + "error desc : " + data.errors.map(error => error.error_desc) + "\n"
        //     + "error type : " + data.errors.map(error => error.error_type));
        // }
    };

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    closeModal () {

        this.setState({ showModal: false });
    }

    handleCloseModal () {

        this.setState({ showModal: false });

        var dataArray = [];
        var data = {
            date : this.state.date,
            interest_index : this.state.interest_index,
            interest_spread : this.state.interest_spread
        };
        console.log("DATA:"+ JSON.stringify(data));

        // sessionStorage.clear();
        if(sessionStorage.getItem("disburse_interest") != null){
            dataArray = JSON.parse(sessionStorage.getItem("disburse_interest"));
            console.log("getget ="+dataArray);
            dataArray.push(data);

            for (var i = 0; i < dataArray.length; i++)
                console.log((i+1) + ": " + JSON.stringify(dataArray[i]));

            sessionStorage.setItem("disburse_interest", JSON.stringify(dataArray));
        } else{
            dataArray.push(data);
            sessionStorage.setItem("disburse_interest", JSON.stringify(dataArray));
            console.log(dataArray);
        }

        //[{"date":"2020-01-23","interest_index":"1","interest_spread":"1"}]

        this.renderTable();

        //
        // this.setState({date : ""});
        // this.setState({interest_index : ""});
        // this.setState({interest_spread : ""});
        // this.renderTableData()
    }

    renderTable() {
        if(sessionStorage.getItem("disburse_interest") != null){
            return
        }
    }


    handleAddRow = () => {
        this.setState((prevState, props) => {
            const row = { content: "hello this is a new row!" };
            return { rows: [...prevState.rows, row] };
        });
    };

    handleRemoveRow = () => {
        this.setState((prevState, props) => {
            return { rows: prevState.rows.slice(1) };
        });
    };

    FormInputData = () => {
        return inputModel.model.map(item => {
            if (item.root === null) {
                return (
                        <FormGroup>
                            <Label>{item.label}</Label>
                            <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                value={this.state.rq_body[item.value]} onChange={this.handleChange} />
                        </FormGroup>
                );
            } else {
                if (item.type === "select") {
                    return (
                            <FormGroup>
                                <Label>{item.label}</Label>
                                <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                    value={this.state.rq_body[item.root][item.value]} onChange={this.handleChange} >
                                    {item.items.map(element => <option>{element}</option>)}
                                </Input>
                            </FormGroup>
                    )
                } else {
                    if(item.name === "installment_amount" || item.name ==="number_of_payment"){
                        return (
                                <FormGroup>
                                    <Label>{item.label}</Label>
                                    <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                         value={this.state.rq_body[item.root][item.value]}
                                         onChange={this.handleChange} disabled={this.state.disabled} />
                                </FormGroup>
                        )
                    }else{
                        return (
                                <FormGroup>
                                    <Label>{item.label}</Label>
                                    <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                        value={this.state.rq_body[item.root][item.value]} onChange={this.handleChange} />
                                </FormGroup>
                        )
                    }
                }
            }
        })
    };

    renderTableData() {
        return this.state.myArray.map((arr, index) => {
            const { date, interest_index, interest_spread } = arr; //destructuring
            return (
                <tr key={index}>
                    <td>{index}</td>
                    <td>{date}</td>
                    <td>{interest_index}</td>
                    <td>{interest_spread}</td>
                </tr>
            )
        })
    }

    render() {
        const { loading } = this.state;
        return (
            <div>
                <DynamicHeader />
                <h2>Form Input Disbursement</h2>
                <Container>
                    <Form onSubmit={this.handleSubmit}>
                        <Row>
                            <Col md={{ size: 4, offset: 4 }}>
                                {this.FormInputData()}
                                <FormGroup>
                                    <Label>Interest Schedule</Label>
                                    <div>
                                        <Button color="secondary" type="button" onClick={this.handleOpenModal}>Add Interest Schedule</Button>
                                        <ReactModal
                                            isOpen={this.state.showModal}
                                            style = {customStyles}
                                            contentLabel="Interest Schedule">
                                            <FormGroup>
                                                <Label>Date</Label>
                                                <Input type="String" name="date" placeholder="date" step="any"
                                                       value={this.state.date} onChange={this.handleChangeTest} >
                                                </Input>
                                                <Label>Interest Index</Label>
                                                <Input type="String" name="interest_index" placeholder="interest_index" step="any"
                                                       value={this.state.interest_index} onChange={this.handleChangeTest} >
                                                </Input>
                                                <Label>Interest Spread</Label>
                                                <Input type="number" name="interest_spread" placeholder="interest_spread" step="any"
                                                       value={this.state.interest_spread} onChange={this.handleChangeTest} >
                                                </Input>
                                                <button type="button" onClick={this.handleCloseModal}>Add</button>
                                                <button type="button" onClick={this.closeModal}>close</button>
                                            </FormGroup>
                                        </ReactModal>
                                    </div>
                                </FormGroup>
                            </Col>
                        </Row>
                        {this.renderTable()}
                        <div class="text-center">
                            <Button color="primary" type="submit" disabled={loading}>
                                {loading && (<SpinnerLoader />)}
                                {loading && <span>Loading..</span>}
                                {!loading && <span>Submit</span>}
                            </Button>
                        </div>
                    </Form>
                    <Row>
                        <Col md={{ size: 4, offset: 4 }}>

                        </Col>
                    </Row>
                    {/**/}

                    {/*<Button color="danger" type="" onClick={this.clickMe()}></Button>*/}
                    {/*<div>*/}
                    {/*    <Table>*/}
                    {/*        <tbody>*/}
                    {/*        {this.state.rows.map(row => (*/}
                    {/*            <tr>*/}
                    {/*                <td>{row.content}</td>*/}
                    {/*            </tr>*/}
                    {/*        ))}*/}
                    {/*        <tr>*/}
                    {/*            <td className="" onClick={this.handleAddRow}>*/}
                    {/*                (+)*/}
                    {/*            </td>*/}
                    {/*            {Boolean(this.state.rows.length) && (*/}
                    {/*                <td onClick={this.handleRemoveRow}>(-)</td>*/}
                    {/*            )}*/}
                    {/*        </tr>*/}
                    {/*        </tbody>*/}
                    {/*    </Table>*/}
                    {/*</div>*/}
                </Container>
            </div>
        )
    };

    // clickMe() {
    //     return function (p1) {
    //         // alert("Hello World")
    //         <div>
    //             <h1>hello world</h1>
    //         </div>
    //     };
    // }

    // clickMe = () => {
    //     return <Table hover>
    //         <thead>
    //         <tr>
    //             <th>#</th>
    //             <th>Date</th>
    //             <th>Interest Index</th>
    //             <th>Interest Spread</th>
    //         </tr>
    //         </thead>
    //         <tbody>
    //         <tr>
    //             <th scope="row">1</th>
    //             <td>Mark</td>
    //             <td>Otto</td>
    //             <td>@mdo</td>
    //         </tr>
    //         <tr>
    //             <th scope="row">2</th>
    //             <td>Jacob</td>
    //             <td>Thornton</td>
    //             <td>@fat</td>
    //         </tr>
    //         <tr>
    //             <th scope="row">3</th>
    //             <td>Larry</td>
    //             <td>the Bird</td>
    //             <td>@twitter</td>
    //         </tr>
    //         </tbody>
    //     </Table>
    // }

}

export default disbursementComponent;
