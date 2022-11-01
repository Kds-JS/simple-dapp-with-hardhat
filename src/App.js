import React, {useState, useEffect} from 'react';
import { ethers } from 'ethers';
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json';

import './App.css';

const GreeterAdress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [greeting, setGreetingValue] = useState();

  useEffect(() => {
    fetchGreeting();
    console.log(greeting);
  }, [])

  async function requestAccount() {
    await window.ethereum.request({method: 'eth_requestAccounts'});
  }

  async function fetchGreeting() {
    if(typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const contract = new ethers.Contract(GreeterAdress, Greeter.abi, provider);
      try {
        const data = await contract.greet();
        setGreetingValue(data);
      }
      catch(err) {
        console.log(err);
      }
    }
  }

  async function setGreeting() {
    if(!greeting) return 
    if(typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(GreeterAdress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue('');
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <p>{greeting}</p>
      <input type="text" onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" />
      <button onClick={setGreeting}>set Geeting</button>
    </div>
  );
}

export default App;
