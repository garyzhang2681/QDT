Ext.define('Asz.ux.MultipleAttachments', {
    extend: 'Ext.container.Container',
    alias: 'widget.multipleattachments',
    nameBase: '',
    fieldCount: 0,
    fieldMargin: '5 0 5 5',
    fieldWidth: 200,

    initComponent: function () {
        var me = this;
        me.items = [{
            iconCls:'add',
            xtype: 'button',
            text: Profile.getText("AddAttachment"),
            width: '80px',
            handler: function () {
                me.addAttachment();
            }
        }];
        me.callParent();
    },

    getNewInstance: function () {
        var me = this;
        var attachment = Ext.create('Ext.container.Container', {
            itemId: 'com' + this.fieldCount,
            layout: 'column',
            defaults:{
              frame:true,
              border:false  
            },
            border: false,
            items: [{
                columnWidth: .1,
                layout: 'form',
                labelWidth: 2,
                bodyStyle: 'padding: 10px 3px;',
                items: [{
                    text: '',
                    iconCls: 'delete',
                    tooltip: Profile.getText('deleteAttachment'),
                    xtype: 'button',
                    handler: function () {
                        me.removeAttachment(attachment);
                    }
                }]
            }, {
                columnWidth: .8,
                layout: 'form',
                bodyStyle: 'padding: 10px 10px;',

                items: [{
                    xtype: 'filefield',
                    name: me.nameBase + (++me.fieldCount).toString(),
                    fieldLabel: Profile.getText('attachment'),
                    labelWidth: 50,
                    msgTarget: 'side',
                    anchor: '90%',
                    allowBlank : true,  
                    buttonText: Profile.getText('browse')
                }]
            }]
        });
        return attachment;
    },

    addAttachment: function () {
        this.insert(this.fieldCount + 1, this.getNewInstance());
    },

    removeAttachment: function (attachment) {
        attachment.down('filefield').submitValue = false;
        this.remove(attachment, true);    //TODO, the filefield is not removed actually
    }
});