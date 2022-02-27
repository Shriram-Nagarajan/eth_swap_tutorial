import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import Navbar from './Navbar';
import EthSwap from '../abis/EthSwap.json'
import Token from '../abis/Token.json'
import Main from './Main';

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
    this.setState({ ethBalance });

    // Load the deployed token blockchain from Ganache through metamask
    const networkId = await web3.eth.net.getId()
    const tokenData = Token.networks[networkId]
    if(tokenData){
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      console.log("token:", token)
      let tokenBalance = await token.methods.balanceOf(this.state.account).call();
      console.log("tokenBalance: ", tokenBalance.toString())
      this.setState({
        tokenBalance: tokenBalance.toString(),
        token: token
      })
    } else{
      window.alert('Token contract not deployed to detected network')
    }

    const ethSwapData = EthSwap.networks[networkId]
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      console.log("Ethswap:", ethSwap)
      this.setState({
        ethSwap
      })
    } else{
      window.alert('EthSwap contract cannot be deployed to detected network')
    }

    this.setState({
      loading: false
    })
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
  
  buyTokens(me, etherAmount) {
    me.state.ethSwap.methods.buyTokens().send({
      value: etherAmount,
      from: this.state.account
    }).on('transactionHash', (hash) => {
      this.setState({
        loading: false
      })
    });
  }

  sellTokens(me, tokenAmount) {
    me.state.token.methods.approve(this.state.ethSwap.address, tokenAmount)
      .send({
        from: this.state.account
      }).on('transactionHash', (hash) => {
        me.state.ethSwap.methods.sellTokens(tokenAmount).send({
          from: this.state.account
        }).on('transactionHash', (hash) => {
          this.setState({
            loading: false
          })
        });
      });
  }

  constructor(props) {
    super(props);
    this.state = {
      account: '',
      ethBalance: 0,
      loading : true
    }
  }

  render() {
    let content = this.state.loading ? <h3>Loading...</h3> : <Main ethBalance={this.state.ethBalance}
     tokenBalance={this.state.tokenBalance}
     buyTokens={(etherAmount) => {this.buyTokens(this, etherAmount)}}
     sellTokens={(tokenAmount) => {this.sellTokens(this, tokenAmount)}} />
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
