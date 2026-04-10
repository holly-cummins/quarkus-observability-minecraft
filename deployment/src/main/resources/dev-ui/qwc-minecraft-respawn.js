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
            gap: 20px;
            padding: 20px;
        }
        
        .control-section {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .button-container {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        
        vaadin-button {
            cursor: pointer;
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
            <div class="control-section">
                <h3>Minecraft Player Controls</h3>
                <div class="button-container">
                    <vaadin-button theme="primary" @click="${this._setRespawn}">
                        <vaadin-icon icon="vaadin:flag" slot="prefix"></vaadin-icon>
                        Set Respawn Point
                    </vaadin-button>
                </div>
                ${this._statusMessage ? html`
                    <div class="status-message ${this._statusType}">
                        ${this._statusMessage}
                    </div>
                ` : ''}
            </div>
        `;
    }

    _setRespawn() {
        this._statusMessage = 'Setting respawn point...';
        this._statusType = '';
        
        this.jsonRpc.setRespawn().then(response => {
            this._statusMessage = 'Respawn point set successfully!';
            this._statusType = 'success';
            setTimeout(() => {
                this._statusMessage = '';
                this._statusType = '';
            }, 3000);
        }).catch(error => {
            this._statusMessage = `Error: ${error.message || 'Failed to set respawn point'}`;
            this._statusType = 'error';
        });
    }
}

customElements.define('qwc-minecraft-respawn', QwcMinecraftRespawn);

// Made with Bob
