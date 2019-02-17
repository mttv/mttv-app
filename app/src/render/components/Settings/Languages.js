import React, { Component } from 'react'
import $ from 'jquery'

export default class Languages extends Component {

    languageHandler = (event) => {
        localStorage.setItem("language", event.target.id)
        $(".form-check-input.lang").prop("checked", false)
        $("#" + event.target.id + " input").prop("checked", true)
        this.props.languageHandler()
    }

    componentDidMount() {
        const pickedLang = localStorage.getItem("language")
        if (pickedLang === "en" || !pickedLang) {
            $("#en input").prop("checked", true)
        } else if (pickedLang === "ru") {
            $("#ru input").prop("checked", true)
        } else if (pickedLang === "ua") {
            $("#ua input").prop("checked", true)
        } else if (pickedLang === "de") {
            $("#de input").prop("checked", true)
        } else {
            $("#en input").prop("checked", true)
          }
    }

    render() {
        return(
            <div className="tab-pane fade card-settings" id="languages" role="tabpanel" aria-labelledby="list-languages">
                        <div className="alert alert-primary" role="alert">
                            {this.props.langPack.message}
                        </div>
                        <div className="languages-container">
                            <div className="form-group form-check settings language-picker" id="en" onClick={this.languageHandler}>
                                <input className="form-check-input lang" type="radio" />
                                <label className="form-check-label">
                                    English
                                </label>
                            </div>
                            <div className="form-group form-check settings language-picker" id="ru" onClick={this.languageHandler}>
                                <input className="form-check-input lang" type="radio" />
                                <label className="form-check-label">
                                    Русский
                                </label>
                            </div>
                            <div className="form-group form-check settings language-picker" id="ua" onClick={this.languageHandler}>
                                <input className="form-check-input lang" type="radio" />
                                <label className="form-check-label">
                                    Українська
                                </label>
                            </div>
                            <div className="form-group form-check settings language-picker" id="de" onClick={this.languageHandler}>
                                <input className="form-check-input lang" type="radio" />
                                <label className="form-check-label">
                                    Deutsch
                                </label>
                            </div>
                        </div>
                    </div>
        )
  }
}