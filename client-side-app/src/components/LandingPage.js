import React, { Component, Fragment } from "react";
import Axios from "axios";
const axiosTime = require("axios-time");

axiosTime(Axios);

export default class LandingPage extends Component {
  constructor() {
    super();
    this.state = {
      publicKey1: "", // paillier
      privateKey1: "",
      publicKey2: "", // RSA
      privateKey2: "",
      num1:"",
      num2:"",
      ciphers:[["",""],["",""]],
      output_log : [],
      ciph1: "",
      ciph2: "",
      dec1:"",
      dec2:"",
      isEncrypted: false,      
    };
    this.handleChange = this.handleChange.bind(this);
    this.generateKeys = this.generateKeys.bind(this);
    this.Addition = this.Addition.bind(this);
    this.Multiplication = this.Multiplication.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.cipherAddition = this.cipherAddition.bind(this);    
    this.cipherMultiplication = this.cipherMultiplication.bind(this);    
    this.decryptRSA = this.decryptRSA.bind(this);
    this.decryptPaillier = this.decryptPaillier.bind(this);
  }

  generateKeys() {
    Axios.get("/composite/generate_keys")
      .then((res) => {
        this.setState({
          publicKey1: res.data.pub1,
          privateKey1: res.data.priv1,
          publicKey2: res.data.pub2,
          privateKey2: res.data.priv2,
        });
      })
      .catch((err) => {
        console.log("Key gen error: ", err);
      });
    // this.setState({
    //   resp1: response.timings.elapsedTime,
    // });
  }


  Addition() {
    if(this.state.isEncrypted){
      this.cipherAddition()
    }
    else{
      this.encrypt(this.state.num1, 0, () => {
        this.encrypt(this.state.num2, 1, () => {
          this.setState({
            isEncrypted:true
          })
          this.cipherAddition()
        })
      })  
    }
  }

  Multiplication() {
    if(this.state.isEncrypted){
      this.cipherMultiplication()
    }
    else{
      this.encrypt(this.state.num1, 0, () => {
        this.encrypt(this.state.num2, 1, () => {
          this.setState({
            isEncrypted:true
          })
          this.cipherMultiplication()
        })
      })  
    }
  }

  encrypt(pln_text, index, _callback) {
    Axios.post("/composite/encrypt", {
      pub1: this.state.publicKey1,
      pub2: this.state.publicKey2,
      x: pln_text,
    })
      .then((res) => {
        var c = this.state.ciphers
        var today = new Date()
        var time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "
        c[index] = [res.data.cipher1, res.data.cipher2]
        this.setState({
          output_log: [...this.state.output_log, time+pln_text+" encrypted to the ciphers: [Paillier: "+res.data.cipher1+", RSA: "+res.data.cipher2+"]"],
          ciphers: c
        });
        // return true
        _callback()
      })
      .catch((err) => {
        console.log("Encrpytion error: ", err);
        this.setState({
          output_log: [...this.state.output_log, "Encryption error: "+err],
        });
        // return false
      });
  }

  cipherAddition() {
    var today = new Date()
    var time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "
    this.setState({
      output_log: [...this.state.output_log, time+"Ciphers sent for addition"],
    });
    Axios.post("/compute/add_ciphers", {
      pub: this.state.publicKey1,
      x: this.state.ciphers[0][0],
      y: this.state.ciphers[1][0],
    })
      .then((res) => {
        var today = new Date()
        var time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "
        this.setState({
          output_log: [...this.state.output_log, time+"Recieved Response: "+res.data.soln],
          // c12_r: res.data.soln,
        });
      })
      .catch((err) => {
        console.log("add ciphers error: ", err);
        this.setState({
          output_log: [...this.state.output_log, "Cipher Addition Error: "+err],
        });
      });
  }

