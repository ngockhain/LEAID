import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';

// You can also import styles from another file
// if you prefer to keep your CSS seperate from your component
import { styles as sharedStyles } from '../../styles/shared-styles'

import '@shoelace-style/shoelace/dist/components/card/card.js';
import '@shoelace-style/shoelace/dist/components/input/input.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import { serialize } from '@shoelace-style/shoelace/dist/utilities/form.js';
import { formDataToObject, SaveAllRecordsToIndexedDB, getAllRecordsFromDB } from '../../lib/utils';

@customElement('app-videos')
export class AppVideos extends LitElement {
  static styles = [
    sharedStyles
  ];

  @state()
  videosList = [
    { file_name: '13123123', file_path: '123123.com/video', id: -1, delete: '0' },
    { file_name: '13123123', file_path: '123123.com/video', id: -1, delete: '0' },
    { file_name: '13123123', file_path: '123123.com/video', id: -1, delete: '0' },
    { file_name: '13123123', file_path: '123123.com/video', id: -1, delete: '0' },
    { file_name: '13123123', file_path: '123123.com/video', id: -1, delete: '0' },
  ];

  @query('#videos_form')
  videos_form!: HTMLFormElement;

  @query('#alertMsg')
  alert_dialog!: HTMLDialogElement;

  constructor() {
    super();
    this.loadFormHandler();
  }

  render() {
    return html`
      <app-header ?enableBack="${true}"></app-header>
      <sl-button style='margin-top: 50px;' variant="success" @click=${this.addRow}>Add</sl-button>
      <form id='videos_form'>
        <table>
          <thead>
            <th>Index</th>
            <th>Video name</th>
            <th>Video path</th>
          </thead>
          <tbody>
            ${this.videosList.map((video, idx) =>
            html`
              <tr style=${video.delete == '1' ? 'display: none;': ''}>
                <td><sl-input name=${`${idx}.id`} value=${video.id} disabled required></sl-input></td>
                <td><sl-input name=${`${idx}.file_name`} value=${video.file_name} required></sl-input></td>
                <td><sl-input name=${`${idx}.file_path`} value=${video.file_path} required></sl-input></td>
                <td>
                  <sl-input name=${`${idx}.id`} style="display: none;" value=${video.id} required></sl-input>
                  <sl-input name=${`${idx}.delete`} style="display: none;" value=${video.delete} required></sl-input>
                </td>
                <td>
                  <sl-button variant="danger" @click=${() => {this.deleteRow(idx)}}>
                    Delete
                  </sl-button>
                </td>
              </tr>`
            )}
          </tbody>
        </table>
        <br />
        <sl-button type="button" variant="primary" @click=${this.saveFormHandler}>Save data to indexed DB</sl-button>
        <sl-button type="button" variant="primary" @click=${this.loadFormHandler}>Load data from indexed DB</sl-button>
      </form>
    `;
  }

  saveFormHandler = () => {
    const data = serialize(this.videos_form);
    const videoData = formDataToObject(data);
    SaveAllRecordsToIndexedDB(videoData);
    this.loadFormHandler();
  }

  loadFormHandler = () => {
    let self = this;
    getAllRecordsFromDB().then(function (res: any) {
      self.videosList = res
    });
  }

  addRow = () => {
    this.videosList = [
      ...this.videosList,
      { id: -1, file_name: '', file_path: '', delete: '0' }
    ]
  }

  deleteRow = (key: number) => {
    if (this.videosList[key]) {
      let newState = [...this.videosList];
      newState[key].delete = '1';
      this.videosList = newState;
    }
  }
}
