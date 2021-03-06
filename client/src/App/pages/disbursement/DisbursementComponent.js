import React, { Component } from 'react';
import {
    Button, Col, Container, Form, FormGroup, Input, Label, Row, Table, Modal, ModalBody, ModalHeader,
    DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown
} from 'reactstrap';

import DynamicHeader from '../Header.js';
import inputModel from './model.json';
import utility from '../Utility.js';
import SpinnerLoader from '../loading.js';

// import data0 from './data0.json';
// import data1 from './data1.json';
// import data2 from './data2.json';
import disbS16C1S3 from './disbS16C1S3.json';
import disbS16C1S4 from './disbS16C1S4.json';
import disbS16C1S5 from './disbS16C1S5.json';
import disbS16C1S6 from './disbS16C1S6.json';

const cloneDeep = require('lodash.clonedeep');
let installmentAmount = "";
let numberOfPayment = "";
let dataArray = [];

class disbursementComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rq_body: {
                account_number: 0,
                disbursement_amount: 0,
                effective_date: "",
                channel_post_date: "",
                currency_code: "THB",
                user_id: "",
                service_branch: 0,
                clearing_and_settlement_key: "CBS",
                number_of_payment: 0,
                installment_amount: 0,
                interest_index: "",
                interest_spread: 0,
                first_payment_date: "",
                payment_calculation_method: "installment",
                destination_account:""
                // other_properties: {
                //     interest_override_reason: "",
                //     campaign_name: "",
                //     interest_schedule: ""
                // }
            },
            loading: false,
            disabled: "",
            openMyModal: false,
            date: "",
            interest_index: "FIXED",
            interest_spread: "",
            isFound: false,
            //declare for used map in table
            // interest_schedule_obj: []

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeModal = this.handleChangeModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOpenModal = this.handleOpenModal.bind(this);
        // this.handleCloseModal = this.handleCloseModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    };

    componentDidMount() {
        let disbursementAmount = 0;
        let accountNumber = "";

        if ((JSON.parse(sessionStorage.getItem("disburse_interest")))) {
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
            user_id: "",
            service_branch: 0,
            clearing_and_settlement_key: "CBS",
            interest_index: "",
            interest_spread: "",
            first_payment_date: "",
            number_of_payment: numberOfPayment,
            installment_amount: installmentAmount,
            payment_calculation_method: "installment",
            destination_account:""
            // other_properties: {
            //     interest_override_reason: "",
            //     campaign_name: "",
            //     interest_schedule: ""
            // }
        };
        this.setState({ rq_body: body });
    };

    handleChangeModal(event) {
        if (event.target.name === "date") {
            this.setState({ date: event.target.value });
        } else if (event.target.name === "interest_index") {
            this.setState({ interest_index: event.target.value })
        } else if (event.target.name === "interest_spread") {
            this.setState({ interest_spread: event.target.value });
        }
    }

    handleChange(event) {
        //this.setState({[event.target.name]:event.target.value});
        const { rq_body } = { ...this.state };
        const currentState = rq_body;
        // const properties = currentState.other_properties;
        // const properties = currentState;
        //field in other properties expect type string
        // if (event.target.name === "interest_index" || event.target.name === "interest_spread"
        //     || event.target.name === "first_payment_date" || event.target.name === "number_of_payment"
        //     || event.target.name === "installment_amount" || event.target.name === "interest_override_reason"
        //     || event.target.name === "campaign_name") {

        //     properties[event.target.name] = event.target.value;

        // } else 
        if (event.target.name === "payment_calculation_method") {
            //check drop down payment_calculation_method field
            currentState[event.target.name] = event.target.value;
            if (event.target.value === "minimum") {
                currentState["installment_amount"] = "";
                currentState["number_of_payment"] = "";
                this.setState({ disabled: "disabled" });
            } else {
                currentState["installment_amount"] = installmentAmount;
                currentState["number_of_payment"] = numberOfPayment;
                this.setState({ disabled: "" });
            }
        } else {
            currentState[event.target.name] = event.target.type === "number" ? Number(event.target.value) : event.target.value;
        }
        this.setState({ rq_body: currentState });
    };

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ loading: true });
        //clone state for use in omit function.
        let body = cloneDeep(this.state);
        // if (this.state.interest_schedule_obj.length !== 0) {
        //     body.rq_body.other_properties.interest_schedule = JSON.stringify(this.state.interest_schedule_obj);
        // }
        // console.log("interest_schedule : "+body.rq_body.other_properties.interest_schedule);

        // if(body.rq_body.other_properties.interest_index !== "" && body.rq_body.other_properties.interest_spread === ""){
        //     body.rq_body.other_properties.interest_spread = 1;
        // }

        if (body.rq_body.interest_index !== "" && body.rq_body.interest_spread === "") {
            body.rq_body.interest_spread = 1;
        }

        const request = utility.omit(body);

        // if(body.rq_body.other_properties.interest_spread === 1){
        //     body.rq_body.other_properties.interest_spread = "0";
        // }

        if (body.rq_body.interest_spread === 1) {
            body.rq_body.interest_spread = "0";
        }

        setTimeout(() => {
            this.setState({ loading: false });
            this.postList(request);
        }, 1000)
    };

    postList = (request) => {

        // let installmentAmtFloat = parseFloat(request.rq_body.installment_amount)
        // let numberOfPmtInt = parseInt(request.rq_body.number_of_payment)
        // let accountNumberInt = parseInt(request.rq_body.account_number)

        // request.rq_body.installment_amount = installmentAmtFloat
        // request.rq_body.number_of_payment = numberOfPmtInt
        // request.rq_body.account_number = accountNumberInt

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
    };

    handleOpenModal() {
        this.setState({ openMyModal: true });
    }

    closeModal() {
        this.setState({ openMyModal: false });
    }

    // handleCloseModal = (e) => {
    //     e.preventDefault();
    // this.setState({ openMyModal: false });
    // this.setState({ isFound: true });
    // let data = {
    //     date: this.state.date,
    //     interest_index: this.state.interest_index,
    //     interest_spread: this.state.interest_spread
    // };
    // dataArray.push(data);
    // this.setState({ interest_schedule_obj: dataArray });
    // };

    FormInputRow1 = () => {
        let count = 0;
        let columnLeft = [];
        let columnRight = [];
        inputModel.model.map(item => {
            count++;
                if (count % 2 !== 0) {
                    if (item.type === "select") {
                        columnLeft.push(
                            <FormGroup>
                                <Label>{item.label}</Label>
                                <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                    value={this.state.rq_body[item.value]} onChange={this.handleChange}  >
                                    {item.items.map(element => <option>{element}</option>)}
                                </Input>
                            </FormGroup>
                        );
                    } else {
                        if (item.name === "number_of_payment") {
                            columnLeft.push(
                                <FormGroup>
                                    <Label>{item.label}</Label>
                                    <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                        value={this.state.rq_body[item.value]}
                                        onChange={this.handleChange} disabled={this.state.disabled} />
                                </FormGroup>
                            )
                        } else {
                            columnLeft.push(<FormGroup>
                                <Label>{item.label}</Label>
                                <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                    value={this.state.rq_body[item.value]} onChange={this.handleChange} />
                            </FormGroup>
                            )
                        }
                    }
                } else {
                    if (item.type === "select") {
                        columnRight.push(
                            <FormGroup>
                                <Label>{item.label}</Label>
                                <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                    value={this.state.rq_body[item.value]} onChange={this.handleChange} onInvalid > 
                                    {item.items.map(element => <option>{element}</option>)}
                                </Input>
                            </FormGroup>
                        );
                    } else {
                        if (item.name === "installment_amount") {
                            columnRight.push(
                                <FormGroup>
                                    <Label>{item.label}</Label>
                                    <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                        value={this.state.rq_body[item.value]}
                                        onChange={this.handleChange} disabled={this.state.disabled} />
                                </FormGroup>
                            )
                        } else {
                        columnRight.push(<FormGroup>
                            <Label>{item.label}</Label>
                            <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
                                value={this.state.rq_body[item.value]} onChange={this.handleChange} />
                        </FormGroup>
                        )
                    }
                }
                }
        })
        return (<Row><Col md={{ size: 3, offset: 3 }}>{columnLeft}</Col><Col md={{ size: 3 }}>{columnRight}</Col></Row>);
    }

    // FormInputRow2 = () => {
    //     let count = 0;
    //     let columnLeft = [];
    //     let columnRight = [];
    //     inputModel.model.map(item => {
    //         count++;
    //         if (item.root !== null && item.root === "other_properties") {
    //             if (count % 2 !== 0) {
    //                 if (item.type === "select") {
    //                     columnLeft.push(
    //                         <FormGroup>
    //                             <Label>{item.label}</Label>
    //                             <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
    //                                 value={this.state.rq_body[item.root][item.value]} onChange={this.handleChange} >
    //                                 {item.items.map(element => <option>{element}</option>)}
    //                             </Input>
    //                         </FormGroup>
    //                     );
    //                 } else {
    //                     if (item.name === "installment_amount") {
    //                         columnLeft.push (
    //                             <FormGroup>
    //                                 <Label>{item.label}</Label>
    //                                 <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
    //                                     value={this.state.rq_body[item.root][item.value]}
    //                                     onChange={this.handleChange} disabled={this.state.disabled} />
    //                             </FormGroup>
    //                         )
    //                     } else {
    //                         columnLeft.push (
    //                             <FormGroup>
    //                                 <Label>{item.label}</Label>
    //                                 <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
    //                                     value={this.state.rq_body[item.root][item.value]} onChange={this.handleChange} />
    //                             </FormGroup>
    //                         )
    //                     }
    //                 }
    //             } else {
    //                 if (item.name === "number_of_payment") {
    //                     columnRight.push (
    //                         <FormGroup>
    //                             <Label>{item.label}</Label>
    //                             <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
    //                                 value={this.state.rq_body[item.root][item.value]}
    //                                 onChange={this.handleChange} disabled={this.state.disabled} />
    //                         </FormGroup>
    //                     )
    //                 } else {
    //                     columnRight.push (
    //                         <FormGroup>
    //                             <Label>{item.label}</Label>
    //                             <Input type={item.type} name={item.name} placeholder={item.placeholder} step="any"
    //                                 value={this.state.rq_body[item.root][item.value]} onChange={this.handleChange} />
    //                         </FormGroup>
    //                     )
    //                 }
    //             }
    //         }
    //     })
    //     return (<Row><Col md={{ size: 3, offset: 3 }}>{columnLeft}</Col><Col md={{ size: 3 }}>{columnRight}</Col></Row>);
    // }

    loadJson = (event) => {
        event.preventDefault();
        switch (event.target.name) {
            // case "000": this.setState({ disabled: "",rq_body: data0.rq_body });break;
            // case "001": {
            //     if(data1.rq_body.payment_calculation_method === "minimum"){
            //         data1.rq_body.installment_amount = "";
            //         data1.rq_body.number_of_payment = "";
            //         this.setState({ disabled: "disabled", rq_body: data1.rq_body });
            //     }
            //     break;
            // }
            // case "002": {
            //     if(data2.rq_body.payment_calculation_method === "minimum"){
            //         data2.rq_body.installment_amount = "";
            //         data2.rq_body.number_of_payment = "";
            //         this.setState({ disabled: "disabled", rq_body: data2.rq_body });
            //     }
            //     break;
            // }
            case "S16C1S3": this.setState({ disabled: "",rq_body: disbS16C1S3.rq_body });break;
            case "S16C1S4": this.setState({ disabled: "",rq_body: disbS16C1S4.rq_body });break;
            case "S16C1S5": this.setState({ disabled: "",rq_body: disbS16C1S5.rq_body });break;
            case "S16C1S6": this.setState({ disabled: "",rq_body: disbS16C1S6.rq_body });break;
        }
    };

    render() {
        const { loading } = this.state;
        // let tempData = this.state.interest_schedule_obj;
        return (
            <div>
                <DynamicHeader />
                <h2>Form Input Disbursement</h2>
                <Container>
                    <UncontrolledDropdown align="center">
                        <DropdownToggle caret color="secondary">Select data here &nbsp;</DropdownToggle>
                        <DropdownMenu>
                            {/* <DropdownItem name="000" onClick={(e) => this.loadJson(e)}>Select data here</DropdownItem> */}
                            {/* <DropdownItem name="001" onClick={(e) => this.loadJson(e)}>First Model</DropdownItem> */}
                            {/* <DropdownItem name="002" onClick={(e) => this.loadJson(e)}>Second Model</DropdownItem> */}
                            {/* <DropdownItem name="002" onClick={this.loadJson}>Input body data second </DropdownItem> */}
                            <DropdownItem name="S16C1S3" onClick={(e) => this.loadJson(e)}>Input Disbursement Step 3</DropdownItem>
                            <DropdownItem name="S16C1S4" onClick={(e) => this.loadJson(e)}>Input Disbursement Step 4</DropdownItem>
                            <DropdownItem name="S16C1S5" onClick={(e) => this.loadJson(e)}>Input Disbursement Step 5</DropdownItem>
                            <DropdownItem name="S16C1S6" onClick={(e) => this.loadJson(e)}>Input Disbursement Step 6</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                    <Form onSubmit={this.handleSubmit}>
                        {this.FormInputRow1()}
                        {/*<h4>Other properties</h4>*/}
                        {/*<hr />*/}
                        {/*{this.FormInputRow2()}*/}
                        {/*<Row>*/}
                        {/*    <Col md={{ size: 6, offset: 3 }}>*/}
                        {/*        <FormGroup>*/}
                        {/*            <Label>Interest Schedule</Label>*/}
                        {/*            <div>*/}
                        {/*                <Button color="secondary" type="button" onClick={this.handleOpenModal}>Add*/}
                        {/*                    Interest Schedule</Button>*/}
                        {/*                <Modal isOpen={this.state.openMyModal}>*/}
                        {/*                    <ModalHeader toggle={this.closeModal} >Interest Schedule</ModalHeader>*/}
                        {/*                    <ModalBody>*/}
                        {/*                        <FormGroup>*/}
                        {/*                            <Label>Date</Label>*/}
                        {/*                            <Input type="date" name="date" placeholder="date" step="any"*/}
                        {/*                                value={this.state.date} onChange={this.handleChangeModal}>*/}
                        {/*                            </Input>*/}
                        {/*                            <Label>Interest Index</Label>*/}
                        {/*                            <Input type="String" name="interest_index" placeholder="interest_index"*/}
                        {/*                                step="any"*/}
                        {/*                                value={this.state.interest_index}*/}
                        {/*                                onChange={this.handleChangeModal}>*/}
                        {/*                            </Input>*/}
                        {/*                            <Label>Interest Spread</Label>*/}
                        {/*                            <Input type="number" name="interest_spread"*/}
                        {/*                                placeholder="interest_spread" step="any"*/}
                        {/*                                value={this.state.interest_spread}*/}
                        {/*                                onChange={this.handleChangeModal}>*/}
                        {/*                            </Input>*/}
                        {/*                            <div class="text-center">*/}
                        {/*                                <Button color="primary" onClick={(e) => this.handleCloseModal(e)}>Add</Button>{' '}*/}
                        {/*                                <Button color="secondary" onClick={this.closeModal}>close</Button>*/}
                        {/*                            </div>*/}
                        {/*                        </FormGroup>*/}
                        {/*                    </ModalBody>*/}
                        {/*                </Modal>*/}
                        {/*            </div>*/}
                        {/*        </FormGroup>*/}
                        {/*    </Col>*/}
                        {/*</Row>*/}
                        {/*{this.state.isFound &&*/}
                        {/*    <div>*/}
                        {/*        <Table striped>*/}
                        {/*            <tbody>*/}
                        {/*                <tr>*/}
                        {/*                    <th>No.</th>*/}
                        {/*                    <th>Date</th>*/}
                        {/*                    <th>Interest Index</th>*/}
                        {/*                    <th>Interest Spread</th>*/}
                        {/*                    <th></th>*/}
                        {/*                </tr>*/}
                        {/*                {tempData.map((item, index) => {*/}
                        {/*                    return (*/}
                        {/*                        <tr>*/}
                        {/*                            <td>{index + 1}</td>*/}
                        {/*                            <td>{item.date}</td>*/}
                        {/*                            <td>{item.interest_index}</td>*/}
                        {/*                            <td>{item.interest_spread}</td>*/}
                        {/*                        </tr>*/}
                        {/*                    )*/}
                        {/*                }*/}
                        {/*                )}*/}
                        {/*            </tbody>*/}
                        {/*        </Table>*/}
                        {/*    </div>*/}
                        {/*}*/}
                        <div class="text-center">
                            <Button color="primary" type="submit" disabled={loading}>
                                {loading && (<SpinnerLoader />)}
                                {loading && <span>Loading..</span>}
                                {!loading && <span>Submit</span>}
                            </Button>
                        </div>
                    </Form>
                </Container>
            </div>
        )
    };
}

export default disbursementComponent;