  cipherMultiplication() {
    var today = new Date()
    var time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "
    this.setState({
      output_log: [...this.state.output_log, time+"Ciphers sent for Multiplication "],
    });
    Axios.post("/compute/mult_cipher", {
      pub: this.state.publicKey2,
      x: this.state.ciphers[0][1],
      y: this.state.ciphers[1][1],
    })
      .then((res) => {
        var today = new Date()
        var time = "[" + today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds() + "] "
        this.setState({
          output_log: [...this.state.output_log, time+"Recieved Response: "+res.data.soln],
        });
      })
      .catch((err) => {
        console.log("mult. ciphers error: ", err);
        this.setState({
          output_log: [...this.state.output_log, "Cipher Multiplication Error: "+err],
        });        
      });
  }

  decryptPaillier() {
    Axios.post("/paillier/decrypt", {
      priv: this.state.privateKey1,
      pub: this.state.publicKey1,
      x: this.state.ciph1,
    })
      .then((res) => {
        this.setState({
          dec1: res.data.pln_txt,
        });
      })
      .catch((err) => {
        console.log("decryption error: ", err);
      });
  }

  decryptRSA() {
    Axios.post("/rsa/decrypt", {
      priv: this.state.privateKey2,
      pub: this.state.publicKey2,
      x: this.state.ciph2,
    })
      .then((res) => {
        this.setState({
          dec2: res.data.pln_txt,
        });
      })
      .catch((err) => {
        console.log("decryption error: ", err);
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const Op_log = this.state.output_log.map((log) =>  <li className="list-group-item">{log}</li>);
    return (
      <Fragment>
        <div className="container b1">
          <div className="card bg-info" style={{ border: "none" }}>
            <div className="card-body text-center">
              <h1 className="text-light">Client Side Application</h1>
            </div>
          </div>
          <br />
          <div className="card">
            <div className="card-title text-center">
              <h3 className="text-center">
                Composite Homomorphic Encryption Scheme
              </h3>
              <small className="text-center">-BTP project eval demo-</small>
            </div>
            <div className="card-body">
              <h4>1. Key Generation :</h4>
              <br />
              <ul className="list-group list-group-flush">
                {/* Keygen */}
                <li className="list-group-item">
                  {/* <h5 className="btitle">1.Key Generation</h5> */}
                  <div className="bbody">
                    <button
                      className="btn btn-info btn-sharp"
                      onClick={this.generateKeys}
                    >
                      Generate Keys
                    </button>
                    <br />
                    <br />
                    <ul className="list-group">
                      <li className="list-group-item">
                        Paillier Public Key: {this.state.publicKey1}
                      </li>
                      <li className="list-group-item">
                        Paillier Private Key: {this.state.privateKey1}
                      </li>
                    </ul>
                    <br />
                    <ul className="list-group">
                      <li className="list-group-item">
                        RSA Public Key: {this.state.publicKey2}
                      </li>
                      <li className="list-group-item">
                        RSA Private Key: {this.state.privateKey2}
                      </li>
                    </ul>
                    <br />
                    {/* <span className="text-info">
                      Time Elapsed : {this.state.resp1}
                    </span> */}
                  </div>
                </li>
              </ul>
              <br />
              <h4>2. Computations :</h4>
              <br />
              <ul className="list-group list-group-flush">
                {/* Addition 1 */}
                <li className="list-group-item">
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">Number #1</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="num1"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">Number #2</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="num2"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-1">
                        <button
                          className="btn btn-dark btn-sharp"
                          onClick={this.Addition}
                        >
                          Add
                        </button>
                      </div>
                      <div className="col-2">
                        <button
                          className="btn btn-dark btn-sharp"
                          onClick={this.Multiplication}
                        >
                          Multiply
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
              <br/>
              <ul className="list-group list-group-flush">
                {Op_log}
              </ul>
              <br />
              <h4>3. Decryption :</h4>
              <br />
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">Paillier Cipher</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="ciph1"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-dark btn-sharp"
                          onClick={this.decryptPaillier}
                        >
                          Decrypt
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        {this.state.dec1}
                      </div>
                    </div>
                  </div>
                </li>                
                <li className="list-group-item">
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">RSA Cipher</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="ciph2"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-dark btn-sharp"
                          onClick={this.decryptRSA}
                        >
                          Decrypt
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        {this.state.dec2}
                      </div>
                    </div>
                  </div>
                </li>                
              </ul>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
