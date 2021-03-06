﻿Ext.define('QDT.view.inspection.Prioritize', {
    extend: 'Ext.window.Window',
    alias: 'widget.inspection-prioritize',
    title: Profile.getText('Prioritize'),
    width:350,
    resizable: false,
    selected_inspections: '',
    prioritize_by: null,
    prioritize_by_name: null,
    initComponent: function () {
        var me = this;

        me.items = [{
          xtype: 'form',
          layout:'anchor',
          frame: true,
          api: { submit: DpInspection.SetUrgent },
          defaults: {
              margin: '5 5 5 5',
              labelWidth:75
          },
          items: [{
              xtype: 'displayfield',
              fieldLabel: Profile.getText('PrioritizeBy'),
              value: me.prioritize_by_name
          }, {
              xtype: 'textfield',
              name: 'prioritize_by',
              value: me.prioritize_by,
              hidden: true,
              submitValue: true
          }, {
              xtype: 'textfield',
              fieldLabel: Profile.getText('urgent_reason'),
              name:'reason',
              anchor:'100%'
          }, {
              xtype: 'textfield',
              name: 'selected_inspections',
              hidden: true,
              value: me.selected_inspections,
              submitValue: true
          }],
          buttons: [{
              xtype: 'button',
              text: Profile.getText('Submit'),
              iconCls: 'submit',
              margin: '5 5 5 5',
              anchor: '100%',
              handler: function () {
                  me.down('form').submit({
                      waitMsg: Profile.getText('Saving'),
                      success: function (form, action) {
                          me.close();
                          if (action.result.success) {
                              My.Msg.warning('保存结果成功！');
                          } else {
                              My.Msg.warning('保存结果失败');
                          }
                          cq.query('inspection-maingrid')[0].store.reload();
                          cq.query('inspection-maingrid')[0].getSelectionModel().deselectAll();
                         
                      },
                      failure: function (form, action) {
                          My.Msg.info(Profile.getText('Error'), action.result.errorMessage);
                      }
                  });
              }
          }, {
               xtype: 'button',
               text: Profile.getText('Close'),
               margin: '0 5 5 ',
               iconCls: 'cancel',
               handler: function () {
                   me.close();
               }
           }]
        }];


    
        me.callParent();
    }
});