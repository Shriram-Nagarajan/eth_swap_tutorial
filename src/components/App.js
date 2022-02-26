import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3();
  }

  async loadBlockChainData() {
    const ethereum = window.ethereum;
    const web3 = window.w3;
    const accounts = await ethereum.request({ method: 'eth_accounts' });
    this.setState({
      account: accounts[0]
    });
    const ethBalance = await web3.eth.getBalance(this.state.account);
    console.log(ethBalance);
    this.setState({ ethBalance });
  }

  async loadWeb3() {
    let me = this;
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
          window.w3 = new Web3(window.ethereum);
          try {
              // Request account access if needed
              await window.ethereum.enable();
              // Acccounts now exposed
              window.w3.eth.sendTransaction({/* ... */});
          } catch (error) {
              // User denied account access...
          }
      }
      // Legacy dapp browsers...
      else if (window.w3) {
          window.w3 = new Web3(window.w3.currentProvider);
          // Acccounts always exposed
          window.w3.eth.sendTransaction({/* ... */});
      }
      // Non-dapp browsers...
      else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
      }
      await me.loadBlockChainData();
    });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: 0
    }
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Dapp University
          </a>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1> Hello World </h1>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
