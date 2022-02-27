import React from 'react'
import Identicon from 'react-identicons'

class Navbar extends React.Component {

    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark text-white flex-md-nowrap p-1 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="/"
                    rel="noopener noreferrer"
                >
                {"EthSwap"}
                </a>
                {this.props.account ? <Identicon size={30} string={this.props.account} /> : ""}

          </nav>
        );
    }

}

export default Navbar;