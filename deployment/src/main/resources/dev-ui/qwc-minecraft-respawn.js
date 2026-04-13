import {css, html, LitElement} from 'lit';
import {JsonRpc} from 'jsonrpc';
import '@vaadin/button';
import '@vaadin/icon';
import '@vaadin/vaadin-lumo-styles/vaadin-iconset';

export class QwcMinecraftRespawn extends LitElement {

    jsonRpc = new JsonRpc(this);

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            gap: 10px;
            height: 100%;
            padding-left: 10px;
            padding-right: 10px;
        }

        .status-message {
            padding: 10px;
            border-radius: 4px;
            background-color: var(--lumo-contrast-5pct);
        }

        .success {
            color: var(--lumo-success-text-color);
            background-color: var(--lumo-success-color-10pct);
        }

        .error {
            color: var(--lumo-error-text-color);
            background-color: var(--lumo-error-color-10pct);
        }
    `;

    static properties = {
        _statusMessage: {state: true},
        _statusType: {state: true}
    }

    constructor() {
        super();
        this._statusMessage = '';
        this._statusType = '';
    }

    render() {
        return html`
            <vaadin-button theme="primary" @click="${this._respawn}">
                <vaadin-icon icon="vaadin:flag" slot="prefix"></vaadin-icon>
                Respawn Into New Location
            </vaadin-button>
            ${this._statusMessage ? html`
                <div class="status-message ${this._statusType}">
                    ${this._statusMessage}
                </div>
            ` : ''}
        `;
    }

    _respawn() {
        this._statusMessage = 'Setting respawn point...';
        this._statusType = '';

        this.jsonRpc.setRespawn().then(() => {
            this._statusMessage = 'Respawn point set — killing player...';
            this._statusType = 'success';
            return this.jsonRpc.killPlayer();
        }).then(() => {
            this._statusMessage = 'Respawning at new location';
            this._statusType = 'success';
            setTimeout(() => {
                this._statusMessage = '';
                this._statusType = '';
            }, 3000);
        }).catch(error => {
            this._statusMessage = `Error: ${error.message || 'Failed to respawn'}`;
            this._statusType = 'error';
        });
    }
}

customElements.define('qwc-minecraft-respawn', QwcMinecraftRespawn);

// Made with Bob
