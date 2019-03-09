import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-image/iron-image.js';
import 'lite-signal/lite-signal.js';
import '@polymer/iron-pages/iron-pages.js';
import '@polymer/paper-fab/paper-fab.js';
import '@polymer/paper-tabs/paper-tabs.js';
import '@polymer/paper-tabs/paper-tab.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-input/paper-textarea.js';
import '@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import { ypLanguageBehavior } from '../yp-behaviors/yp-language-behavior.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import { ypOfficialStatusOptions } from '../yp-behaviors/yp-official-status-options.js';
import '../yp-ajax/yp-ajax.js';
import { WordWrap } from '../yp-behaviors/word-wrap.js';
import { ypPostMoveBehavior } from '../yp-post/yp-post-move-behavior.js';
import './yp-bulk-status-update-templates.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
Polymer({
  _template: html`
    <style include="iron-flex iron-flex-alignment">
      #dialog {
        width: 100%;
        max-height: 100%;
        background-color: #f0f0f0;
      }

      .postsList {
        color: #000;
        height: 800px;
        width: 100%;
        overflow: auto;
      }

      .pageItem {
        padding-right: 16px;
      }

      .postOfficialStatus {
        width: 100px;
      }

      .postName {
        max-width: 600px;
        font-size: 18px;
        padding-right: 8px;
      }

      .groupName {
        width: 100%;
        border-bottom: 1px dashed;
        margin-bottom: 16px;
        font-size: 22px;
      }

      .postIgnore {
        width: 90px;
      }

      .postDropdown {
        width: 150px;
        margin: 16px;
      }

      #editPageLocale {
        width: 80%;
        max-height: 80%;
        background-color: #FFF;
      }

      .locale {
        width: 30px;
        cursor: pointer;
      }

      paper-textarea {
        height: 200px;
        max-height: 220px;
        overflow: auto;
      }

      .localeInput {
        width: 26px;
      }

      .pageItem {
        padding-top: 8px;
      }

      paper-listbox {
        z-index: 100;
      }

      .dropdown-content {
        z-index: 1000;
      }

      paper-item {
        z-index: 10000;
      }

      .postUniqueMessage {
        width: 300px;
      }

      a {
        color: #333;
      }

      paper-material {
        margin: 16px;
        padding: 24px;
        background-color: #FFF;
      }

      .postItem {
        height: 300px;
        min-height: 300px;
      }

      paper-tab {
        font-size: 14px;
      }

      .id {
        width: 60px;
        font-size: 18px;
      }

      paper-listbox {
        max-height: 220px;
      }
    </style>
    <lite-signal on-lite-signal-yp-language="_languageEvent"></lite-signal>
    <lite-signal on-lite-signal-bulk-status-updates-templates="_updatedTemplates"></lite-signal>

    <paper-dialog id="dialog" modal="">
      <h2>[[t('bulkStatusUdateConfig')]]</h2>
      <paper-dialog-scrollable>
        <div class="layout horizontal wrap">
          <paper-tabs selected="{{selectedGroup}}" attr-for-selected="name">
            <template is="dom-repeat" items="[[config.groups]]" as="group">
              <paper-tab name="[[group.name]]">[[_getHeadGroupName(group.name)]]</paper-tab>
            </template>
          </paper-tabs>
        </div>
        <iron-pages attr-for-selected="name" selected="{{selectedGroup}}">
          <template is="dom-repeat" items="[[config.groups]]" as="group">
            <section name="[[group.name]]">
              <div class="layout vertical postsList">
                <template is="dom-if" if="[[_selectedGroup(selectedGroup, group.name)]]">
                  <template is="dom-repeat" items="[[_orderPosts(group.posts)]]" as="post">
                    <div class="layout horizontal postItem">
                      <paper-material elevation="2" class="layout horizontal">
                        <div class="layout vertical">
                          <div class="layout horizontal">
                            <div class="id">[[post.id]]</div>
                            <div class="postName">
                              <a target="_blank" href="/post/[[post.id]]">[[post.name]]</a>
                            </div>
                            <div class="postOfficialStatus">
                              [[_officialStatusOptionsName(post.currentOfficialStatus)]]
                            </div>
                          </div>
                          <div class="layout horizontal">
                            <div class="postDropdown">
                              <paper-dropdown-menu label="[[t('post.statusChangeSelectNewStatus')]]">
                                <paper-listbox slot="dropdown-content" attr-for-selected="name" data-args\$="[[post]]" selected="{{post.newOfficialStatus}}" on-iron-select="_selectNewOfficialStatus">
                                  <template is="dom-repeat" items="[[officialStatusOptions]]" as="statusOption">
                                    <paper-item name="[[statusOption.official_value]]">[[statusOption.translatedName]]</paper-item>
                                  </template>
                                </paper-listbox>
                              </paper-dropdown-menu>
                            </div>
                            <div class="postDropdown">
                              <paper-dropdown-menu label="[[t('selectStatusTemplate')]]">
                                <paper-listbox slot="dropdown-content" attr-for-selected="name" data-args\$="[[post]]" selected="{{post.selectedTemplateName}}">
                                  <template is="dom-repeat" items="[[templatesWithNone]]" as="templateOption">
                                    <paper-item name="[[templateOption.title]]">[[templateOption.title]]</paper-item>
                                  </template>
                                </paper-listbox>
                              </paper-dropdown-menu>
                            </div>
                            <div class="postDropdown">
                              <paper-dropdown-menu label="[[t('moveToGroup')]]">
                                <paper-listbox slot="dropdown-content" attr-for-selected="name" data-args\$="[[post]]" selected="{{post.moveToGroupId}}">
                                  <template is="dom-repeat" items="[[availableGroups]]" as="group">
                                    <paper-item name="[[group.id]]">[[group.name]]</paper-item>
                                  </template>
                                </paper-listbox>
                              </paper-dropdown-menu>
                            </div>
                            <div class="postUniqueMessage">
                              <paper-textarea id="emailFooter" name="emailFooter" always-float-label="[[post.uniqueStatusMessage]]" value="{{post.uniqueStatusMessage}}" label="[[t('uniqueStatusMessage')]]" rows="4" max-rows="4" maxlength="30000" class="mainInput">
                              </paper-textarea>
                            </div>
                          </div>
                        </div>
                      </paper-material>
                    </div>
                  </template>
                </template>
              </div>
            </section>
          </template>
        </iron-pages>

        <div class="layout horizontal center-center">
          <yp-ajax method="GET" id="getAvailableGroupsAjax" url="/api/users/available/groups" on-response="_getGroupsResponse"></yp-ajax>
          <yp-ajax method="PUT" id="updateConfigAjax" url="/api/bulk_status_updates/[[bulkStatusUpdate.community_id]]/[[bulkStatusUpdate.id]]/updateConfig" on-response="_updateConfigResponse"></yp-ajax>
          <yp-ajax method="GET" id="getBulkStatusUpdatesAjax" on-response="_bulkStatusUpdateResponse"></yp-ajax>
        </div>
      </paper-dialog-scrollable>
      <div class="buttons">
        <paper-button on-tap="_saveAndClose">[[t('close')]]</paper-button>
        <paper-button on-tap="_editTemplates">[[t('editTemplates')]]</paper-button>
        <paper-button on-tap="_save">[[t('save')]]</paper-button>
      </div>

    </paper-dialog>
`,

  is: 'yp-bulk-status-update-config',

  behaviors: [
    ypLanguageBehavior,
    AccessHelpers,
    WordWrap,
    ypOfficialStatusOptions,
    ypPostMoveBehavior
  ],

  properties: {
    bulkStatusUpdates: {
      type: Array,
      notify: true
    },

    templates: {
      type: Array,
      notify: true
    },

    communityId: Number,

    headerText: {
      type: String
    },

    selected: {
      type: Object
    },

    config: {
      type: Object,
      observer: '_configChanged'
    },

    haveGotMoveGroups: {
      type: Boolean,
      value: false
    },

    selectedGroup: String,

    closeAfterSave: {
      type: Boolean,
      value: false
    },

    templatesWithNone: {
      type: Array,
      computed: '_templatesWithNone(templates)'
    }
  },

  _getGroupsResponse: function (event, detail) {
    if (detail.response) {
      var groups = [];
      groups = groups.concat(window.appUser.adminRights.GroupAdmins, window.appUser.memberships.GroupUsers);
      groups = groups.concat(detail.response.groups);
      groups = this._uniqueInDomain(groups, detail.response.domainId);
      //this.set("availableGroups", groups);
    }
  },

  _templatesWithNone: function (templates) {
    if (templates) {
      return this.templates.concat(['None']);
    } else {
      return ['None'];
    }
  },

  _onIronResize: function(e) {
    e.stopImmediatePropagation();
  },

  _getHeadGroupName: function (name) {
    if (name)
      return name.split(' ')[0];
    else
      return "";
  },

  _selectedGroup: function (selectedGroup, currentGroup) {
    console.log(selectedGroup+" - "+currentGroup);
    return selectedGroup == currentGroup;
  },

  reset: function () {
    this.set('config', null);
    this.set('templates', null);
    this.set('bulkStatusUpdates', null);
  },

  observers: [
    '_templatesChanged(templates.*)',
    '_groupsChanged(config.*)'
  ],

  _saveAndClose: function () {
    this.set('closeAfterSave', true);
    this._save();
  },

  _orderPosts: function (posts) {
    return posts.sort(function (a, b) {
      return a.id-b.id;
    });
  },

  _updatedTemplates: function (event, detail) {
    this.set('templates', detail);
    this.$.updateConfigAjax.body = { configValue: this.templates, configName: 'templates' };
    this.$.updateConfigAjax.generateRequest();
  },

  _templatesChanged: function (change) {
  },

  _groupsChanged: function (change) {
  },

  _save: function () {
    this.$.updateConfigAjax.body = { configValue: this.config, configName: 'config' };
    this.$.updateConfigAjax.generateRequest();
  },

  _selectNewOfficialStatus: function (event, detail) {
    var newOfficialStatus = detail.item.name;
    var post = JSON.parse(event.target.getAttribute('data-args'));
    var configCopy = JSON.parse(JSON.stringify(this.config));
    this.config.groups.forEach(function (group, groupIndex) {
      group.posts.forEach(function (inPost, postIndex) {
        if (post.id == inPost.id) {
          configCopy.groups[groupIndex].posts[postIndex].newOfficialStatus = newOfficialStatus;
        }
      }.bind(this));
    }.bind(this));
    this.set('config', configCopy);
  },

  _configChanged: function (config) {
    if (config && !this.haveGotMoveGroups) {
      this.$.getAvailableGroupsAjax.generateRequest();
      this.set('haveGotMoveGroups', true);
    }
  },

  _updateConfigResponse: function () {
    window.appGlobals.notifyUserViaToast(this.t('saved'));
    if (this.closeAfterSave) {
      this.set('closeAfterSave', false);
      this.$.dialog.close();
    }
  },

  _newBulkStatusUpdate: function () {
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEdit", function (dialog) {
      dialog.setup(null, true, null);
      dialog.open('new', {});
    });
  },

  _editBulkStatusUpdate: function (event) {
    var bulkStatusUpdate = JSON.parse(event.target.getAttribute('data-args'));
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEdit", function (dialog) {
      dialog._clear();
      dialog.setup(bulkStatusUpdate, false, null);
      dialog.open('edit', {bulkStatusUpdateId: bulkStatusUpdate.id});
    });
  },

  _editTemplates: function () {
    dom(document).querySelector('yp-app').getDialogAsync("bulkStatusUpdateEditTemplates", function (dialog) {
      dialog.open(this.templates);
    }.bind(this));
  },

  open: function (bulkStatusUpdate) {
    this.set('config', bulkStatusUpdate.config);
    this.set('templates', bulkStatusUpdate.templates);
    this.set('bulkStatusUpdate', bulkStatusUpdate);
    this.$.dialog.open();
  }
});
