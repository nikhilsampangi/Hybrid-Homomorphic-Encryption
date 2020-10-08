import React, { Component, Fragment } from "react";
import Axios from "axios";

export default class LandingPage extends Component {
  constructor() {
    super();
    this.state = {
      publicKey1: "",
      privateKey1: "",
      publicKey2: "",
      privateKey2: "",
      enc: "",
      enc_r1: "",
      enc_r2: "",
      dec1: "",
      dec2: "",
      dec_r1: "",
      dec_r2: "",
      c1: "",
      c2: "",
      c12_r: "",
      ct1: "",
      n1: "",
      ct1_r: "",
      ct2: "",
      n2: "",
      ct2_r: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.generateKeys = this.generateKeys.bind(this);
    this.encrypt = this.encrypt.bind(this);
    this.decryptRSA = this.decryptRSA.bind(this);
    this.decryptPaillier = this.decryptPaillier.bind(this);
    this.cipherAddition = this.cipherAddition.bind(this);
    this.constAddition = this.constAddition.bind(this);
    this.constMultiplication = this.constMultiplication.bind(this);
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
        console.log("Key gen errror: ", err);
      });
  }

  encrypt() {
    Axios.post("/composite/encrypt", {
      pub1: this.state.publicKey1,
      pub2: this.state.publicKey2,
      x: this.state.enc,
    })
      .then((res) => {
        this.setState({
          enc_r1: res.data.cipher1,
          enc_r2: res.data.cipher2,
        });
      })
      .catch((err) => {
        console.log("encrpytion error: ", err);
      });
  }

  decryptPaillier() {
    Axios.post("/paillier/decrypt", {
      priv: this.state.privateKey1,
      pub: this.state.publicKey1,
      x: this.state.dec1,
    })
      .then((res) => {
        this.setState({
          dec_r1: res.data.pln_txt,
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
      x: this.state.dec2,
    })
      .then((res) => {
        this.setState({
          dec_r2: res.data.pln_txt,
        });
      })
      .catch((err) => {
        console.log("decryption error: ", err);
      });
  }

  cipherAddition() {
    Axios.post("/paillier/add_ciphers", {
      pub: this.state.publicKey,
      x: this.state.c1,
      y: this.state.c2,
    })
      .then((res) => {
        this.setState({
          c12_r: res.data.soln,
        });
      })
      .catch((err) => {
        console.log("add ciphers error: ", err);
      });
  }

  constAddition() {
    Axios.post("/paillier/add_constant", {
      pub: this.state.publicKey,
      x: this.state.ct1,
      const: this.state.n1,
    })
      .then((res) => {
        this.setState({
          ct1_r: res.data.soln,
        });
      })
      .catch((err) => {
        console.log("add cnst error: ", err);
      });
  }

  constMultiplication() {
    Axios.post("/paillier/mult_const", {
      pub: this.state.publicKey,
      x: this.state.ct2,
      const: this.state.n2,
    })
      .then((res) => {
        this.setState({
          ct2_r: res.data.soln,
        });
      })
      .catch((err) => {
        console.log("multp. conts error: ", err);
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
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
                Hybrid Homomorphic Encryption Scheme
              </h3>
              <small className="text-center">-BTP project eval demo-</small>
            </div>
            <div className="card-body">
              <ul className="list-group list-group-flush">
                {/* Keygen */}
                <li className="list-group-item">
                  <h5 className="btitle">1.Key Generation</h5>
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
                  </div>
                </li>
                {/* encryption */}
                <li className="list-group-item">
                  <h5 className="btitle">2.Encryption</h5>
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Enter Integer to be encrypted
                      </label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="enc"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-outline-dark btn-sharp"
                          onClick={this.encrypt}
                        >
                          Encrypt
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Encrypted Cipher texts
                      </label>
                      <div className="col-8">
                        <ul className="list-group">
                          <li className="list-group-item">
                            Paillier cipher : {this.state.enc_r1}
                          </li>
                          <li className="list-group-item">
                            RSA cipher : {this.state.enc_r2}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
                {/* decryption */}
                <li className="list-group-item">
                  <h5 className="btitle">3.Decryption</h5>
                  {/* Paillier decryption */}
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Paillier Cipher
                      </label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="dec1"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-outline-dark btn-sharp"
                          onClick={this.decryptPaillier}
                        >
                          Decrypt
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Decrypted Plain text
                      </label>
                      <div className="col-8">{this.state.dec_r1}</div>
                    </div>
                  </div>
                  {/* RSA decryption */}
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">RSA Cipher</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="dec2"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-outline-dark btn-sharp"
                          onClick={this.decryptRSA}
                        >
                          Decrypt
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Decrypted Plain text
                      </label>
                      <div className="col-8">{this.state.dec_r2}</div>
                    </div>
                  </div>
                </li>
              </ul>
              <br />
              <br />
              <br />
              <h4>Homomorphic properties</h4>
              <br />
              <ul className="list-group list-group-flush">
                {/* Addition 1 */}
                <li className="list-group-item">
                  <h5 className="btitle">1.Addition of Two cipher texts</h5>
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">Cipher #1</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="c1"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">Cipher #2</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="c2"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-dark btn-sharp"
                          onClick={this.cipherAddition}
                        >
                          Compute
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Resultant Cipher-text
                      </label>
                      <div className="col-8">{this.state.c12_r}</div>
                    </div>
                  </div>
                </li>
                {/* Addition 2 */}
                <li className="list-group-item">
                  <h5 className="btitle">
                    2.Addition of a cipher text with a constant
                  </h5>
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Cipher-text
                      </label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="ct1"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">Integer</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="n1"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-dark btn-sharp"
                          onClick={this.constAddition}
                        >
                          Compute
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Resultant Cipher-text
                      </label>
                      <div className="col-8">{this.state.ct1_r}</div>
                    </div>
                  </div>
                </li>
                {/* Multiplication */}
                <li className="list-group-item">
                  <h5 className="btitle">
                    3.Multiplication of a cipher text with a constant
                  </h5>
                  <div className="bbody">
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Cipher-text
                      </label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="ct2"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">Integer</label>
                      <div className="col-8">
                        <input
                          type="text"
                          class="form-control"
                          name="n2"
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">&nbsp;</label>
                      <div className="col-8">
                        <button
                          className="btn btn-dark btn-sharp"
                          onClick={this.constMultiplication}
                        >
                          Compute
                        </button>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-4 col-form-label">
                        Resultant Cipher-text
                      </label>
                      <div className="col-8">{this.state.ct2_r}</div>
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
