import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-a11y-keys/iron-a11y-keys.js';
import 'lite-signal/lite-signal.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-dialog/paper-dialog.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { YpBaseElement } from '../yp-base-element.js';

class YpMissingEmailLit extends YpBaseElement {
  static get properties() {
    return {
      emailValidationPattern: {
        type: String,
        value: "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$"
      },
  
      emailErrorMessage: {
        type: String
      },
  
      passwordErrorMessage: {
        type: String
      },
  
      needPassword: {
        type: Boolean,
        value: false
      },
  
      email: {
        type: String,
        value: "" //robert@citizens.is"
      },
  
      password: {
        type: String,
        value: "" //"DksdSodksSokssss"
      },
  
      credentials: {
        type: String,
        notify: true,
        computed: '_computeCredentials(email, password)'
      },
  
      linkAccountText: {
        type: Boolean,
        value: false
      },
  
      heading: {
        type: String
      },
  
      target: {
        type: Object
      },
  
      onlyConfirmingEmail: {
        type: Boolean,
        value: false
      },
  
      originalConfirmationEmail: {
        type: String,
        value: null
      }
    }
  }
 
  static get styles() {
    return [
      css`
  

      paper-dialog {
        background-color: #FFF;
        width: 420px;
      }

      .linkAccounts {
        padding-top: 16px;
      }

      @media (max-width: 480px) {
        paper-dialog {
          padding: 0;
          margin: 0;
          width: 100%;
        }
      }

      [hidden] {
        display: none !important;
      }

      .buttons {
        margin-bottom: 8px;
        margin-right: 4px;
        text-align: center;
      }

      .setEmailInfo {
        font-size: 16px;
        font-weight: bold;
      }
    `, YpFlexLayout]
  }
  render() {
    return html`
    ${this.user ? html`
    <div id="outer">
      <paper-dialog id="dialog">
        <h2>${this.heading}</h2>
        <div class="setEmailInfo">
          <span ?hidden="${!this.onlyConfirmingEmail}">${this.t('user.setEmailConfirmationInfo')}</span>
          <span ?hidden="${this.onlyConfirmingEmail}">${this.t('user.setEmailInfo')}</span>
        </div>
        <form is="iron-form" id="form">
          <paper-input id="email" type="text" label="${this.t('user.email')}" value="${this.email}" pattern="${this.emailValidationPattern}" error-message="${this.emailErrorMessage}">
          </paper-input>

          <template is="dom-if" if="${this.needPassword}">
            <div class="linkAccounts">
              ${this.t('user.existsLinkAccountInfo')}
            </div>
            <paper-input id="password" type="password" label="${this.t('user.password')}" value="${this.password}" autocomplete="off" error-message="${this.passwordErrorMessage}">
            </paper-input>
          </template>
        </form>
        <div class="buttons">
          <yp-ajax id="setEmailAjax" dispatch-error="" method="PUT" url="/api/users/missingEmail/setEmail" on-response="_setEmailResponse"></yp-ajax>
          <yp-ajax id="linkAccountsAjax" method="PUT" dispatch-error="" on-error="_registerError" url="/api/users/missingEmail/linkAccounts" on-response="_linkAccountsResponse"></yp-ajax>
          <yp-ajax id="confirmEmailShownAjax" dispatch-error="" method="PUT" url="/api/users/missingEmail/emailConfirmationShown"></yp-ajax>
          <paper-button on-tap="_logout" ?hidden="${this.onlyConfirmingEmail}">${this.t('user.logout')}</paper-button>
          <paper-button on-tap="_forgotPassword" ?hidden="${!this.needPassword}">${this.t('user.newPassword')}</paper-button>
          <paper-button raised="" on-tap="_notNow" ?hidden="${this.onlyConfirmingEmail}">${this.t('later')}</paper-button>
          <paper-button raised="" id="sendButton" autofocus="" on-tap="_validateAndSend">
            <span ?hidden="${this.linkAccountText}">
              <span ?hidden="${this.onlyConfirmingEmail}">
                ${this.t('user.setEmail')}
              </span>
              <span ?hidden="${!this.onlyConfirmingEmail}">
                ${this.t('confirm')}
              </span>
            </span>
            <span ?hidden="${!this.linkAccountText}">
              ${this.t('user.linkAccount')}
            </span>
          </paper-button>
        </div>
      </paper-dialog>

      <iron-a11y-keys id="a11y" keys="enter" on-keys-pressed="onEnter"></iron-a11y-keys>
    </div>
` : html``}
`
  }
/*
  behaviors: [
    ypLanguageBehavior
  ],
*/

  onEnter(event) {
    this._validateAndSend();
  }

  _notNow(event) {
    window.appGlobals.activity('cancel', 'setEmail');
    this.$$("#dialog").close();
  }

  _logout() {
    window.appGlobals.activity('logout', 'setEmail');
    window.appUser.logout();
  }

  _forgotPassword() {
    window.appGlobals.activity('open', 'forgotPasswordFromSetEmail');
    window.appUser.fire("yp-forgot-password", { email: this.email });
  }

  ready() {
    this.header = this.t('user.setEmail');
    this.async(function () {
      this.$$("#a11y").target = this.$$("#form");
    }.bind(this), 50);
  }

  _computeCredentials(email, password) {
   return JSON.stringify({
      email: email,
      password: password
    });
  }

  _validateAndSend(e) {
    if (this.$$("#form").checkValidity() && this.email){
      if (this.needPassword && this.password) {
        window.appGlobals.activity('confirm', 'linkAccountsAjax');
        this.$$("#linkAccountsAjax").body = this.credentials;
        this.$$("#linkAccountsAjax").generateRequest();
      } else {
        window.appGlobals.activity('confirm', 'setEmail');
        if (!this.originalConfirmationEmail || (this.originalConfirmationEmail!=this.email)) {
          this.$$("#setEmailAjax").body = {email: this.email };
          this.$$("#setEmailAjax").generateRequest();
        } else {
          window.appGlobals.notifyUserViaToast(this.t('userHaveSetEmail')+ " " + this.email);
          this.close();
        }
      }
    } else {
      this.$$("#linkAccountsAjax").showErrorDialog(this.t('user.completeForm'));
      return false;
    }
  }

  _setEmailResponse(event, detail) {
    if (detail.response && detail.response.alreadyRegistered) {
      this.set('needPassword', true);
      this.set('header', this.t('user.linkAccount'));
      this.set('linkAccountText', true);
    } else {
      window.appGlobals.notifyUserViaToast(this.t('userHaveSetEmail')+ " " + detail.response.email);
      this.close();
    }
    this.$.dialog.fire('iron-resize');
  }

  _linkAccountsResponse(event, detail) {
    if (detail.response.accountLinked) {
      window.appGlobals.notifyUserViaToast(this.t('userHaveLinkedAccounts')+ " " + detail.response.email);
      window.appUser.checkLogin();
      this.close();
    } else {
      this.$$("#linkAccountsAjax").showErrorDialog(this.t('user.loginNotAuthorized'));
    }
    this.$.dialog.fire('iron-resize');
  }

  open(loginProvider, onlyConfirming, email) {
    this.set('onlyConfirmingEmail', onlyConfirming);
    if (email) {
      this.set('email', email);
      this.set('originalConfirmationEmail', email);
    }
    this.$$("#dialog").open();
    if (this.onlyConfirmingEmail) {
      this.$.confirmEmailShownAjax.body = {};
      this.$.confirmEmailShownAjax.generateRequest();
    }
  }

  close() {
    this.$$("#dialog").close();
  }
}

window.customElements.define('yp-missing-email-lit', YpMissingEmailLit)