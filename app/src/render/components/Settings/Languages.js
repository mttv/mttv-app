import React, { Component } from 'react'
import $ from 'jquery'
import UKIcon from '../../../img/languages/uk.png'
import UAIcon from '../../../img/languages/ua.png'
import DEIcon from '../../../img/languages/de.png'
import RUIcon from '../../../img/languages/ru.png'

export default class Languages extends Component {

    languageHandler = (event) => {
        localStorage.setItem("language", event.target.id)
        $(".form-check-input.lang").prop("checked", false)
        $("#" + event.target.id + " input").prop("checked", true)
        this.props.languageHandler()
    }

    componentDidMount() {
        const pickedLang = localStorage.getItem("language")
        switch (pickedLang) {
            case "en": $("#en input").prop("checked", true)
                break
            case "ru": $("#ru input").prop("checked", true)
                break
            case "ua": $("#ua input").prop("checked", true)
                break
            case "de": $("#de input").prop("checked", true)
                break
            default: $("#en input").prop("checked", true)
                break
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
                                    English, UK
                                </label>
                                <img src={UKIcon} alt="" className="language-icon" />
                            </div>
                            <div className="form-group form-check settings language-picker" id="ru" onClick={this.languageHandler}>
                                <input className="form-check-input lang" type="radio" />
                                <label className="form-check-label">
                                    Русский
                                </label>
                                <img src={RUIcon} alt="" className="language-icon" />
                            </div>
                            <div className="form-group form-check settings language-picker" id="ua" onClick={this.languageHandler}>
                                <input className="form-check-input lang" type="radio" />
                                <label className="form-check-label">
                                    Українська
                                </label>
                                <img src={UAIcon} alt="" className="language-icon" />
                            </div>
                            <div className="form-group form-check settings language-picker" id="de" onClick={this.languageHandler}>
                                <input className="form-check-input lang" type="radio" />
                                <label className="form-check-label">
                                    Deutsch
                                </label>
                                <img src={DEIcon} alt="" className="language-icon" />
                            </div>
                        </div>
                    </div>
        )
  }
}