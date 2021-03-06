import React from 'react';
import {DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavLink, NavItem, NavbarBrand, UncontrolledDropdown} from 'reactstrap';
import {FaUser} from 'react-icons/fa';

const header = (props) => {
    if (JSON.parse(sessionStorage.getItem("account_number"))) {
        var account = JSON.parse(sessionStorage.getItem("account_number"));
    }
    return (
        <Navbar color="dark" dark expand="md">
            {/* <img src={Logo} alt="TN" width="100" height="50" /> */}
            <NavbarBrand href="/"><span class="text-info">TN</span></NavbarBrand>
            <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Loan Account
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href="/olaComponent">
                            Open Loan Account
                        </DropdownItem>
                        <DropdownItem href="/ilaComponent">
                            Inquiry Loan Account
                        </DropdownItem>
                        <DropdownItem href="/caComponent">
                            Close Account
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                &emsp;
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Payment
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href="/ciaComponent">
                            Calculate Installment Amount
                        </DropdownItem>
                        <DropdownItem href="/ciaospComponent">
                            Calculate Installment Amount of Specific Product
                        </DropdownItem>
                        <DropdownItem href="/ciaosaComponent">
                            Calculate Installment Amount Options of Specific Account
                        </DropdownItem>
                        <DropdownItem href="/dbmComponent">
                            Disbursement
                        </DropdownItem>
                        <DropdownItem href="/rpmComponent">
                            Repayment
                        </DropdownItem>
                        <DropdownItem href="/rpmfcpreComponent">
                            Repayment For Close PrePost
                        </DropdownItem>
                        <DropdownItem href="/rpmfcComponent">
                            Repayment For Close Post
                        </DropdownItem>
                        <DropdownItem href="/pdComponent">
                            Pre-Disbursement
                        </DropdownItem>
                        <DropdownItem href="/prpmComponent">
                            Pre-Repayment
                        </DropdownItem>
                        <DropdownItem href="/rvComponent">
                            Reverse
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                &emsp;
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Interest
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href="/iiaComponent">
                            Inquiry Interest Accrued (List)
                        </DropdownItem>
                        <DropdownItem href="/iiadComponent">
                            Inquiry Interest Accrued Details
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                &emsp;
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Position
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href="/iplComponent">
                            Inquiry Position List
                        </DropdownItem>
                        <DropdownItem href="/ipdComponent">
                            Inquiry Position Detail
                        </DropdownItem>
                        <DropdownItem href="/ipdprestComponent">
                            Inquiry Position Detail (P-REST)
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                &emsp;
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        Accounting
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href="/iarComponent">
                            Inquiry Accounting Record
                        </DropdownItem>
                        <DropdownItem href="/ipprComponent">
                            Inquiry Principal Reconciliation Result
                        </DropdownItem>
                        <DropdownItem href="/iirComponent">
                            Inquiry Interest Reconciliation Result
                        </DropdownItem>
                        <DropdownItem href="/iprComponent">
                            Inquiry Penalty Reconciliation Result
                        </DropdownItem>
                        <DropdownItem href="/iglComponent">
                            Inquiry GL Reconciliation
                        </DropdownItem>
                        <DropdownItem href="/iagloComponent">
                            Inquiry Aggregate GL Outstanding
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
                &emsp;
                <NavItem>
                    <NavLink><span class="text-warning"><FaUser /> {account}</span></NavLink>
                </NavItem>
            </Nav>
        </Navbar>
    );
};

export default header;


