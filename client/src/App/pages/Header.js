import React from 'react';
import {Navbar,NavbarBrand,Nav,UncontrolledDropdown,
    DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';

const header = (props) => {
    return (

        <Navbar color="dark" dark expand="md">
        {/* <img src={logo} alt="TN" width="100" height="100" /> */}
         <NavbarBrand href="/" >TN</NavbarBrand>
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
                        <DropdownItem href="/dbmComponent">
                            Disbursement
                        </DropdownItem>
                        <DropdownItem href="/rpmComponent">
                            Repayment
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
                    </DropdownMenu>
              </UncontrolledDropdown>
               &emsp;
              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                  P-rest
                </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem href="/ipdprestComponent">
                            Inquiry Position Detail
                        </DropdownItem>
                    </DropdownMenu>
              </UncontrolledDropdown>
           </Nav>
       </Navbar>
    );
  };

export default header;


